
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, ChevronRight, Plus, ArrowRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/context/DemoContext";
import { useState } from "react";
import { format, isAfter } from "date-fns";

interface Goal {
  id: string;
  title: string;
  deadline?: string;
  timeframe?: string;
  completed?: boolean;
  user_id?: string;
  category?: string;
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
      category: "work",
      completed: false
    },
    {
      id: "2",
      title: "Improve fitness level",
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      timeframe: "long-term",
      category: "health",
      completed: false
    },
    {
      id: "3",
      title: "Prepare presentation for client",
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), 
      timeframe: "week",
      category: "work",
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
  
  const thisWeekGoals = typedGoals?.filter(goal => 
    goal.timeframe === "week"
  ).slice(0, 2) || [];
  
  if (isLoading) {
    return (
      <Card className="p-4 shadow-sm animate-pulse h-40 border-none rounded-xl" />
    );
  }

  if (error) {
    return (
      <Card className="p-4 shadow-sm border-none rounded-xl">
        <p className="text-muted-foreground">Error loading goals. Please try again later.</p>
      </Card>
    );
  }

  if (!goals?.length) {
    return (
      <Card className="p-5 shadow-sm bg-white border-none rounded-xl">
        <div className="text-center space-y-3">
          <div className="mx-auto bg-primary-50 p-3 rounded-full w-14 h-14 flex items-center justify-center">
            <Target className="w-7 h-7 text-primary-500" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-1">Set Meaningful Goals</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">Break down your ambitions into achievable steps that align with both your personal growth and wellbeing.</p>
          </div>
          <Button 
            onClick={() => navigate("/goals")} 
            className="mt-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border-none"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-4 shadow-sm bg-white border-none rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-500" />
          </div>
          <span className="font-medium text-gray-800">Your Path to Success</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-primary-500 hover:text-primary-600 hover:bg-primary-50 group px-0"
          onClick={() => navigate("/goals")}
        >
          View All
          <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
      
      {thisWeekGoals.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-secondary-500 mr-2"></div>
              <h4 className="text-sm font-medium text-gray-700">This Week</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/goals", { state: { timeframe: "week" } })}
              className="text-xs text-gray-500 h-6 px-1 py-0"
            >
              View All <ArrowRight className="w-3 h-3 ml-0.5" />
            </Button>
          </div>
          <div className="space-y-2">
            {thisWeekGoals.map(goal => (
              <GoalItem key={goal.id} goal={goal} onClick={() => navigate("/goals")} />
            ))}
          </div>
        </div>
      )}

      {longTermGoals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <h4 className="text-sm font-medium text-gray-700">Long-term Vision</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/goals", { state: { timeframe: "long-term" } })}
              className="text-xs text-gray-500 h-6 px-1 py-0"
            >
              View All <ArrowRight className="w-3 h-3 ml-0.5" />
            </Button>
          </div>
          <div className="space-y-2">
            {longTermGoals.map(goal => (
              <GoalItem key={goal.id} goal={goal} onClick={() => navigate("/goals")} />
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={() => navigate("/goals")}
        variant="outline"
        size="sm"
        className="mt-4 text-xs text-primary-600 border-primary-200 hover:bg-primary-50 w-full rounded-full flex items-center justify-center"
      >
        See All Goals <ArrowRight className="w-3 h-3 ml-1" />
      </Button>
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
  const isDeadlinePassed = hasDeadline && isAfter(new Date(), new Date(goal.deadline));

  return (
    <div 
      className="p-2.5 border border-gray-100 hover:border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div className="space-y-0.5 flex-1">
          <h3 className={`font-medium text-sm ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
            {goal.title}
          </h3>
          <div className="flex flex-wrap gap-2 items-center">
            {goal.category && (
              <span className="text-2xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                {goal.category}
              </span>
            )}
            {hasDeadline && (
              <span className={`text-2xs flex items-center ${isDeadlinePassed ? "text-red-500" : "text-gray-500"}`}>
                <Calendar className="w-3 h-3 mr-0.5 inline" />
                {format(new Date(goal.deadline), "MMM d")}
              </span>
            )}
          </div>
        </div>
        <div className="ml-2">
          <span className={`text-xs px-2 py-1 rounded-full ${isCompleted 
            ? 'text-green-600 bg-green-50' 
            : 'text-purple-600 bg-purple-50'
          }`}>
            {isCompleted ? 'Done' : 'In Progress'}
          </span>
        </div>
      </div>
    </div>
  );
}
