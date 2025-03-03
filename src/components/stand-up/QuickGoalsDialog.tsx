
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface QuickGoalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Goal {
  id: string;
  title: string;
  deadline?: string;
  todos?: {
    id: string;
    title: string;
    frequency?: string;
    completed?: boolean;
  }[];
}

export function QuickGoalsDialog({ open, onOpenChange }: QuickGoalsDialogProps) {
  const { data: goals, isLoading } = useQuery({
    queryKey: ["quick-goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select(`
          id,
          title,
          deadline,
          todos (
            id,
            text,
            frequency,
            completed
          )
        `)
        .order("position");

      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your Goals</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {goals?.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <h3 className="font-medium">{goal.title}</h3>
                {goal.todos?.length > 0 && (
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {goal.todos.map((todo) => (
                      <li key={todo.id} className="flex items-center gap-2">
                        <span className="w-4">•</span>
                        <span>{todo.text}</span>
                        {todo.frequency && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted">
                            {todo.frequency}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
