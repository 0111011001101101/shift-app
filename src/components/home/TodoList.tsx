
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus,
  Trash2,
  CheckCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDemoMode } from "@/context/DemoContext";
import { v4 as uuidv4 } from "uuid";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  goal_id: string;
  frequency: string;
  user_id?: string;
}

interface TodoListProps {
  compact?: boolean;
  goalId?: string;
  frequency?: "daily" | "weekly" | "monthly";
  limit?: number;
}

export function TodoList({
  compact,
  goalId,
  frequency = "daily",
  limit,
}: TodoListProps): React.ReactNode {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTodoText, setNewTodoText] = useState("");
  const { isDemoMode } = useDemoMode();

  const [demoTodos, setDemoTodos] = useState<Todo[]>([
    {
      id: uuidv4(),
      text: "Complete morning workout",
      completed: false,
      goal_id: goalId || "demo-goal-1",
      frequency: "daily",
    },
    {
      id: uuidv4(),
      text: "Review weekly reports",
      completed: false,
      goal_id: goalId || "demo-goal-2",
      frequency: "weekly",
    },
    {
      id: uuidv4(),
      text: "Prepare monthly budget",
      completed: false,
      goal_id: goalId || "demo-goal-3",
      frequency: "monthly",
    },
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

  const { data: todos, isLoading } = useQuery({
    queryKey: ["todos", goalId, frequency, demoTodos],
    queryFn: async () => {
      if (!goalId) return [];

      if (isDemoMode) {
        let filteredTodos = [...demoTodos];

        filteredTodos = filteredTodos.filter(
          (todo) => todo.goal_id === goalId && todo.frequency === frequency
        );

        return filteredTodos;
      }

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("goal_id", goalId)
        .eq("frequency", frequency)
        .order("created_at");

      if (error) {
        toast({
          title: "Error fetching todos",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    },
    enabled: !!goalId,
  });

  const addTodoMutation = useMutation({
    mutationFn: async () => {
      if (!goalId) throw new Error("Goal ID is required");
      if (!session?.user?.id && !isDemoMode) throw new Error("User not authenticated");

      if (isDemoMode) {
        const newTodo = {
          id: uuidv4(),
          text: newTodoText,
          completed: false,
          goal_id: goalId,
          frequency: frequency || "daily",
        };

        setDemoTodos((prev) => [...prev, newTodo]);
        return [newTodo];
      }

      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            text: newTodoText,
            completed: false,
            goal_id: goalId,
            frequency: frequency || "daily",
            user_id: session?.user.id,
          },
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", goalId, frequency] });
      setNewTodoText("");
      toast({
        title: "Todo Added",
        description: "Your new todo has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding todo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleTodoMutation = useMutation({
    mutationFn: async (todoId: string) => {
      const todo = todos?.find((t) => t.id === todoId);
      if (!todo) throw new Error("Todo not found");

      if (isDemoMode) {
        setDemoTodos((prev) =>
          prev.map((t) =>
            t.id === todoId ? { ...t, completed: !t.completed } : t
          )
        );
        return;
      }

      const { error } = await supabase
        .from("todos")
        .update({ completed: !todo.completed })
        .eq("id", todoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", goalId, frequency] });
      toast({
        title: "Todo Updated",
        description: "Todo status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating todo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (todoId: string) => {
      if (isDemoMode) {
        setDemoTodos((prev) => prev.filter((t) => t.id !== todoId));
        return;
      }

      const { error } = await supabase.from("todos").delete().eq("id", todoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", goalId, frequency] });
      toast({
        title: "Todo Deleted",
        description: "The todo has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting todo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addTodo = () => {
    if (!newTodoText.trim()) return;
    addTodoMutation.mutate();
  };

  const toggleTodo = (todoId: string) => {
    toggleTodoMutation.mutate(todoId);
  };

  const deleteTodo = (todoId: string) => {
    deleteTodoMutation.mutate(todoId);
  };

  if (compact) {
    return (
      <Card className="border-primary-100 dark:border-primary-900/20 shadow-sm">
        <CardContent className="p-3 space-y-3">
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-6 bg-primary-50 dark:bg-primary-900/10 rounded-md"
                />
              ))}
            </div>
          ) : !todos?.length ? (
            <p className="text-sm text-muted-foreground text-center">
              No tasks yet. Add one below.
            </p>
          ) : (
            <ul className="space-y-2">
              {todos.slice(0, limit || 3).map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between gap-2"
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="mr-2 h-4 w-4 rounded-sm border border-primary-200 text-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-primary-900 dark:border-primary-800 dark:focus:ring-primary-800 dark:checked:bg-primary-500 dark:checked:border-primary-500"
                    />
                    <span
                      className={todo.completed ? "line-through text-sm text-muted-foreground" : "text-sm text-gray-900 dark:text-gray-100"}
                    >
                      {todo.text}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add task..."
              className="text-sm border-primary-100 dark:border-primary-800/30 focus:ring-2 focus:ring-primary-500/20"
            />
            <Button
              size="icon"
              onClick={addTodo}
              className="h-8 w-8 rounded-full bg-primary hover:bg-primary-600 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {isLoading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 bg-primary-50 dark:bg-primary-900/10 rounded-md"
            />
          ))}
        </div>
      ) : !todos?.length ? (
        <p className="text-sm text-muted-foreground">No tasks for this goal.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between rounded-md border border-primary-100 dark:border-primary-900/20 bg-white dark:bg-gray-950 shadow-sm p-2"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-5 w-5 rounded-sm border border-primary-200 text-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-primary-900 dark:border-primary-800 dark:focus:ring-primary-800 dark:checked:bg-primary-500 dark:checked:border-primary-500"
                />
                <span
                  className={todo.completed ? "line-through text-muted-foreground" : "text-gray-900 dark:text-gray-100"}
                >
                  {todo.text}
                </span>
              </label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add new task..."
          className="border-primary-100 dark:border-primary-800/30 focus:ring-2 focus:ring-primary-500/20"
        />
        <Button
          onClick={addTodo}
          className="bg-primary hover:bg-primary-600 text-white"
        >
          Add Task
        </Button>
      </div>
    </div>
  );
}
