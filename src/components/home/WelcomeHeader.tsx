
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StandUpDialog } from "../stand-up/StandUpDialog";

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
      <div className="relative space-y-3">
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-2xl font-semibold text-secondary-800">
            Welcome back, {username}
          </h1>
          <p className="text-sm text-secondary-600 max-w-md mx-auto">
            Let's make today count
          </p>
        </div>
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
