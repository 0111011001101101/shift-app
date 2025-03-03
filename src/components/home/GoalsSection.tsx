import { Button } from "@/components/ui/button";
import { Target, ChevronRight, Plus, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/context/DemoContext";
import { useState } from "react";
import { format } from "date-fns";

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
      <section className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
        <div className="h-20 bg-gray-100 rounded-lg" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
        <p className="text-secondary-700">Error loading goals. Please try again later.</p>
      </section>
    );
  }

  if (!goals?.length) {
    return (
      <section 
        className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm group cursor-pointer relative overflow-hidden" 
        onClick={() => navigate("/goals")}
      >
        <div className="text-center space-y-4 relative">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-primary-50 rounded-xl">
              <Target className="w-7 h-7 text-primary-500" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-800 mb-2">Set Meaningful Goals</h3>
            <p className="text-sm text-secondary-600 max-w-md mx-auto">
              Balance your ambitions and wellbeing with clear, achievable goals
            </p>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              navigate("/goals");
            }} 
            className="mt-4 bg-primary-500 hover:bg-primary-600 text-white border-0 transition-all duration-300 group font-medium"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
            Create Your First Goal
          </Button>
        </div>
      </section>
    );
  }
  
  return (
    <section className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Target className="w-5 h-5 text-primary-500" />
          </div>
          <h2 className="text-base font-medium text-secondary-800">Goals</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs hover:bg-primary-50 text-primary-500 group flex items-center gap-1"
          onClick={() => navigate("/goals")}
        >
          View All
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {todayGoals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-secondary-600 text-xs mb-1">
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
            <div className="flex items-center gap-2 text-secondary-600 text-xs mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>This Week</span>
            </div>
            {thisWeekGoals.map(goal => (
              <GoalItem key={goal.id} goal={goal} onClick={() => navigate("/goals")} />
            ))}
          </div>
        )}

        {longTermGoals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-secondary-600 text-xs mb-1">
              <Target className="w-3.5 h-3.5" />
              <span>Long-term Vision</span>
            </div>
            {longTermGoals.map(goal => (
              <GoalItem key={goal.id} goal={goal} onClick={() => navigate("/goals")} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface GoalItemProps {
  goal: Goal;
  onClick: () => void;
}

function GoalItem({ goal, onClick }: GoalItemProps) {
  return (
    <div 
      className="p-3 rounded-lg border border-gray-100 bg-gray-50 transition-all duration-300 hover:bg-white hover:shadow-sm group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-secondary-800 group-hover:text-primary-500 transition-colors text-sm">{goal.title}</h3>
          </div>
          {goal.deadline && (
            <p className="text-xs text-secondary-600 mt-1">
              {goal.timeframe === 'today' ? 'Today' : 
                goal.timeframe === 'week' ? 'This week' : 
                `Due: ${format(new Date(goal.deadline), "MMM d")}`}
            </p>
          )}
        </div>
        <div className="flex items-center">
          <span className={`text-xs px-2 py-0.5 ${goal.completed ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-secondary-600'} rounded-full font-medium`}>
            {goal.completed ? 'Done' : 'In Progress'}
          </span>
        </div>
      </div>
    </div>
  );
}
