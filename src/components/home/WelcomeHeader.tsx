
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StandUpDialog } from "../stand-up/StandUpDialog";
import { Button } from "../ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
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

  const headerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -10 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {mounted && (
          <motion.div 
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center py-3 mb-6"
          >
            <motion.div 
              variants={itemVariants}
              className="text-center mb-5 relative"
            >
              <h1 className="text-3xl font-bold">
                Hello, <span className="text-gradient relative">
                  {username}
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                    className="absolute -right-6 -top-2"
                  >
                    ✨
                  </motion.span>
                </span>
              </h1>
              <p className="text-gray-500 mt-1.5 max-w-[280px] mx-auto">
                Let's make today count
              </p>
            </motion.div>
            
            {!isLoading && !todayStandUp?.completed ? (
              <motion.div
                variants={itemVariants}
                className="w-full max-w-[260px]"
              >
                <Button 
                  onClick={() => setShowStandUp(true)}
                  className="bg-primary hover:bg-primary-600 text-white w-full py-3 px-5 rounded-full text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Morning Check-in
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            ) : todayStandUp?.completed ? (
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 text-green-600 bg-green-50 py-2 px-4 rounded-full text-sm shadow-sm"
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
