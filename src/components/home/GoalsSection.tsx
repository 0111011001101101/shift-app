import { Button } from "@/components/ui/button";
import { Target, ChevronRight } from "lucide-react";
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
      <section className="space-y-4 bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD] p-4 rounded-2xl border border-primary-100/30 shadow-sm animate-pulse">
        <div className="h-20 bg-white/20 rounded-lg" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4 bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD] p-4 rounded-2xl border border-primary-100/30 shadow-sm">
        <p className="text-destructive">Error loading goals. Please try again later.</p>
      </section>
    );
  }

  if (!goals?.length) {
    return (
      <section className="space-y-4 bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD] p-4 rounded-2xl border border-primary-100/30 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-xl">
        <div className="text-center space-y-3">
          <Target className="w-10 h-10 mx-auto text-primary-500 animate-float" />
          <div>
            <h3 className="font-medium text-primary-700">No Goals Yet</h3>
            <p className="text-sm text-primary-600/80">Start by creating your first goal</p>
          </div>
          <Button 
            onClick={() => navigate("/goals")} 
            className="mt-3 bg-primary-500 hover:bg-primary-600 text-white transition-all duration-300"
          >
            Create Goal
          </Button>
        </div>
      </section>
    );
  }
  
  return (
    <section className="space-y-3 bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD] p-4 rounded-2xl border border-primary-100/30 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary-500 rounded-xl">
            <Target className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-base font-semibold text-primary-700">Long Term Goals</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs hover:bg-white/40 text-primary-700 group backdrop-blur-sm"
          onClick={() => navigate("/goals")}
        >
          View All
          <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {goals.slice(0, 2).map((goal) => (
          <div 
            key={goal.id} 
            className="p-3 rounded-xl border border-primary-200/30 bg-white/60 transition-all duration-300 hover:shadow-sm hover:border-primary-300/40 group backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-primary-800 group-hover:text-primary-900 transition-colors">{goal.title}</h3>
                {goal.deadline && (
                  <p className="text-xs text-primary-600/80 mt-0.5">
                    Target: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span className="text-xs px-2 py-0.5 bg-white/80 text-primary-700 rounded-full font-medium transition-colors">
                {goal.completed ? "100%" : "In Progress"}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-primary-100/50 overflow-hidden">
              <div 
                className="h-full bg-primary-500 transition-all duration-700 ease-in-out" 
                style={{ width: goal.completed ? "100%" : "65%" }} 
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}