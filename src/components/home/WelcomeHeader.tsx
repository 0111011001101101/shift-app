import { ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";
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
      <div className="py-6">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Hi {username}!
              </h1>
              <Sparkles className="w-6 h-6 text-primary-400 animate-pulse" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Let's make things happen
            </p>
          </div>

          <Button
            onClick={() => setShowStandUp(true)}
            variant="outline"
            className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/90 text-left p-4 h-auto border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow transition-all duration-300 group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-12 w-12 rounded-xl" />
                ) : todayStandUp?.completed ? (
                  <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl group-hover:scale-110 transition-transform">
                    <div className="w-6 h-6 text-primary-600 dark:text-primary-400">✓</div>
                  </div>
                ) : (
                  <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl group-hover:scale-110 transition-transform">
                    <div className="w-6 h-6 text-primary-600 dark:text-primary-400">×</div>
                  </div>
                )}
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Morning Stand-up
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {todayStandUp?.completed 
                      ? "View today's check-in" 
                      : "Quick 2-min check-in"}
                  </p>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-primary-500 transition-colors">
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