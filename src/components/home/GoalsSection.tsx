import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, ChevronRight, Plus, Brain, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/context/DemoContext";
import { useState } from "react";
import { format, isThisWeek, isToday, isAfter } from "date-fns";

interface Goal {
  id: string;
  title: string;
  deadline?: string;
  timeframe?: string;
  completed?: boolean;
  user_id?: string;
}

export function GoalsSection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();
  
  const [demoGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Start a business",
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      timeframe: "long-term",
      completed: false
    },
    {
      id: "2",
      title: "Improve fitness level",
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      timeframe: "long-term",
      completed: false
    },
    {
      id: "3",
      title: "Prepare presentation for client",
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), 
      timeframe: "week",
      completed: false
    }
  ]);
  
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      if (isDemoMode) {
        return { user: { id: "demo-user" } };
      }
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });
  
  const { data: goals, isLoading, error } = useQuery({
    queryKey: ["goals-home", session?.user?.id],
    queryFn: async () => {
      if (isDemoMode) {
        return demoGoals;
      }
      
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", session.user.id)
        .order("position");

      if (error) {
        console.error("Error fetching goals:", error);
        toast({
          title: "Error fetching goals",
          description: "Please try again later",
          variant: "destructive",
        });
        return [];
      }
      return data as Goal[];
    },
    enabled: isDemoMode || !!session?.user?.id,
  });

  const typedGoals = goals as Goal[];

  const longTermGoals = typedGoals?.filter(goal => 
    goal.timeframe === "long-term" || !goal.timeframe
  ).slice(0, 2) || [];
  
  const todayGoals = typedGoals?.filter(goal => 
    goal.timeframe === "today"
  ).slice(0, 2) || [];

  const thisWeekGoals = typedGoals?.filter(goal => 
    goal.timeframe === "week"
  ).slice(0, 2) || [];
  
  if (isLoading) {
    return (
      <Card className="p-5 border border-gray-100 shadow-sm animate-pulse h-48" />
    );
  }

  if (error) {
    return (
      <Card className="p-5 border border-gray-100 shadow-sm">
        <p className="text-muted-foreground">Error loading goals. Please try again later.</p>
      </Card>
    );
  }

  if (!goals?.length) {
    return (
      <Card className="p-5 border border-gray-100 shadow-sm bg-white">
        <div className="text-center space-y-4">
          <div className="mx-auto bg-primary-50 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <Target className="w-8 h-8 text-primary-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Set Meaningful Goals</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">Break down your ambitions into achievable steps that align with both your personal growth and wellbeing.</p>
          </div>
          <Button 
            onClick={() => navigate("/goals")} 
            className="mt-2 bg-primary-500 hover:bg-primary-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-5 border border-gray-100 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-500" />
          <span className="font-medium text-gray-800">Your Goals</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-primary-500 hover:text-primary-600 hover:bg-primary-50 group"
          onClick={() => navigate("/goals")}
        >
          View All
          <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {todayGoals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Today</span>
            </div>
            {todayGoals.map(goal => (
              <GoalItem key={goal.id} goal={goal} onClick={() => navigate("/goals")} />
            ))}
          </div>
        )}

        {thisWeekGoals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>This Week</span>
            </div>
            {thisWeekGoals.map(goal => (
              <GoalItem key={goal.id} goal={goal} onClick={() => navigate("/goals")} />
            ))}
          </div>
        )}

        {longTermGoals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Brain className="w-3.5 h-3.5" />
              <span>Long-term Vision</span>
            </div>
            {longTermGoals.map(goal => (
              <GoalItem key={goal.id} goal={goal} onClick={() => navigate("/goals")} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

interface GoalItemProps {
  goal: Goal;
  onClick: () => void;
}

function GoalItem({ goal, onClick }: GoalItemProps) {
  const isCompleted = goal.completed;
  const hasDeadline = goal.deadline && new Date(goal.deadline);
  const isDeadlineToday = hasDeadline && isToday(new Date(goal.deadline));
  const isDeadlineThisWeek = hasDeadline && isThisWeek(new Date(goal.deadline));
  const isDeadlinePassed = hasDeadline && isAfter(new Date(), new Date(goal.deadline));

  return (
    <div 
      className="p-3 border border-gray-100 hover:border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className={`font-medium text-sm ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
            {goal.title}
          </h3>
          {hasDeadline && (
            <p className="text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1 inline" />
              {isDeadlineToday 
                ? <span className="text-amber-500 font-medium">Due today</span>
                : isDeadlineThisWeek
                  ? <span className={isDeadlinePassed ? "text-red-500" : "text-amber-500"}>
                      Due {format(new Date(goal.deadline), "EEE")}
                    </span>
                  : <span className={isDeadlinePassed ? "text-red-500" : ""}>
                      Due {format(new Date(goal.deadline), "MMM d")}
                    </span>
              }
            </p>
          )}
        </div>
        <Badge 
          variant={isCompleted ? "outline" : "secondary"} 
          className={`text-xs px-2 py-0.5 ${isCompleted ? 'text-green-500 bg-green-50 hover:bg-green-50 border-green-100' : 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100 border-none'}`}
        >
          {isCompleted ? 'Done' : 'In Progress'}
        </Badge>
      </div>
    </div>
  );
}
