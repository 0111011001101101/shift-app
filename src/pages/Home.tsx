import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, ChevronRight, Trophy, Star, Lock, Pencil, Check, Trash, Plus, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
      variant: "default",
    });
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        {/* Modern Header Section */}
        <div className="relative py-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl -z-10" />
          <div className="flex flex-col gap-1">
            <div className="space-y-1">
              <div className="flex flex-col">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fadeIn relative inline-block">
                  Good Morning,
                </h1>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fadeIn relative inline-block">
                  Couch Potato
                </h1>
              </div>
              <p className="text-lg font-medium tracking-wide text-gray-600 dark:text-gray-300 bg-gradient-to-r from-secondary/80 to-primary/80 bg-clip-text text-transparent">
                Let's make today count
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Streak Section */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/30 via-secondary/40 to-primary/30 backdrop-blur-sm border border-amber-500/40 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/40 blur-xl rounded-full" />
                <div className="relative p-2 bg-gradient-to-br from-amber-500/50 to-secondary/50 rounded-xl backdrop-blur-sm">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Current Streak</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-black relative">7</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300">days</span>
                </div>
              </div>
            </div>
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-white via-amber-200 to-amber-400 flex items-center justify-center transform hover:scale-110 transition-transform duration-200 shadow-lg"
                >
                  <Star className="w-3 h-3 fill-current text-amber-500" />
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 mt-4 flex items-center gap-1 justify-center">
            <Clock className="w-3 h-3" />
            Next stand-up: Tomorrow, 9:30
          </p>
        </div>

        {/* To-Do Tabs Section */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="today" className="flex-1">Today's To-Do</TabsTrigger>
            <TabsTrigger value="week" className="flex-1">Week's To-Do</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="week" className="space-y-4">
              {/* Weekly Goals */}
              <div className="flex items-center justify-between text-sm">
                <span>Exercise 3 times per week</span>
                <span className="text-xs px-2 py-0.5 bg-warning/10 text-warning rounded-full">2/3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Weekend digital detox</span>
                <span className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded-full">Weekly</span>
              </div>
          </TabsContent>
        </Tabs>

        <section className="space-y-4 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
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
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">65%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-amber-500/30 via-secondary/40 to-primary/30 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-300" style={{ width: '65%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-secondary/10 bg-secondary/5 backdrop-blur-sm transition-all duration-300 hover:bg-secondary/10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Scale User Base</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Target: Q4 2024</p>
                </div>
                <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">25%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-amber-500/30 via-secondary/40 to-primary/30 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-300" style={{ width: '25%' }} />
              </div>
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
