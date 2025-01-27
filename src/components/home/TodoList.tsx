import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Check, Loader2, Target, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { TodoFilter, FilterType } from "./TodoFilter";

interface SubGoal {
  id: string;
  title: string;
  frequency: "daily" | "weekly";
  completed: boolean;
  goal: {
    id: string;
    title: string;
  } | null;
}

interface Goal {
  id: string;
  title: string;
}

interface TodoListProps {
  frequency: "daily" | "weekly";
  goalId?: string;
}

export function TodoList({ frequency, goalId }: TodoListProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editedTodoText, setEditedTodoText] = useState("");
  const [newTodoText, setNewTodoText] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(
    goalId || null
  );
  const [filter, setFilter] = useState<FilterType>("all");

  const { data: goals } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("id, title")
        .order("position");

      if (error) throw error;
      return data as Goal[];
    },
  });

  const { data: todos, isLoading } = useQuery({
    queryKey: ["sub-goals", frequency, goalId, filter],
    queryFn: async () => {
      let query = supabase
        .from("sub_goals")
        .select(
          `
          id,
          title,
          frequency,
          completed,
          goal:goal_id (
            id,
            title
          )
        `
        )
        .eq("frequency", frequency)
        .order("position");

      if (goalId) {
        query = query.eq("goal_id", goalId);
      }

      if (filter === "completed") {
        query = query.eq("completed", true);
      } else if (filter === "pending") {
        query = query.eq("completed", false);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as SubGoal[];
    },
  });

  const addTodoMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("sub_goals")
        .insert([
          {
            title: newTodoText,
            frequency: frequency,
            goal_id: selectedGoalId || goalId,
          },
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-goals"] });
      setNewTodoText("");
      if (!goalId) {
        setSelectedGoalId(null);
      }
      toast({
        title: "Todo added",
        description: "New todo has been added successfully.",
      });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("sub_goals")
        .update({ title: editedTodoText })
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-goals"] });
      setEditingTodoId(null);
      toast({
        title: "Todo updated",
        description: "Your changes have been saved.",
      });
    },
  });

  const toggleTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { data, error } = await supabase
        .from("sub_goals")
        .update({ completed })
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-goals"] });
    },
  });

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodoMutation.mutate();
    }
  };

  const handleEditTodo = (id: string, currentTitle: string) => {
    setEditingTodoId(id);
    setEditedTodoText(currentTitle);
  };

  const handleSaveTodo = (id: string) => {
    if (editedTodoText.trim()) {
      updateTodoMutation.mutate(id);
    }
  };

  const handleToggleTodo = (id: string, currentStatus: boolean) => {
    toggleTodoMutation.mutate({ id, completed: !currentStatus });
  };

  const navigateToGoals = () => {
    navigate("/goals");
  };

  const filteredTodos = todos?.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.completed;
    return !todo.completed;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const hasGoals = goals && goals.length > 0;

  if (!hasGoals && !goalId) {
    return (
      <div className="bg-primary/5 p-4 rounded-lg space-y-3">
        <h3 className="text-sm font-medium text-primary">Get Started</h3>
        <p className="text-sm text-muted-foreground">
          Create your first goal to start organizing your tasks effectively.
        </p>
        <Button size="sm" className="w-full" onClick={navigateToGoals}>
          Create Your First Goal
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-secondary-800">
          {frequency === "daily" ? "Daily" : "Weekly"} Tasks
        </h2>
        <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
      </div>

      <div className="space-y-3">
        {filteredTodos?.map((todo) => (
          <div
            key={todo.id}
            className="group relative transform transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white via-gray-50/95 to-white border border-secondary-100/10 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 flex-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`p-0 h-auto hover:bg-transparent ${
                    todo.completed 
                      ? "text-primary-600" 
                      : "text-secondary-300 hover:text-secondary-400"
                  }`}
                  onClick={() => handleToggleTodo(todo.id, todo.completed)}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center transition-colors duration-200">
                    {todo.completed && (
                      <Check className="w-3 h-3 animate-scale-in" />
                    )}
                  </div>
                </Button>
                <div className="flex-1 min-w-0">
                  <span
                    className={`block truncate ${
                      todo.completed
                        ? "line-through text-secondary-400"
                        : "text-secondary-800"
                    }`}
                  >
                    {todo.title}
                  </span>
                  {todo.goal && !goalId && (
                    <div
                      className="flex items-center gap-1 mt-1 cursor-pointer group/goal"
                      onClick={() => navigateToGoals()}
                    >
                      <Target className="w-3 h-3 text-primary-600/60 group-hover/goal:text-primary-600 transition-colors duration-200" />
                      <span className="text-xs text-primary-600/60 group-hover/goal:text-primary-600 transition-colors duration-200">
                        {todo.goal.title}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => handleEditTodo(todo.id, todo.title)}
                >
                  <Pencil className="w-3.5 h-3.5 text-secondary-400 hover:text-secondary-600 transition-colors" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative space-y-3 pt-4">
        {!goalId && (
          <Select
            value={selectedGoalId || ""}
            onValueChange={(value) => setSelectedGoalId(value || null)}
          >
            <SelectTrigger className="w-full bg-white/95 border-secondary-100/10 shadow-sm hover:border-secondary-200/20 focus:ring-2 focus:ring-primary-600/20 rounded-xl text-sm">
              <SelectValue placeholder="Select a goal (optional)" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm border-secondary-100 shadow-lg">
              {goals?.map((goal) => (
                <SelectItem 
                  key={goal.id} 
                  value={goal.id}
                  className="focus:bg-primary-50"
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-primary-600/70" />
                    <span className="font-medium">{goal.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="relative flex items-center gap-2">
          <Input
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 pr-12 bg-white/95 border-secondary-100/10 shadow-sm hover:border-secondary-200/20 focus:ring-2 focus:ring-primary-600/20 rounded-xl text-sm placeholder:text-secondary-400"
            onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
          />
          <Button
            onClick={handleAddTodo}
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white rounded-full w-8 h-8 shadow-md transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!hasGoals && !goalId && (
        <div className="bg-secondary-50/50 p-4 rounded-xl space-y-3 animate-fadeIn border border-secondary-100/20">
          <h3 className="text-sm font-medium text-secondary-800">Get Started</h3>
          <p className="text-sm text-secondary-600">
            Create your first goal to start organizing your tasks effectively.
          </p>
          <Button 
            size="sm" 
            onClick={navigateToGoals}
            className="w-full bg-white hover:bg-secondary-50 text-secondary-800 shadow-sm border border-secondary-200/20"
          >
            Create Your First Goal
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
