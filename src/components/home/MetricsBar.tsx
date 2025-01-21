import { Users, TrendingUp, Brain, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function MetricsBar() {
  const { data: metrics } = useQuery({
    queryKey: ['user-metrics'],
    queryFn: async () => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const { data: standUps } = await supabase
        .from('stand_ups')
        .select('mental_health')
        .eq('user_id', userId);
      
      return {
        activeUsers: '10,000+',
        mentalHealthImprovement: '73%',
        goalsAchieved: '150K+',
        retention: '92%'
      };
    }
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
            <p className="text-xl font-bold text-primary">{metrics?.activeUsers}</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Mental Health ↑</p>
            <p className="text-xl font-bold text-green-500">{metrics?.mentalHealthImprovement}</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Target className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Goals Achieved</p>
            <p className="text-xl font-bold text-secondary">{metrics?.goalsAchieved}</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Brain className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Retention</p>
            <p className="text-xl font-bold text-blue-500">{metrics?.retention}</p>
          </div>
        </div>
      </div>
    </div>
  );
}