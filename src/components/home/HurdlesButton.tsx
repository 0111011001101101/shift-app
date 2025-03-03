
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ChevronRight, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

// Define proper types for our data
interface Solution {
  id: string;
  title: string;
  isCompleted: boolean;
  text: string;
}

interface Hurdle {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  position: number;
  user_id: string;
}

interface HurdleWithSolutions extends Hurdle {
  solutions: Solution[];
  progressPercent: number;
}

export function HurdlesButton() {
  const navigate = useNavigate();
  const [hurdlesWithSolutions, setHurdlesWithSolutions] = useState<HurdleWithSolutions[]>([]);
  
  // Fetch active hurdles
  const { data: activeHurdles, isLoading: isLoadingHurdles } = useQuery({
    queryKey: ["activeHurdles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("hurdles")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed", false)
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching hurdles:", error);
        return [];
      }
      
      return data as Hurdle[] || [];
    },
  });

  // Fetch solutions for each hurdle
  const { data: solutions, isLoading: isLoadingSolutions } = useQuery({
    queryKey: ["hurdleSolutions"],
    queryFn: async () => {
      if (!activeHurdles || activeHurdles.length === 0) return [];
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const hurdle_ids = activeHurdles.map(h => h.id);
      
      const { data, error } = await supabase
        .from("solutions")
        .select("*")
        .in("hurdle_id", hurdle_ids);
        
      if (error) {
        console.error("Error fetching solutions:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!activeHurdles && activeHurdles.length > 0,
  });

  // Combine hurdles with their solutions
  useEffect(() => {
    if (!activeHurdles || isLoadingHurdles || isLoadingSolutions) return;
    
    const combined = activeHurdles.map(hurdle => {
      const hurdleSolutions = solutions?.filter(s => s.hurdle_id === hurdle.id) || [];
      
      // Map the solutions array with the correct structure
      const formattedSolutions = hurdleSolutions.map(s => ({
        id: s.id,
        text: s.title,
        isCompleted: s.completed || false
      }));
      
      // Calculate progress percentage
      const totalSolutions = formattedSolutions.length;
      const completedSolutions = formattedSolutions.filter(s => s.isCompleted).length;
      const progressPercent = totalSolutions > 0 
        ? Math.round((completedSolutions / totalSolutions) * 100) 
        : 0;
      
      return {
        ...hurdle,
        solutions: formattedSolutions,
        progressPercent
      };
    });
    
    // Sort by progress (least complete first)
    combined.sort((a, b) => a.progressPercent - b.progressPercent);
    
    setHurdlesWithSolutions(combined);
  }, [activeHurdles, solutions, isLoadingHurdles, isLoadingSolutions]);
  
  // Show up to 2 hurdles
  const displayHurdles = hurdlesWithSolutions?.slice(0, 2) || [];
  
  if (isLoadingHurdles || (!activeHurdles || activeHurdles.length === 0)) {
    return (
      <Card className="p-5 border border-gray-100 shadow-sm bg-white">
        <div className="text-center space-y-4">
          <div className="mx-auto bg-orange-50 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <Shield className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Overcome Challenges</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">Track and tackle obstacles mindfully to build mental resilience while achieving your goals.</p>
          </div>
          <Button 
            onClick={() => navigate("/hurdles")} 
            className="mt-2 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Challenge
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-5 border border-gray-100 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-500" />
          <span className="font-medium text-gray-800">Mental Resilience</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-orange-500 hover:text-orange-600 hover:bg-orange-50 group"
          onClick={() => navigate("/hurdles")}
        >
          View All
          <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {displayHurdles.map(hurdle => (
          <div 
            key={hurdle.id}
            className="p-3 border border-gray-100 hover:border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/hurdles")}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm text-gray-800">{hurdle.title}</h3>
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2 py-0.5 border-orange-100 text-orange-700 bg-orange-50"
                  >
                    {hurdle.progressPercent}% complete
                  </Badge>
                </div>
                
                <div className="w-full">
                  <Progress value={hurdle.progressPercent} className="h-1.5" />
                </div>
                
                {hurdle.solutions && hurdle.solutions.length > 0 && (
                  <div className="space-y-1">
                    {hurdle.solutions.slice(0, 2).map((solution, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {solution.isCompleted ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 border border-gray-300 rounded-full flex-shrink-0" />
                        )}
                        <span className={solution.isCompleted ? "text-gray-400 line-through" : "text-gray-600"}>
                          {solution.text}
                        </span>
                      </div>
                    ))}
                    {hurdle.solutions.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{hurdle.solutions.length - 2} more steps
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {activeHurdles && activeHurdles.length > 2 && (
          <div className="text-center text-sm text-gray-500 pt-1">
            {activeHurdles.length - 2} more challenges to overcome
          </div>
        )}
      </div>
    </Card>
  );
}
