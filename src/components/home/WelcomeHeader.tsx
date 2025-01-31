import { ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, ArrowUp, Brain } from "lucide-react";
import { StandUpDialog } from "../stand-up/StandUpDialog";
import { Button } from "../ui/button";

interface WelcomeHeaderProps {
  username?: string;
  children?: ReactNode;
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
      <div className="relative py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent">
                  <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-medium tracking-tight text-black">SHIFT</span>
              </div>
              <h1 className="text-[2rem] leading-[1.1] font-medium tracking-tight">
                Peak Performance,{" "}
                <span className="bg-gradient-to-r from-[#0EA5E9] via-[#8E9196] to-[#F97316] bg-clip-text text-transparent">
                  Zero Burnout
                </span>
              </h1>
              <p className="text-lg sm:text-xl leading-tight font-medium bg-gradient-to-r from-black/70 to-black/60 bg-clip-text text-transparent">
                A mental health & productivity app in one.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowStandUp(true)}
            className="w-full group relative overflow-hidden hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] opacity-90 rounded-2xl" />
            <div className="relative flex items-center justify-between w-full p-6">
              <div className="flex items-center gap-4">
                {isLoading ? (
                  <div className="animate-pulse bg-white/20 h-12 w-12 rounded-xl" />
                ) : todayStandUp?.completed ? (
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="text-left">
                  <h3 className="font-semibold text-white">
                    AI Coach Check-in
                  </h3>
                  <p className="text-sm text-white/90">
                    {todayStandUp?.completed 
                      ? "View today's check-in" 
                      : "Quick 2-min check-in"}
                  </p>
                </div>
              </div>
              <div className="text-white/90">
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Button>
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