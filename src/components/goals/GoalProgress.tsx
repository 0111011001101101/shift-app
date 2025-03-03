
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

interface GoalProgressProps {
  goalId?: string;
  value?: number; // Support direct percentage value
}

export function GoalProgress({ goalId, value }: GoalProgressProps) {
  const { data: progress, isLoading } = useQuery({
    queryKey: ["goalProgress", goalId],
    queryFn: async () => {
      // If we have a direct value or no goalId, don't fetch from the database
      if (value !== undefined || !goalId) return value ?? 0;

      const { data: subGoals, error } = await supabase
        .from("sub_goals")
        .select("completed")
        .eq("goal_id", goalId);

      if (error) throw error;

      if (!subGoals?.length) return 0;

      const completedCount = subGoals.filter((sg) => sg.completed).length;
      return Math.round((completedCount / subGoals.length) * 100);
    },
    enabled: !!goalId || value !== undefined,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const progressValue = value !== undefined ? value : progress ?? 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Progress</span>
        <div className="flex items-center gap-1">
          <CheckCircle2 
            className={`h-3.5 w-3.5 ${progressValue === 100 ? "text-success" : "text-muted-foreground"}`} 
          />
          <span className="text-xs font-medium">{progressValue}%</span>
        </div>
      </div>
      <Progress value={progressValue} className="h-1.5" />
    </div>
  );
}
