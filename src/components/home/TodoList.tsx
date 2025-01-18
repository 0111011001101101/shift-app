import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Todo {
  id: string;
  text: string;
  type: 'daily' | 'weekly';
}

export function TodoList() {
  const { toast } = useToast();
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editedTodoText, setEditedTodoText] = useState("");
  const [newTodoText, setNewTodoText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Add system logic", type: 'daily' },
  ]);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: newTodoText,
        type: 'daily'
      };
      setTodos([...todos, newTodo]);
      setNewTodoText("");
      toast({
        title: "Todo added",
        description: "New todo has been added successfully.",
        variant: "default",
      });
    }
  };

  const handleEditTodo = (id: string, currentText: string) => {
    setEditingTodoId(id);
    setEditedTodoText(currentText);
  };

  const handleSaveTodo = (id: string) => {
    if (editedTodoText.trim()) {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, text: editedTodoText } : todo
      ));
      setEditingTodoId(null);
      toast({
        title: "Todo updated",
        description: "Your changes have been saved.",
        variant: "default",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {todos.map(todo => (
          <div key={todo.id} className="group relative">
            <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
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
                  <span>{todo.text}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {todo.type}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleEditTodo(todo.id, todo.text)}
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