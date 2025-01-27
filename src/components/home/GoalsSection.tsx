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
      <section className="space-y-4 bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm animate-pulse">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4 bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm">
        <p className="text-red-500">Error loading goals. Please try again later.</p>
      </section>
    );
  }

  if (!goals?.length) {
    return (
      <section className="space-y-4 bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="text-center space-y-4">
          <Target className="w-12 h-12 mx-auto text-primary-600 opacity-50 animate-float" />
          <div>
            <h3 className="font-medium">No Goals Yet</h3>
            <p className="text-sm text-muted-foreground">Start by creating your first goal</p>
          </div>
          <Button onClick={() => navigate("/goals")} className="mt-4 bg-primary hover:bg-primary-600">
            Create Goal
          </Button>
        </div>
      </section>
    );
  }
  
  return (
    <section className="space-y-4 bg-white p-6 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-xl">
            <Target className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Long Term Goals</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs hover:bg-primary-50 group"
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
            className="p-4 rounded-xl border border-gray-200/60 bg-gray-50 transition-all duration-300 hover:shadow-md hover:border-primary-200 group"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{goal.title}</h3>
                {goal.deadline && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    Target: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span className="text-xs px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full font-medium transition-colors">
                {goal.completed ? "100%" : "In Progress"}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div 
                className="h-full bg-primary-600 transition-all duration-700 ease-in-out" 
                style={{ width: goal.completed ? "100%" : "65%" }} 
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}