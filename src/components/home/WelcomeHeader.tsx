
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StandUpDialog } from "../stand-up/StandUpDialog";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface WelcomeHeaderProps {
  username?: string;
  children?: React.ReactNode;
}

export function WelcomeHeader({ username = "there", children }: WelcomeHeaderProps) {
  const [showStandUp, setShowStandUp] = useState(false);
  
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
      <div className="flex flex-col items-center justify-between py-2">
        <div className="text-center mb-3">
          <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent">
            Welcome back, {username}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Let's make today count
          </p>
        </div>
        
        {!todayStandUp?.completed && (
          <Button 
            onClick={() => setShowStandUp(true)}
            className="bg-white text-primary-600 hover:bg-gray-50 shadow-sm py-2 px-4 rounded-full text-sm flex items-center gap-2 border border-gray-100"
          >
            Start Morning Check-in
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
        {children}
      </div>

      <StandUpDialog 
        open={showStandUp} 
        onOpenChange={setShowStandUp}
        completed={todayStandUp?.completed}
        standUpData={todayStandUp}
      />
    </>
  );
}
