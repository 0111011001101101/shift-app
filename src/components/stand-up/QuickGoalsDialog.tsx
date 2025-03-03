
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface QuickGoalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Goal {
  id: string;
  title: string;
  deadline?: string;
  timeframe?: string;
  completed?: boolean;
  todos?: {
    id: string;
    text: string;
    frequency?: string;
    completed?: boolean;
  }[];
}

export function QuickGoalsDialog({ open, onOpenChange }: QuickGoalsDialogProps) {
  const navigate = useNavigate();
  
  const { data: goals, isLoading } = useQuery({
    queryKey: ["quick-goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select(`
          id,
          title,
          deadline,
          timeframe,
          completed,
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

  // Group goals by timeframe
  const groupedGoals = goals?.reduce<Record<string, Goal[]>>((acc, goal) => {
    const timeframe = goal.timeframe || 'long-term';
    if (!acc[timeframe]) {
      acc[timeframe] = [];
    }
    acc[timeframe].push(goal);
    return acc;
  }, {}) || {};

  // Define timeframes for order
  const timeframeOrder = ['today', 'week', 'month', 'long-term'];
  const timeframeLabels: Record<string, string> = {
    'today': 'Today',
    'week': 'This Week',
    'month': 'This Month',
    'long-term': 'Long-term'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto bg-gradient-to-br from-white via-primary-50/20 to-secondary-50/20 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Your Goals
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : goals?.length === 0 ? (
          <div className="p-6 text-center space-y-3">
            <p className="text-secondary-600">No goals found. Start by creating your first goal!</p>
            <Button 
              onClick={() => {
                onOpenChange(false);
                navigate("/goals");
              }}
              className="mt-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white"
            >
              Go to Goals
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {timeframeOrder.map(timeframe => {
              const timeframeGoals = groupedGoals[timeframe] || [];
              
              if (timeframeGoals.length === 0) return null;
              
              return (
                <div key={timeframe} className="space-y-3">
                  <h3 className="font-medium text-sm text-primary-600 px-1">
                    {timeframeLabels[timeframe]}
                  </h3>
                  
                  <div className="space-y-2">
                    {timeframeGoals.map((goal) => (
                      <div 
                        key={goal.id} 
                        className={`p-3 rounded-xl transition-all ${
                          goal.completed 
                            ? 'bg-primary-50/50 border border-primary-100/50' 
                            : 'bg-white/70 border border-primary-100/30 hover:bg-white/90'
                        } shadow-sm`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-full ${
                              goal.completed ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <h4 className={`font-medium text-sm ${
                              goal.completed ? 'text-primary-600 line-through opacity-70' : 'text-secondary-800'
                            }`}>
                              {goal.title}
                            </h4>
                          </div>
                          
                          {goal.deadline && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3 mr-1" />
                              {format(new Date(goal.deadline), "MMM d")}
                            </div>
                          )}
                        </div>
                        
                        {goal.todos?.length > 0 && (
                          <ul className="mt-2 pl-7 space-y-1">
                            {goal.todos
                              .filter(todo => !todo.completed)
                              .slice(0, 2)
                              .map((todo) => (
                                <li key={todo.id} className="text-xs text-muted-foreground flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-primary-300 inline-block"></span>
                                  <span>{todo.text}</span>
                                  {todo.frequency && (
                                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-muted text-xs">
                                      {todo.frequency}
                                    </span>
                                  )}
                                </li>
                            ))}
                            
                            {goal.todos.filter(todo => !todo.completed).length > 2 && (
                              <li className="text-xs text-primary-500 font-medium pl-1">
                                +{goal.todos.filter(todo => !todo.completed).length - 2} more tasks
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            <div className="pt-2 flex justify-end">
              <Button 
                onClick={() => {
                  onOpenChange(false);
                  navigate("/goals");
                }}
                variant="outline"
                size="sm"
                className="text-xs border-primary-100 hover:bg-primary-50"
              >
                View All Goals
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
