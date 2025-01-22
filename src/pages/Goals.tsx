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
          user_id: session.user.id 
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
        description: "Your new goal has been created.",
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

  // Delete goal (already has user check via RLS)
  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase.from("goals").delete().eq("id", goalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Goal Deleted",
        description: "The goal has been removed.",
        variant: "destructive",
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

  // Move goal (already has user check via RLS)
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

  const calculateProgress = (goal: Goal) => {
    // We'll implement this with actual sub-goals data later
    return Math.round(Math.random() * 100);
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
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Goals</h1>
          </div>
          <Button
            size="sm"
            onClick={() => setShowNewGoalInput(true)}
            className="text-xs"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Goal
          </Button>
        </div>

        {showNewGoalInput && (
          <Card className="p-4">
            <div className="flex gap-2">
              <Input
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Enter goal title..."
                className="flex-1"
              />
              <Button onClick={addGoal} size="sm">
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
            <Card className="p-6 text-center space-y-3">
              <Target className="w-12 h-12 mx-auto text-primary opacity-50" />
              <div className="space-y-1">
                <h3 className="font-medium">No Goals Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Add your first goal to start tracking your progress
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setShowNewGoalInput(true)}
                className="mx-auto"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Your First Goal
              </Button>
            </Card>
          ) : (
            goals?.map((goal, index) => (
              <Card key={goal.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{goal.title}</h3>
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
                            className="h-8 w-8 p-0"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        )}
                        {index < (goals?.length ?? 0) - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveGoal(goal.id, "down")}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGoal(goal.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all" 
                          style={{ width: `${calculateProgress(goal)}%` }} 
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {calculateProgress(goal)}% complete
                      </p>
                    </div>

                    <div className="mt-4">
                      <Tabs defaultValue="daily" className="w-full">
                        <TabsList className="w-full mb-4">
                          <TabsTrigger value="daily" className="flex-1">
                            Daily Tasks
                          </TabsTrigger>
                          <TabsTrigger value="weekly" className="flex-1">
                            Weekly Tasks
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="daily">
                          <TodoList frequency="daily" goalId={goal.id} />
                        </TabsContent>
                        <TabsContent value="weekly">
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
