
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StandUpDialog } from "../stand-up/StandUpDialog";
import { Button } from "../ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeHeaderProps {
  username?: string;
  children?: React.ReactNode;
}

export function WelcomeHeader({ username = "there", children }: WelcomeHeaderProps) {
  const [showStandUp, setShowStandUp] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { data: todayStandUp, isLoading } = useQuery({
    queryKey: ["todayStandUp"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const { data, error } = await supabase
        .from("stand_ups")
        .select("*")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .gte("created_at", today.toISOString())
        .lt("created_at", tomorrow.toISOString())
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <AnimatePresence mode="wait">
        {mounted && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center py-2 mb-6"
          >
            <div className="text-center mb-5">
              <h1 className="text-3xl font-bold text-gradient">
                Hello, {username}
              </h1>
              <p className="text-gray-500 mt-1">
                Let's make today count
              </p>
            </div>
            
            {!isLoading && !todayStandUp?.completed ? (
              <motion.div
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <Button 
                  onClick={() => setShowStandUp(true)}
                  className="bg-primary text-white py-2.5 px-5 rounded-full text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  Morning Check-in
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            ) : todayStandUp?.completed ? (
              <motion.div
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex items-center gap-2 text-green-600 bg-green-50 py-2 px-4 rounded-full text-sm"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Check-in completed</span>
              </motion.div>
            ) : null}
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <StandUpDialog 
        open={showStandUp} 
        onOpenChange={setShowStandUp}
        completed={todayStandUp?.completed}
        standUpData={todayStandUp}
      />
    </>
  );
}
