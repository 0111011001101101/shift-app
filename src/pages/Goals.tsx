import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus,
  Target,
  Calendar,
  Trash2,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoList } from "@/components/home/TodoList";

interface SubGoal {
  id: string;
  title: string;
  isCompleted: boolean;
  frequency: "daily" | "weekly";
}

interface Goal {
  id: string;
  title: string;
  deadline?: string;
  completed?: boolean;
  position?: number;
}

export default function Goals() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [showNewGoalInput, setShowNewGoalInput] = useState(false);

  // Get current user
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
        return null;
      }
      return data.session;
    },
  });

  // Fetch goals with proper user filtering
  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      if (!session?.user.id) return [];
      
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", session.user.id)
        .order("position");

      if (error) {
        toast({
          title: "Error fetching goals",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data;
    },
    enabled: !!session?.user.id,
  });

  // Add new goal with user_id
  const addGoalMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("goals")
        .insert([{ 
          title: newGoalTitle,
          user_id: session.user.id,
          position: (goals?.length || 0) + 1
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      setNewGoalTitle("");
      setShowNewGoalInput(false);
      toast({
        title: "Goal Added",
        description: "Your new goal has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle goal completion
  const toggleGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const goal = goals?.find(g => g.id === goalId);
      if (!goal) throw new Error("Goal not found");

      const { error } = await supabase
        .from("goals")
        .update({ completed: !goal.completed })
        .eq("id", goalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Goal Updated",
        description: "Goal status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete goal
  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase.from("goals").delete().eq("id", goalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Goal Deleted",
        description: "The goal has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Move goal position
  const moveGoalMutation = useMutation({
    mutationFn: async ({
      goalId,
      newPosition,
    }: {
      goalId: string;
      newPosition: number;
    }) => {
      const { error } = await supabase
        .from("goals")
        .update({ position: newPosition })
        .eq("id", goalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
    onError: (error) => {
      toast({
        title: "Error moving goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addGoal = () => {
    if (!newGoalTitle.trim()) return;
    addGoalMutation.mutate();
  };

  const deleteGoal = (goalId: string) => {
    deleteGoalMutation.mutate(goalId);
  };

  const moveGoal = (goalId: string, direction: "up" | "down") => {
    const index = goals?.findIndex((goal) => goal.id === goalId) ?? -1;
    if (
      index === -1 ||
      (direction === "up" && index === 0) ||
      (direction === "down" && index === (goals?.length ?? 0) - 1)
    )
      return;

    const newPosition =
      goals?.[index + (direction === "up" ? -1 : 1)]?.position ?? 0;
    moveGoalMutation.mutate({ goalId, newPosition });
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/home")}
              className="rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Goals
            </h1>
          </div>
          <Button
            size="sm"
            onClick={() => setShowNewGoalInput(true)}
            className="text-xs bg-primary hover:bg-primary-600 text-white"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Goal
          </Button>
        </div>

        {showNewGoalInput && (
          <Card className="p-4 border-primary-100 dark:border-primary-900/20">
            <div className="flex gap-2">
              <Input
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Enter goal title..."
                className="flex-1"
              />
              <Button 
                onClick={addGoal} 
                size="sm"
                className="bg-primary hover:bg-primary-600 text-white"
              >
                Add
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl"
                />
              ))}
            </div>
          ) : goals?.length === 0 ? (
            <Card className="p-6 text-center space-y-3 border-primary-100 dark:border-primary-900/20">
              <Target className="w-12 h-12 mx-auto text-primary opacity-50" />
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">No Goals Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Add your first goal to start tracking your progress
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setShowNewGoalInput(true)}
                className="mx-auto bg-primary hover:bg-primary-600 text-white"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Your First Goal
              </Button>
            </Card>
          ) : (
            goals?.map((goal, index) => (
              <Card 
                key={goal.id} 
                className={`p-4 transition-all duration-300 border-primary-100 dark:border-primary-900/20 ${
                  goal.completed ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleGoalMutation.mutate(goal.id)}
                    className={`h-8 w-8 p-0 ${
                      goal.completed
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </Button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-medium text-gray-900 dark:text-gray-100 ${
                          goal.completed ? 'line-through text-muted-foreground' : ''
                        }`}>
                          {goal.title}
                        </h3>
                        {goal.deadline && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            Due {new Date(goal.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveGoal(goal.id, "up")}
                            className="h-8 w-8 p-0 hover:bg-primary-50 dark:hover:bg-primary-900/10"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        )}
                        {index < (goals?.length ?? 0) - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveGoal(goal.id, "down")}
                            className="h-8 w-8 p-0 hover:bg-primary-50 dark:hover:bg-primary-900/10"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGoal(goal.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Tabs defaultValue="daily" className="w-full">
                        <TabsList className="w-full mb-4 bg-white dark:bg-gray-800 border border-primary-100 dark:border-primary-900/20">
                          <TabsTrigger 
                            value="daily" 
                            className="flex-1 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 dark:data-[state=active]:bg-primary-900/10 dark:data-[state=active]:text-primary-400"
                          >
                            Daily Tasks
                          </TabsTrigger>
                          <TabsTrigger 
                            value="weekly" 
                            className="flex-1 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 dark:data-[state=active]:bg-primary-900/10 dark:data-[state=active]:text-primary-400"
                          >
                            Weekly Tasks
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="daily" className="mt-2">
                          <TodoList frequency="daily" goalId={goal.id} />
                        </TabsContent>
                        
                        <TabsContent value="week" className="mt-2">
                          <TodoList frequency="weekly" goalId={goal.id} />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageContainer>
  );
}