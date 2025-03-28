
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, ChevronRight, Plus, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/context/DemoContext";
import { useState } from "react";
import { motion } from "framer-motion";

interface Goal {
  id: string;
  title: string;
  deadline?: string;
  timeframe?: string;
  completed?: boolean;
  user_id?: string;
  category?: string;
}

export function LongTermGoalsCard() {
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
        .eq("timeframe", "long-term")
        .order("position")
        .limit(3);

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

  const longTermGoals = goals || [];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  if (isLoading) {
    return (
      <Card className="p-4 shadow-sm animate-pulse h-24 border-none rounded-xl" />
    );
  }

  if (error) {
    return (
      <Card className="p-4 shadow-sm border-none rounded-xl">
        <p className="text-muted-foreground">Error loading goals. Please try again later.</p>
      </Card>
    );
  }

  if (!longTermGoals.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-5 shadow-sm bg-white border-none rounded-xl hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shadow-sm">
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <span className="font-medium text-gray-800">Vision & Goals</span>
            </div>
            <Button 
              onClick={() => navigate("/goals")} 
              variant="outline"
              size="sm" 
              className="border-purple-200 text-purple-600 hover:bg-purple-50 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.section 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <motion.h2 
        variants={item}
        className="text-base font-semibold text-secondary-800 px-1 flex items-center gap-2.5"
      >
        <motion.div 
          className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shadow-sm"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Target className="w-4 h-4 text-purple-600" />
        </motion.div>
        Vision & Goals
      </motion.h2>
      
      <motion.div variants={item}>
        <Card className="p-4 shadow-sm bg-white border-none rounded-xl hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 flex items-center gap-1.5">
              <motion.div
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut" 
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </motion.div>
              Long-term vision
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-500 hover:text-purple-600 hover:bg-purple-50 group h-7 px-2"
              onClick={() => navigate("/goals")}
            >
              View All
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </motion.div>
            </Button>
          </div>
          
          <motion.div 
            className="space-y-2.5"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {longTermGoals.map(goal => (
              <motion.div 
                key={goal.id}
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 border border-gray-100 hover:border-purple-200 rounded-lg bg-white hover:bg-purple-50/30 transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
                onClick={() => navigate("/goals", { state: { selectedGoalId: goal.id } })}
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5 flex-1">
                    <h3 className={`font-medium text-sm ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {goal.title}
                    </h3>
                    {goal.category && (
                      <span className="text-2xs px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded-full">
                        {goal.category}
                      </span>
                    )}
                  </div>
                  <motion.span 
                    className={`text-xs px-2 py-1 rounded-full ${goal.completed 
                      ? 'text-green-600 bg-green-50 border border-green-100' 
                      : 'text-purple-600 bg-purple-50 border border-purple-100'
                    }`}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {goal.completed ? 'Done' : 'In Progress'}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={item}>
            {/* Fix: Wrap Button with motion.div instead of adding motion props directly to Button */}
            <motion.div 
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Button
                onClick={() => navigate("/goals")}
                variant="outline"
                size="sm"
                className="mt-3.5 text-xs text-purple-600 border-purple-200 hover:bg-purple-50 w-full rounded-full flex items-center justify-center shadow-sm transition-all duration-300"
              >
                Manage All Goals <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>
    </motion.section>
  );
}
