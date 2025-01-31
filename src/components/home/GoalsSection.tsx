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
      <section className="space-y-4 bg-gradient-to-br from-white via-gray-50/95 to-white p-6 rounded-3xl border border-black/[0.08] shadow-lg animate-pulse">
        <div className="h-20 bg-black/[0.02] rounded-lg" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4 bg-gradient-to-br from-white via-gray-50/95 to-white p-6 rounded-3xl border border-black/[0.08] shadow-lg">
        <p className="text-destructive">Error loading goals. Please try again later.</p>
      </section>
    );
  }

  if (!goals?.length) {
    return (
      <section className="space-y-4 bg-gradient-to-br from-white via-gray-50/95 to-white p-6 rounded-3xl border border-black/[0.08] shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl">
        <div className="text-center space-y-4">
          <Target className="w-12 h-12 mx-auto text-[#FF8C42] animate-float" />
          <div>
            <h3 className="font-medium text-black">No Goals Yet</h3>
            <p className="text-sm text-black/60">Start by creating your first goal</p>
          </div>
          <Button 
            onClick={() => navigate("/goals")} 
            className="mt-4 bg-[#FF8C42] hover:bg-[#FF8C42]/90 text-white transition-all duration-300"
          >
            Create Goal
          </Button>
        </div>
      </section>
    );
  }
  
  return (
    <section className="space-y-4 bg-gradient-to-br from-white via-gray-50/95 to-white p-6 rounded-3xl border border-black/[0.08] shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FF8C42] rounded-xl">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-black">Long Term Goals</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs hover:bg-black/[0.02] group backdrop-blur-sm"
          onClick={() => navigate("/goals")}
        >
          View All
          <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {goals.slice(0, 2).map((goal) => (
          <div 
            key={goal.id} 
            className="p-4 rounded-xl border border-black/[0.08] bg-black/[0.02] transition-all duration-300 hover:shadow-md hover:border-black/[0.16] group backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-black group-hover:text-black transition-colors">{goal.title}</h3>
                {goal.deadline && (
                  <p className="text-sm text-black/60 mt-0.5">
                    Target: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span className="text-xs px-2.5 py-1 bg-black/[0.02] text-black/70 rounded-full font-medium transition-colors">
                {goal.completed ? "100%" : "In Progress"}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-black/[0.02] overflow-hidden">
              <div 
                className="h-full bg-[#FF8C42] transition-all duration-700 ease-in-out" 
                style={{ width: goal.completed ? "100%" : "65%" }} 
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}