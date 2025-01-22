import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SubGoal {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly';
  completed: boolean;
  goal: {
    title: string;
  } | null;
}

interface TodoListProps {
  frequency: 'daily' | 'weekly';
}

export function TodoList({ frequency }: TodoListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editedTodoText, setEditedTodoText] = useState("");
  const [newTodoText, setNewTodoText] = useState("");

  // Fetch sub-goals
  const { data: todos, isLoading } = useQuery({
    queryKey: ["sub-goals", frequency],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sub_goals")
        .select(`
          id,
          title,
          frequency,
          completed,
          goal:goal_id (
            title
          )
        `)
        .eq('frequency', frequency)
        .order('position');

      if (error) throw error;
      return data as SubGoal[];
    },
  });

  // Add new sub-goal
  const addTodoMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("sub_goals")
        .insert([
          {
            title: newTodoText,
            frequency: frequency,
          },
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-goals"] });
      setNewTodoText("");
      toast({
        title: "Todo added",
        description: "New todo has been added successfully.",
      });
    },
  });

  // Update sub-goal
  const updateTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("sub_goals")
        .update({ title: editedTodoText })
        .eq('id', id)
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

  // Toggle completion status
  const toggleTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { data, error } = await supabase
        .from("sub_goals")
        .update({ completed })
        .eq('id', id)
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {todos?.map(todo => (
          <div 
            key={todo.id} 
            className="group relative transform transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-gradient-to-r from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900 shadow-sm border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              {editingTodoId === todo.id ? (
                <div className="flex items-center gap-2 w-full">
                  <Input
                    value={editedTodoText}
                    onChange={(e) => setEditedTodoText(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSaveTodo(todo.id)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`p-0 h-auto hover:bg-transparent ${todo.completed ? 'text-primary' : 'text-muted-foreground'}`}
                      onClick={() => handleToggleTodo(todo.id, todo.completed)}
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                        {todo.completed && <Check className="w-3 h-3" />}
                      </div>
                    </Button>
                    <div>
                      <span className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {todo.title}
                      </span>
                      {todo.goal && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({todo.goal.title})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleEditTodo(todo.id, todo.title)}
                    >
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-6">
        <div className="relative flex items-center gap-2">
          <Input
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 pr-12 bg-white dark:bg-gray-800 border-none shadow-sm focus:ring-2 focus:ring-primary/20 rounded-full text-xs"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <Button 
            onClick={handleAddTodo} 
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white rounded-full w-8 h-8 shadow-md transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}