import { ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
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
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <div className="relative py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-primary-600 via-primary-500 to-accent bg-clip-text text-transparent animate-fadeIn">
                Hi {username}!
              </h1>
              <Sparkles className="w-6 h-6 text-primary-400 animate-float" />
            </div>
            <p className="text-lg font-medium tracking-wide text-secondary-700/90 animate-slideUp">
              Let's make things happen
            </p>
          </div>

          <Button
            onClick={() => setShowStandUp(true)}
            className="w-full bg-gradient-to-br from-white/90 via-white/80 to-primary-50/20 hover:to-primary-100/30 text-left p-6 h-auto border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group backdrop-blur-xl"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                {isLoading ? (
                  <div className="animate-pulse bg-primary-50 h-12 w-12 rounded-xl" />
                ) : todayStandUp?.completed ? (
                  <div className="p-3 bg-emerald-50/80 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                ) : (
                  <div className="p-3 bg-primary-50/80 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                    <XCircle className="w-6 h-6 text-primary-500" />
                  </div>
                )}
                <div className="text-left">
                  <h3 className="font-semibold text-secondary-800 group-hover:text-primary-600 transition-colors">
                    Morning Stand-up
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {todayStandUp?.completed 
                      ? "View today's check-in" 
                      : "Quick 2-min check-in"}
                  </p>
                </div>
              </div>
              <div className="text-primary-400 group-hover:text-primary-600 transition-colors">
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