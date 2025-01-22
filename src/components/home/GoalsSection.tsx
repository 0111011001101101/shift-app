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
      <section className="space-y-4 bg-gradient-to-br from-white via-gray-50/80 to-gray-100/80 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg animate-pulse">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4 bg-gradient-to-br from-white via-gray-50/80 to-gray-100/80 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <p className="text-red-500">Error loading goals. Please try again later.</p>
      </section>
    );
  }

  if (!goals?.length) {
    return (
      <section className="space-y-4 bg-gradient-to-br from-white via-gray-50/80 to-gray-100/80 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-center space-y-4">
          <Target className="w-12 h-12 mx-auto text-blue-500 opacity-50" />
          <div>
            <h3 className="font-medium">No Goals Yet</h3>
            <p className="text-sm text-muted-foreground">Start by creating your first goal</p>
          </div>
          <Button onClick={() => navigate("/goals")} className="mt-4">
            Create Goal
          </Button>
        </div>
      </section>
    );
  }
  
  return (
    <section className="space-y-4 bg-gradient-to-br from-white via-gray-50/80 to-gray-100/80 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)] animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-lg rounded-full" />
            <div className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl backdrop-blur-sm">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Long Term Goals</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs hover:bg-blue-500/10 group"
          onClick={() => navigate("/goals")}
        >
          View All
          <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {goals.slice(0, 2).map((goal) => (
          <div 
            key={goal.id} 
            className="p-4 rounded-xl border border-blue-500/10 bg-gradient-to-r from-blue-500/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:bg-blue-500/10 hover:scale-[1.02] group"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{goal.title}</h3>
                {goal.deadline && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    Target: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full font-medium group-hover:bg-blue-500 group-hover:text-white transition-colors">
                {goal.completed ? "100%" : "In Progress"}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-500/10 to-transparent overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" 
                style={{ width: goal.completed ? "100%" : "65%" }} 
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}