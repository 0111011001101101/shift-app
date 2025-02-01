import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Check, Target, ChevronRight, Loader2, Calendar } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface SubGoal {
  id: string;
  title: string;
  frequency: "daily" | "weekly";
  completed: boolean;
  goal: {
    id: string;
    title: string;
    deadline?: string | null;
  } | null;
}

interface Goal {
  id: string;
  title: string;
  deadline?: string | null;
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
        .select("id, title, deadline")
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
            title,
            deadline
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
        title: "Task added",
        description: "New task has been added successfully.",
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
        title: "Task updated",
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
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="space-y-3 w-full max-w-md animate-pulse">
          <div className="h-14 bg-primary-50/50 rounded-xl" />
          <div className="h-14 bg-primary-50/50 rounded-xl" />
          <div className="h-14 bg-primary-50/50 rounded-xl" />
        </div>
      </div>
    );
  }

  const hasGoals = goals && goals.length > 0;

  if (!hasGoals && !goalId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50/80 via-white to-primary-100/50 p-8 shadow-lg border border-primary-100/30"
      >
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative space-y-4">
          <Target className="w-12 h-12 text-primary-500/90" />
          <h3 className="text-lg font-semibold text-primary-900">Get Started</h3>
          <p className="text-sm text-primary-700/90">
            Create your first goal to start organizing your tasks effectively.
          </p>
          <Button 
            onClick={() => navigate("/goals")}
            className="w-full bg-white hover:bg-primary-50 text-primary-700 border border-primary-200/50 shadow-sm"
          >
            Create Your First Goal
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent">
          {frequency === "daily" ? "Daily" : "Weekly"} Tasks
        </h2>
        <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
      </div>

      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {todos?.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white via-white to-primary-50/10 border border-primary-100/30 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-grid-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-start gap-4 p-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`relative p-0 h-auto hover:bg-transparent overflow-hidden mt-1 ${
                      todo.completed 
                        ? "text-primary-500" 
                        : "text-secondary-300 hover:text-secondary-400"
                    }`}
                    onClick={() => handleToggleTodo(todo.id, todo.completed)}
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center transition-all duration-300">
                      <motion.div
                        initial={false}
                        animate={todo.completed ? { scale: 1 } : { scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        {todo.completed && (
                          <Check className="w-3.5 h-3.5 text-current" />
                        )}
                      </motion.div>
                    </div>
                  </Button>

                  <div className="flex-1 min-w-0 space-y-1">
                    {editingTodoId === todo.id ? (
                      <Input
                        value={editedTodoText}
                        onChange={(e) => setEditedTodoText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSaveTodo(todo.id)}
                        className="w-full bg-white/95 border-primary-100/30 focus:border-primary-200/50 focus:ring-2 focus:ring-primary-500/20"
                        autoFocus
                      />
                    ) : (
                      <div className="space-y-2">
                        <span
                          className={`block text-sm sm:text-base ${
                            todo.completed
                              ? "line-through text-secondary-400"
                              : "text-secondary-800"
                          } transition-all duration-300`}
                        >
                          {todo.title}
                        </span>
                        {todo.goal && (
                          <div className="flex flex-col gap-1.5">
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-1.5 cursor-pointer group/goal"
                              onClick={() => navigateToGoals()}
                            >
                              <Target className="w-3.5 h-3.5 text-primary-500/70 group-hover/goal:text-primary-600 transition-colors duration-200" />
                              <span className="text-xs font-medium text-primary-500/70 group-hover/goal:text-primary-600 transition-colors duration-200">
                                {todo.goal.title}
                              </span>
                            </motion.div>
                            {todo.goal.deadline && (
                              <div className="flex items-center gap-1.5 text-xs text-secondary-500">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Due {format(new Date(todo.goal.deadline), 'MMM d, yyyy')}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!editingTodoId && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => handleEditTodo(todo.id, todo.title)}
                    >
                      <Pencil className="w-3.5 h-3.5 text-secondary-400 hover:text-secondary-600 transition-colors" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {todos?.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50/80 via-white to-primary-100/50 p-8 shadow-lg border border-primary-100/30"
            >
              <div className="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
              <div className="relative space-y-4">
                <Target className="w-12 h-12 text-primary-500/90" />
                <h3 className="text-lg font-semibold text-primary-900">No tasks yet</h3>
                <p className="text-sm text-primary-700/90">
                  Add your first task below to start tracking your progress.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      <div className="relative space-y-3 pt-4">
        {!goalId && (
          <Select
            value={selectedGoalId || ""}
            onValueChange={(value) => setSelectedGoalId(value || null)}
          >
            <SelectTrigger className="w-full bg-white/95 border-primary-100/30 shadow-sm hover:border-primary-200/50 focus:ring-2 focus:ring-primary-500/20 rounded-xl text-sm">
              <SelectValue placeholder="Select a goal (optional)" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm border-primary-100/30 shadow-lg">
              {goals?.map((goal) => (
                <SelectItem 
                  key={goal.id} 
                  value={goal.id}
                  className="focus:bg-primary-50 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-primary-500/70" />
                    <div className="flex flex-col">
                      <span className="font-medium">{goal.title}</span>
                      {goal.deadline && (
                        <span className="text-xs text-secondary-500">
                          Due {format(new Date(goal.deadline), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
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
            className="flex-1 pr-12 bg-white/95 border-primary-100/30 shadow-sm hover:border-primary-200/50 focus:ring-2 focus:ring-primary-500/20 rounded-xl text-sm placeholder:text-secondary-400"
            onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
          />
          <Button
            onClick={handleAddTodo}
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-accent hover:opacity-90 text-white rounded-full w-8 h-8 shadow-md transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}