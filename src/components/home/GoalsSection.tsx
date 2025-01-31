import { Button } from "@/components/ui/button";
import { Target, ChevronRight, Plus, Brain, Sparkles, Shield, TrendingUp } from "lucide-react";
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
      <section className="space-y-4 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] p-6 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl group cursor-pointer" onClick={() => navigate("/goals")}>
        <div className="text-center space-y-4">
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
            className="mt-4 bg-white hover:bg-white/90 text-[#8B5CF6] border-0 transition-all duration-300 group font-medium"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
            Create Your First Goal
          </Button>
        </div>
      </section>
    );
  }
  
  return (
    <section className="space-y-4 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] p-6 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-base font-semibold text-white">Growth & Wellbeing</h2>
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
      
      <div className="space-y-3">
        {goals.slice(0, 2).map((goal) => (
          <div 
            key={goal.id} 
            className="p-4 rounded-xl border border-white/20 bg-white/10 transition-all duration-300 hover:bg-white/20 group backdrop-blur-sm cursor-pointer"
            onClick={() => navigate("/goals")}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white group-hover:text-white transition-colors">{goal.title}</h3>
                  <Sparkles className="w-4 h-4 text-white/60" />
                </div>
                {goal.deadline && (
                  <p className="text-xs text-white/70 mt-1">
                    Target: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 ${goal.completed ? 'bg-white/30 text-white' : 'bg-white/20 text-white'} rounded-full font-medium transition-colors`}>
                  {goal.completed ? 'Achieved' : 'In Progress'}
                </span>
                <TrendingUp className={`w-4 h-4 ${goal.completed ? 'text-white' : 'text-white/60'}`} />
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ease-in-out ${goal.completed ? 'bg-white/60' : 'bg-white/40'}`}
                style={{ width: goal.completed ? "100%" : "65%" }} 
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}