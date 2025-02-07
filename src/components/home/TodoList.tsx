import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Target, CheckCircle2, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { TodoFilter, FilterType } from "./TodoFilter";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { TaskDialog } from "./TaskDialog";
import { cn } from "@/lib/utils";

interface SubGoal {
  id: string;
  title: string;
  frequency: "daily" | "weekly";
  completed: boolean;
  due_date?: string | null;
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
          due_date,
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
    mutationFn: async (data: { title: string; goalId: string | null; dueDate: Date | null }) => {
      const { data: newTodo, error } = await supabase
        .from("sub_goals")
        .insert([
          {
            title: data.title,
            frequency: frequency,
            goal_id: data.goalId || goalId,
            due_date: data.dueDate ? data.dueDate.toISOString() : null,
          },
        ])
        .select();

      if (error) throw error;
      return newTodo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-goals"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Task added",
        description: "New task has been added successfully.",
      });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, title, goalId, dueDate }: { id: string; title: string; goalId: string | null; dueDate: Date | null }) => {
      const { data, error } = await supabase
        .from("sub_goals")
        .update({ title, goal_id: goalId, due_date: dueDate ? dueDate.toISOString() : null })
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

  const handleAddTodo = async (data: { title: string; goalId: string | null; dueDate: Date | null }) => {
    if (data.title.trim()) {
      addTodoMutation.mutate({
        title: data.title,
        goalId: data.goalId || goalId,
        dueDate: data.dueDate,
      });
    }
  };

  const handleEditTodo = (todo: SubGoal) => {
    setEditingTodoId(todo.id);
  };

  const handleSaveTodo = async (data: { title: string; goalId: string | null; dueDate: Date | null }) => {
    if (data.title.trim() && editingTodoId) {
      updateTodoMutation.mutate({
        id: editingTodoId,
        title: data.title,
        goalId: data.goalId,
        dueDate: data.dueDate,
      });
      setEditingTodoId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-12 bg-primary-50/50 rounded-xl" />
        <div className="h-12 bg-primary-50/50 rounded-xl" />
        <div className="h-12 bg-primary-50/50 rounded-xl" />
      </div>
    );
  }

  const hasGoals = goals && goals.length > 0;

  if (!hasGoals && !goalId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-50/80 via-white to-primary-100/50 p-6 text-center shadow-sm border border-primary-100/30"
      >
        <Target className="w-10 h-10 text-primary-500/90 mx-auto mb-3" />
        <h3 className="text-base font-medium text-primary-900 mb-2">Get Started</h3>
        <p className="text-sm text-primary-700/90 mb-4">
          Create your first goal to start organizing your tasks effectively.
        </p>
        <Button 
          onClick={() => navigate("/goals")}
          className="w-full bg-white hover:bg-primary-50 text-primary-700 border border-primary-200/50 shadow-sm"
        >
          Create Your First Goal
          <Plus className="w-4 h-4 ml-1" />
        </Button>
      </motion.div>
    );
  }

  const editingTodo = todos?.find(todo => todo.id === editingTodoId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
        <Button
          size="sm"
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="space-y-2">
          {todos?.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-primary-100/30 hover:border-primary-200/50 hover:shadow-sm transition-all duration-200"
            >
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  "p-0 h-auto hover:bg-transparent",
                  todo.completed ? "text-primary-500" : "text-secondary-300"
                )}
                onClick={() => toggleTodoMutation.mutate({ id: todo.id, completed: !todo.completed })}
              >
                {todo.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </Button>

              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm",
                  todo.completed && "line-through text-secondary-400"
                )}>
                  {todo.title}
                </div>
                {(todo.goal || todo.due_date) && (
                  <div className="flex items-center gap-2 mt-1">
                    {todo.goal && (
                      <div className="flex items-center gap-1 text-xs text-primary-500/70 bg-primary-50/50 px-2 py-0.5 rounded-md">
                        <Target className="w-3 h-3" />
                        {todo.goal.title}
                      </div>
                    )}
                    {todo.due_date && (
                      <div className="text-xs text-secondary-500">
                        Due {format(new Date(todo.due_date), "MMM d")}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleEditTodo(todo)}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <TaskDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddTodo}
        goals={goals}
        mode="add"
      />

      {editingTodo && (
        <TaskDialog
          isOpen={!!editingTodoId}
          onOpenChange={(open) => !open && setEditingTodoId(null)}
          onSubmit={handleSaveTodo}
          goals={goals}
          initialData={{
            title: editingTodo.title,
            goalId: editingTodo.goal?.id || null,
            dueDate: editingTodo.due_date ? new Date(editingTodo.due_date) : null,
          }}
          mode="edit"
        />
      )}
    </div>
  );
}
