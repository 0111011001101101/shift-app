import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUp } from "lucide-react";
import { StandUpDialog } from "../stand-up/StandUpDialog";
import { Button } from "../ui/button";

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
      <div className="relative space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 via-primary-400 to-accent shadow-lg">
              <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-medium tracking-tight text-black">SHIFT</span>
          </div>
          <Button 
            variant="ghost"
            className="text-sm font-medium text-black/70 hover:text-black transition-colors"
          >
            Settings
          </Button>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-black">Welcome back,</span>{" "}
            <span className="bg-gradient-to-r from-[#007BFF] to-[#F58634] bg-clip-text text-transparent">
              {username}
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Let's make today count.
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