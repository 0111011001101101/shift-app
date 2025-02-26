
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

interface GoalProgressProps {
  goalId: string;
}

export function GoalProgress({ goalId }: GoalProgressProps) {
  const { data: progress, isLoading } = useQuery({
    queryKey: ["goalProgress", goalId],
    queryFn: async () => {
      const { data: subGoals, error } = await supabase
        .from("sub_goals")
        .select("completed")
        .eq("goal_id", goalId);

      if (error) throw error;

      if (!subGoals?.length) return 0;

      const completedCount = subGoals.filter((sg) => sg.completed).length;
      return Math.round((completedCount / subGoals.length) * 100);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Calculating progress...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Progress</span>
        <div className="flex items-center gap-1">
          <CheckCircle2 className={`h-4 w-4 ${progress === 100 ? "text-success" : "text-muted-foreground"}`} />
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
