
import { Button } from "@/components/ui/button";
import { Target, ChevronRight, Plus, Brain, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function GoalsSection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: goals, isLoading, error } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
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
  
  if (isLoading) {
    return (
      <section className="space-y-4 bg-white/95 p-6 rounded-2xl border border-gray-100/50 shadow-sm animate-pulse">
        <div className="h-20 bg-gray-100/50 rounded-lg" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4 bg-white/95 p-6 rounded-2xl border border-gray-100/50 shadow-sm">
        <p className="text-gray-600">Error loading goals. Please try again later.</p>
      </section>
    );
  }

  if (!goals?.length) {
    return (
      <section 
        className="space-y-4 bg-white/95 p-6 rounded-2xl border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer relative overflow-hidden" 
        onClick={() => navigate("/goals")}
      >
        <div className="text-center space-y-4 relative">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-violet-50/50 rounded-xl group-hover:scale-110 transition-transform duration-500">
              <Target className="w-8 h-8 text-violet-600/90" />
            </div>
            <div className="p-3 bg-violet-50/50 rounded-xl group-hover:scale-110 transition-transform duration-500 delay-100">
              <Brain className="w-8 h-8 text-violet-600/90" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Set Your First Goal</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">Break down your ambitions into achievable steps and track your progress.</p>
          </div>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              navigate("/goals");
            }} 
            className="mt-4 bg-violet-50 hover:bg-violet-100/80 text-violet-700 border-0 transition-all duration-300 group font-medium"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
            Create Goal
          </Button>
        </div>
      </section>
    );
  }
  
  return (
    <section className="space-y-4 bg-white/95 p-6 rounded-2xl border border-gray-100/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-50/50 rounded-xl">
            <Target className="w-5 h-5 text-violet-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-800">My Goals</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs hover:bg-violet-50/50 text-gray-600 group"
          onClick={() => navigate("/goals")}
        >
          View All
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {goals.slice(0, 2).map((goal) => (
          <div 
            key={goal.id} 
            className="p-4 rounded-xl border border-gray-100/50 bg-gray-50/50 transition-all duration-300 hover:bg-gray-50/80 group cursor-pointer"
            onClick={() => navigate("/goals")}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-800 group-hover:text-gray-900 transition-colors">{goal.title}</h3>
                  <Sparkles className="w-4 h-4 text-violet-500/60" />
                </div>
                {goal.deadline && (
                  <p className="text-xs text-gray-500 mt-1">
                    Target: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 ${goal.completed ? 'bg-violet-100/50 text-violet-700' : 'bg-gray-100/80 text-gray-600'} rounded-full font-medium transition-colors`}>
                  {goal.completed ? 'Achieved' : 'In Progress'}
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100/80 overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ease-in-out ${goal.completed ? 'bg-violet-500/60' : 'bg-violet-400/40'}`}
                style={{ width: goal.completed ? "100%" : "65%" }} 
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
