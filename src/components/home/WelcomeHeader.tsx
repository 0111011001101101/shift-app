
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StandUpDialog } from "../stand-up/StandUpDialog";
import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

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
      <div className="flex flex-col items-center pt-2 pb-4">
        <div className="text-center mb-5">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent mb-1">
            Welcome, {username}
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Let's make today count
          </p>
        </div>
        
        {!todayStandUp?.completed && (
          <Button 
            onClick={() => setShowStandUp(true)}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg py-2 px-5 rounded-full text-xs flex items-center gap-2 transition-all duration-200 animate-pulse"
          >
            <Sparkles className="h-3 w-3" />
            Start Morning Check-in
            <ArrowRight className="h-3 w-3" />
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
