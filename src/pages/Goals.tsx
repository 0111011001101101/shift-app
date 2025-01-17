import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Target,
  Calendar,
  Trash2,
  CheckCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface SubGoal {
  id: string;
  title: string;
  isCompleted: boolean;
  frequency: "daily" | "weekly";
}

interface Goal {
  id: string;
  title: string;
  subGoals: SubGoal[];
  deadline?: string;
}

export default function Goals() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Improve Work-Life Balance",
      deadline: "2024-06-30",
      subGoals: [
        {
          id: "1-1",
          title: "Take lunch breaks away from desk",
          isCompleted: true,
          frequency: "daily",
        },
        {
          id: "1-2",
          title: "No work emails after 6 PM",
          isCompleted: true,
          frequency: "daily",
        },
        {
          id: "1-3",
          title: "Exercise 3 times per week",
          isCompleted: true,
          frequency: "weekly",
        },
        {
          id: "1-4",
          title: "Weekend digital detox",
          isCompleted: false,
          frequency: "weekly",
        },
      ],
    },
  ]);

  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [showNewGoalInput, setShowNewGoalInput] = useState(false);

  const addGoal = () => {
    if (!newGoalTitle.trim()) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      subGoals: [],
    };

    setGoals([...goals, newGoal]);
    setNewGoalTitle("");
    setShowNewGoalInput(false);
    toast({
      title: "Goal Added",
      description: "Your new goal has been created.",
    });
  };

  const toggleSubGoal = (goalId: string, subGoalId: string) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            subGoals: goal.subGoals.map((subGoal) => {
              if (subGoal.id === subGoalId) {
                return { ...subGoal, isCompleted: !subGoal.isCompleted };
              }
              return subGoal;
            }),
          };
        }
        return goal;
      })
    );
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter((goal) => goal.id !== goalId));
    toast({
      title: "Goal Deleted",
      description: "The goal has been removed.",
      variant: "destructive",
    });
  };

  const moveGoal = (goalId: string, direction: "up" | "down") => {
    const index = goals.findIndex((goal) => goal.id === goalId);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === goals.length - 1)
    )
      return;

    const newGoals = [...goals];
    const temp = newGoals[index];
    newGoals[index] = newGoals[index + (direction === "up" ? -1 : 1)];
    newGoals[index + (direction === "up" ? -1 : 1)] = temp;
    setGoals(newGoals);
  };

  const calculateProgress = (goal: Goal) => {
    if (goal.subGoals.length === 0) return 0;
    const completed = goal.subGoals.filter((sg) => sg.isCompleted).length;
    return Math.round((completed / goal.subGoals.length) * 100);
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Goals</h1>
        <Button
          size="sm"
          onClick={() => setShowNewGoalInput(true)}
          className="text-xs"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Goal
        </Button>
      </div>

      {showNewGoalInput && (
        <Card className="p-4 mb-4">
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
        {goals.map((goal, index) => (
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
                    {index < goals.length - 1 && (
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

                {goal.subGoals.length > 0 && (
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
                )}

                <div className="mt-3 space-y-2">
                  {goal.subGoals.map((subGoal) => (
                    <div
                      key={subGoal.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSubGoal(goal.id, subGoal.id)}
                        className={`h-8 w-8 p-0 ${
                          subGoal.isCompleted
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <span
                        className={`flex-1 ${
                          subGoal.isCompleted ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {subGoal.title}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {subGoal.frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}