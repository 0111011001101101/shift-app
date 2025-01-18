import { Trophy, Star, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function StreakCard() {
  const { data: todayStandUp } = useQuery({
    queryKey: ["todayStandUp"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from("stand_ups")
        .select("*")
        .gte("created_at", today.toISOString())
        .lt("created_at", new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString())
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  return (
    <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/30 via-secondary/40 to-primary/30 backdrop-blur-sm border border-amber-500/40 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/40 blur-xl rounded-full" />
            <div className="relative p-2 bg-gradient-to-br from-amber-500/50 to-secondary/50 rounded-xl backdrop-blur-sm">
              <Trophy className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Current Streak</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-black relative">7</span>
              <span className="text-xs text-gray-700 dark:text-gray-300">days</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {todayStandUp?.completed ? (
            <div className="flex items-center gap-1 px-3 py-1 bg-success/10 text-success rounded-full text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Done today</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 bg-warning/10 text-warning rounded-full text-sm">
              <XCircle className="w-4 h-4" />
              <span>Not done yet</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-700 dark:text-gray-300 mt-4 flex items-center gap-1 justify-center">
        <Clock className="w-3 h-3" />
        Next stand-up: Tomorrow, 9:30
      </p>
    </div>
  );
}