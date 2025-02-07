
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Target, CheckCircle2, Circle, Tag, Clock } from "lucide-react";
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
  category: string;
  importance: number;
  notes?: string | null;
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

const getCategoryColor = (category: string) => {
  const categories: Record<string, string> = {
    personal: "bg-violet-100 text-violet-700",
    work: "bg-blue-100 text-blue-700",
    health: "bg-green-100 text-green-700",
    family: "bg-pink-100 text-pink-700",
    learning: "bg-yellow-100 text-yellow-700",
  };
  return categories[category.toLowerCase()] || "bg-gray-100 text-gray-700";
};

const getImportanceColor = (importance: number) => {
  const colors = [
    "bg-gray-100 text-gray-600",
    "bg-blue-100 text-blue-600",
    "bg-yellow-100 text-yellow-600",
    "bg-red-100 text-red-600",
  ];
  return colors[importance - 1] || colors[0];
};

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
          category,
          importance,
          notes,
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
        <div className="h-24 bg-white/50 rounded-2xl shadow-sm" />
        <div className="h-24 bg-white/50 rounded-2xl shadow-sm" />
        <div className="h-24 bg-white/50 rounded-2xl shadow-sm" />
      </div>
    );
  }

  const hasGoals = goals && goals.length > 0;

  if (!hasGoals && !goalId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50/80 via-white to-violet-100/50 p-8 text-center shadow-sm border border-violet-100/30 backdrop-blur-xl"
      >
        <Target className="w-12 h-12 text-violet-500/90 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-violet-900 mb-3">Get Started</h3>
        <p className="text-sm text-violet-700/90 mb-6">
          Create your first goal to start organizing your tasks effectively.
        </p>
        <Button 
          onClick={() => navigate("/goals")}
          className="w-full bg-white hover:bg-violet-50 text-violet-700 border border-violet-200/50 shadow-sm"
        >
          Create Your First Goal
          <Plus className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-white hover:bg-violet-50 text-violet-700 border border-violet-200/50 shadow-sm rounded-full px-4 h-9"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Task
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {todos?.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="group flex items-start gap-3 p-4 bg-white rounded-2xl border border-violet-100/30 hover:border-violet-200/50 hover:shadow-md transition-all duration-200 backdrop-blur-sm"
            >
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  "p-0 h-auto hover:bg-transparent mt-0.5",
                  todo.completed ? "text-violet-500" : "text-secondary-300"
                )}
                onClick={() => toggleTodoMutation.mutate({ id: todo.id, completed: !todo.completed })}
              >
                {todo.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </Button>

              <div className="flex-1 min-w-0 space-y-2">
                <div className={cn(
                  "text-base font-medium",
                  todo.completed && "line-through text-secondary-400"
                )}>
                  {todo.title}
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {todo.category && (
                    <div className={cn(
                      "flex items-center gap-1 text-xs px-2 py-1 rounded-md",
                      getCategoryColor(todo.category)
                    )}>
                      <Tag className="w-3 h-3" />
                      {todo.category}
                    </div>
                  )}
                  
                  {todo.importance > 1 && (
                    <div className={cn(
                      "flex items-center gap-1 text-xs px-2 py-1 rounded-md",
                      getImportanceColor(todo.importance)
                    )}>
                      {"⭐".repeat(todo.importance - 1)}
                    </div>
                  )}

                  {todo.due_date && (
                    <div className="flex items-center gap-1 text-xs text-secondary-500 bg-secondary-50 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3" />
                      {format(new Date(todo.due_date), "MMM d")}
                    </div>
                  )}

                  {todo.goal && (
                    <div className="flex items-center gap-1 text-xs text-primary-500/70 bg-primary-50/50 px-2 py-1 rounded-md">
                      <Target className="w-3 h-3" />
                      {todo.goal.title}
                    </div>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-violet-50"
                onClick={() => handleEditTodo(todo)}
              >
                <Pencil className="w-3.5 h-3.5 text-violet-600" />
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
            category: editingTodo.category,
            importance: editingTodo.importance,
            notes: editingTodo.notes || "",
          }}
          mode="edit"
        />
      )}
    </div>
  );
}
