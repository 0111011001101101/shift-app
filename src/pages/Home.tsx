import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Target, ChevronRight, Trophy, Star, Lock, Pencil, Check, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editedTodoText, setEditedTodoText] = useState("");
  const [newTodo, setNewTodo] = useState("");
  
  const handleEditTodo = (id: string, currentText: string) => {
    setEditingTodoId(id);
    setEditedTodoText(currentText);
  };

  const handleSaveTodo = (id: string) => {
    setEditingTodoId(null);
    toast({
      title: "Todo updated",
      description: "Your changes have been saved.",
    });
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setNewTodo("");
      toast({
        title: "Todo added",
        description: "New todo has been added to your list.",
      });
    }
  };

  // Swipe to delete animation setup with proper typing
  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  
  const bind = useDrag(({ down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
    const trigger = vx > 0.2; // Now properly comparing number with number
    const isGone = !down && trigger;
    
    api.start({ 
      x: isGone ? window.innerWidth : down ? mx : 0, 
      immediate: down 
    });
    
    if (isGone) {
      toast({
        title: "Todo removed",
        description: "The todo has been deleted.",
      });
    }
  });
  
  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header Section with improved gradient */}
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

        {/* Quick Add Todo Form */}
        <form onSubmit={handleAddTodo} className="flex gap-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </form>

        {/* Todos Section with improved visual hierarchy */}
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="w-full border-b border-gray-100 dark:border-gray-800">
              <TabsTrigger value="today" className="flex-1">Today's To-Do</TabsTrigger>
              <TabsTrigger value="week" className="flex-1">Week's To-Do</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="p-4 space-y-2">
              {/* Animated Todo Items */}
              <animated.div
                {...bind()}
                style={{ x, touchAction: 'none' }}
                className="flex items-center justify-between text-sm p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-success/10 hover:text-success"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <span>Take lunch breaks away from desk</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">Daily</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    onClick={() => handleEditTodo("1", "Take lunch breaks away from desk")}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </animated.div>
            </TabsContent>
            
            <TabsContent value="week" className="p-4 space-y-2">
              {/* Weekly todos with similar styling */}
              <div className="flex items-center justify-between text-sm p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <span>Exercise 3 times per week</span>
                <span className="text-xs px-2 py-0.5 bg-warning/10 text-warning rounded-full">2/3</span>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Goals Preview Section */}
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-4">
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
          
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 backdrop-blur-sm transition-all duration-300 hover:bg-primary/10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Launch MVP Product</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Target: Q2 2024</p>
                </div>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">In Progress</span>
              </div>
              <Progress value={65} className="h-1.5 mb-2" />
            </div>
          </div>
        </div>

        {/* Hurdles Preview Button */}
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