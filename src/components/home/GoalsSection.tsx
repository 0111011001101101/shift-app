import { Button } from "@/components/ui/button";
import { Target, ChevronRight, Plus, Brain, Sparkles, Shield, TrendingUp, Clock } from "lucide-react";
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
  
  const { data: goals, isLoading, error } = useQuery({
    queryKey: ["goals-home"],
    queryFn: async () => {
      if (isDemoMode) {
        return demoGoals;
      }
      
      const { data, error } = await supabase
        .from("goals")
        .select("*")
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
      return data || [];
    },
  });

  const longTermGoals = goals?.filter(goal => 
    goal.timeframe === "long-term" || !goal.timeframe
  ).slice(0, 2) || [];
  
  const todayGoals = goals?.filter(goal => 
    goal.timeframe === "today"
  ).slice(0, 2) || [];

  const thisWeekGoals = goals?.filter(goal => 
    goal.timeframe === "week"
  ).slice(0, 2) || [];
  
  if (isLoading) {
    return (
      <section className="space-y-4 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] p-6 rounded-2xl border-0 shadow-lg animate-pulse">
        <div className="h-20 bg-white/20 rounded-lg" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] p-6 rounded-2xl border-0 shadow-lg">
        <p className="text-white">Error loading goals. Please try again later.</p>
      </section>
    );
  }

  if (!goals?.length) {
    return (
      <section className="space-y-4 bg-gradient-to-br from-[#8B5CF6] via-[#A78BFA] to-[#D946EF] p-6 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl group cursor-pointer relative overflow-hidden" onClick={() => navigate("/goals")}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:translate-y-[-120px] transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-3xl translate-y-32 -translate-x-32 group-hover:translate-y-[120px] transition-transform duration-700" />
        
        <div className="text-center space-y-4 relative">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-500">
              <Target className="w-8 h-8 text-white/90" />
            </div>
            <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-500 delay-100">
              <Brain className="w-8 h-8 text-white/90" />
            </div>
            <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-500 delay-200">
              <Shield className="w-8 h-8 text-white/90" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Balance Growth & Wellbeing</h3>
            <p className="text-sm text-white/80 max-w-md mx-auto">Set meaningful goals that align with both your ambitions and mental health. Break them down into achievable steps.</p>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              navigate("/goals");
            }} 
            className="mt-4 bg-white hover:bg-white/90 text-[#8B5CF6] border-0 transition-all duration-300 group font-medium shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
            Create Your First Goal
          </Button>
        </div>
      </section>
    );
  }
  
  return (
    <section className="space-y-4 bg-gradient-to-br from-[#8B5CF6] via-[#A78BFA] to-[#D946EF] p-6 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-3xl translate-y-32 -translate-x-32" />
      
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-base font-semibold text-white">Goals & Growth</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs hover:bg-white/20 text-white group backdrop-blur-sm flex items-center gap-1"
          onClick={() => navigate("/goals")}
        >
          View All Goals
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
      
      <div className="space-y-4 relative">
        {todayGoals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
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
            <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
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
            <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
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
      className="p-3 rounded-xl border border-white/20 bg-white/10 transition-all duration-300 hover:bg-white/20 group backdrop-blur-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white group-hover:text-white transition-colors text-sm">{goal.title}</h3>
            <Sparkles className="w-3.5 h-3.5 text-white/60" />
          </div>
          {goal.deadline && (
            <p className="text-xs text-white/70 mt-1">
              {goal.timeframe === 'today' ? 'Today' : 
                goal.timeframe === 'week' ? 'This week' : 
                `Due: ${format(new Date(goal.deadline), "MMM d")}`}
            </p>
          )}
        </div>
        <div className="flex items-center">
          <span className={`text-xs px-2 py-0.5 ${goal.completed ? 'bg-white/30 text-white' : 'bg-white/20 text-white'} rounded-full font-medium transition-colors`}>
            {goal.completed ? 'Done' : 'In Progress'}
          </span>
        </div>
      </div>
    </div>
  );
}
