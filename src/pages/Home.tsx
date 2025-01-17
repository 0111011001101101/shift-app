import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Target, ChevronRight, Trophy, Star, Lock, Pencil, Check, Trash, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

interface Todo {
  id: string;
  text: string;
  type: 'daily' | 'weekly';
}

export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editedTodoText, setEditedTodoText] = useState("");
  const [newTodoText, setNewTodoText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Take lunch breaks away from desk", type: 'daily' },
    { id: "2", text: "No work emails after 6 PM", type: 'daily' },
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
        variant: "default", // Changed from "success" to "default"
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
        variant: "default", // Changed from "success" to "default"
      });
    }
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Todo removed",
      description: "The todo has been deleted.",
      variant: "destructive",
    });
  };

  const handleCompleteTodo = (id: string) => {
    handleDeleteTodo(id);
    toast({
      title: "Todo completed",
      description: "Great job! Todo marked as complete.",
      variant: "default", // Changed from "success" to "default"
    });
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative py-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl -z-10" />
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-sm">
              <Sun className="w-6 h-6 text-secondary animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Good Morning, User
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Let's make today count
              </p>
            </div>
          </div>
        </div>

        {/* Streak Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
              <div className="relative p-2 bg-gradient-to-br from-amber-500/30 to-secondary/30 rounded-xl backdrop-blur-sm">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Streak</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-secondary bg-clip-text text-transparent">7</span>
                <span className="text-xs text-gray-500">days</span>
              </div>
            </div>
          </div>
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-amber-500/20 to-secondary/20 flex items-center justify-center"
              >
                <Star className="w-4 h-4 text-amber-500" />
              </div>
            ))}
          </div>
        </div>

        {/* To-Do Tabs Section */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="today" className="flex-1">Today's To-Do</TabsTrigger>
            <TabsTrigger value="week" className="flex-1">Week's To-Do</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Input
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Add a new todo..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              />
              <Button onClick={handleAddTodo} size="icon" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
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
          </TabsContent>
          
          <TabsContent value="week" className="space-y-4">
            <div className="space-y-2">
              {/* Weekly Goals */}
              <div className="flex items-center justify-between text-sm">
                <span>Exercise 3 times per week</span>
                <span className="text-xs px-2 py-0.5 bg-warning/10 text-warning rounded-full">2/3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Weekend digital detox</span>
                <span className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded-full">Weekly</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Long Term Goals Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Long Term Goals</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => navigate("/goals")}
            >
              View All
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 backdrop-blur-sm transition-all duration-300 hover:bg-primary/10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Launch MVP Product</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Target: Q2 2025</p>
                </div>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">In Progress</span>
              </div>
              <Progress value={65} className="h-1.5 mb-2" />
            </div>

            <div className="p-4 rounded-xl border border-secondary/10 bg-secondary/5 backdrop-blur-sm transition-all duration-300 hover:bg-secondary/10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Scale User Base</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Target: Q4 2024</p>
                </div>
                <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">Planning</span>
              </div>
              <Progress value={25} className="h-1.5 mb-2" />
            </div>
          </div>
        </section>

        {/* Simplified Hurdles Section */}
        <Button
          variant="outline"
          size="lg"
          className="w-full group relative overflow-hidden"
          onClick={() => navigate("/hurdles")}
        >
          <div className="absolute inset-0 bg-destructive/5 group-hover:bg-destructive/10 transition-colors" />
          <div className="relative flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-destructive" />
              <span className="text-destructive font-medium">View Current Hurdles</span>
            </div>
            <ChevronRight className="w-4 h-4 text-destructive" />
          </div>
        </Button>
      </div>
    </PageContainer>
  );
}
