import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StandUpDialog } from "../stand-up/StandUpDialog";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeHeaderProps {
  username?: string;
  children?: React.ReactNode;
}

export function WelcomeHeader({ username = "there", children }: WelcomeHeaderProps) {
  const [showStandUp, setShowStandUp] = useState(false);
  const navigate = useNavigate();
  
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
        <div className="flex items-center justify-end">
          <Button 
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white/90 transition-colors shadow-sm"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-5 h-5 text-secondary-600" />
          </Button>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-black">Welcome back,</span>{" "}
            <span className="bg-gradient-to-r from-[#0EA5E9] to-[#F97316] bg-clip-text text-transparent">
              {username}
            </span>
          </h1>
          <p className="text-lg text-secondary-600 max-w-md mx-auto font-medium">
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