import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus,
  Target,
  Calendar,
  Trash2,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  LayoutGrid,
  Clock,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoList } from "@/components/home/TodoList";
import { GoalTags } from "@/components/goals/GoalTags";
import { GoalProgress } from "@/components/goals/GoalProgress";
import { useDemoMode } from "@/context/DemoContext";
import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Goal {
  id: string;
  title: string;
  deadline?: string;
  completed?: boolean;
  position?: number;
  category?: string;
  reminder_enabled?: boolean;
  reminder_frequency?: string;
  timeframe?: string; // 'long-term', 'month', 'week', 'today'
  user_id?: string;
}

const CATEGORIES = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "health", label: "Health" },
  { value: "learning", label: "Learning" },
  { value: "finance", label: "Finance" },
];

const TIMEFRAMES = [
  { value: "long-term", label: "Long-term" },
  { value: "month", label: "This Month" },
  { value: "week", label: "This Week" },
  { value: "today", label: "Today" },
];

export default function Goals() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("personal");
  const [newGoalTimeframe, setNewGoalTimeframe] = useState("long-term");
  const [newGoalDeadline, setNewGoalDeadline] = useState<Date | undefined>(undefined);
  const [showNewGoalInput, setShowNewGoalInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string | null>(null);
  const { isDemoMode } = useDemoMode();
  
  const [demoGoals, setDemoGoals] = useState<Goal[]>([
    {
      id: uuidv4(),
      title: "Start a business",
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      category: "work",
      position: 1,
      completed: false,
      timeframe: "long-term"
    },
    {
      id: uuidv4(),
      title: "Improve fitness level",
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      category: "health",
      position: 2,
      completed: false,
      timeframe: "long-term"
    },
    {
      id: uuidv4(),
      title: "Prepare business plan",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      category: "work",
      position: 3,
      completed: false,
      timeframe: "month"
    },
    {
      id: uuidv4(),
      title: "Research market competition",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: "work",
      position: 4,
      completed: false,
      timeframe: "week"
    },
    {
      id: uuidv4(),
      title: "Complete 30-minute workout",
      deadline: new Date().toISOString(),
      category: "health",
      position: 5,
      completed: false,
      timeframe: "today"
    }
  ]);
  
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      if (isDemoMode) return { user: { id: "demo-user" } };
      
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
        return null;
      }
      return data.session;
    },
  });

  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals", selectedCategory, selectedTimeframe, demoGoals],
    queryFn: async () => {
      if (!session?.user.id) return [];
      
      if (isDemoMode) {
        let filteredGoals = [...demoGoals];
        
        if (selectedCategory) {
          filteredGoals = filteredGoals.filter(goal => goal.category === selectedCategory);
        }
        
        if (selectedTimeframe) {
          filteredGoals = filteredGoals.filter(goal => goal.timeframe === selectedTimeframe);
        }
        
        return filteredGoals;
      }
      
      let query = supabase
        .from("goals")
        .select("*")
        .eq("user_id", session.user.id)
        .order("position");

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }
      
      if (selectedTimeframe) {
        query = query.eq("timeframe", selectedTimeframe);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error fetching goals",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data as Goal[];
    },
    enabled: !!session?.user.id,
  });

  const addGoalMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user.id) throw new Error("Not authenticated");

      if (isDemoMode) {
        const newGoal = {
          id: uuidv4(),
          title: newGoalTitle,
          category: newGoalCategory,
          timeframe: newGoalTimeframe,
          deadline: newGoalDeadline ? newGoalDeadline.toISOString() : undefined,
          user_id: "demo-user",
          position: (demoGoals.length || 0) + 1,
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setDemoGoals(prev => [...prev, newGoal]);
        return [newGoal];
      }

      const { data, error } = await supabase
        .from("goals")
        .insert([{ 
          title: newGoalTitle,
          category: newGoalCategory,
          timeframe: newGoalTimeframe,
          deadline: newGoalDeadline ? newGoalDeadline.toISOString() : undefined,
          user_id: session.user.id,
          position: (goals?.length || 0) + 1
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      setNewGoalTitle("");
      setNewGoalCategory("personal");
      setNewGoalTimeframe("long-term");
      setNewGoalDeadline(undefined);
      setShowNewGoalInput(false);
      toast({
        title: "Goal Added",
        description: "Your new goal has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const goal = goals?.find(g => g.id === goalId);
      if (!goal) throw new Error("Goal not found");

      if (isDemoMode) {
        setDemoGoals(prev => 
          prev.map(g => 
            g.id === goalId ? { ...g, completed: !g.completed } : g
          )
        );
        return;
      }

      const { error } = await supabase
        .from("goals")
        .update({ completed: !goal.completed })
        .eq("id", goalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Goal Updated",
        description: "Goal status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      if (isDemoMode) {
        setDemoGoals(prev => prev.filter(g => g.id !== goalId));
        return;
      }
      
      const { error } = await supabase.from("goals").delete().eq("id", goalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Goal Deleted",
        description: "The goal has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const moveGoalMutation = useMutation({
    mutationFn: async ({
      goalId,
      newPosition,
    }: {
      goalId: string;
      newPosition: number;
    }) => {
      if (isDemoMode) {
        setDemoGoals(prev => {
          const updatedGoals = [...prev];
          const goalIndex = updatedGoals.findIndex(g => g.id === goalId);
          
          if (goalIndex !== -1) {
            updatedGoals[goalIndex] = {
              ...updatedGoals[goalIndex],
              position: newPosition
            };
          }
          
          return updatedGoals;
        });
        return;
      }
      
      const { error } = await supabase
        .from("goals")
        .update({ position: newPosition })
        .eq("id", goalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
    onError: (error) => {
      toast({
        title: "Error moving goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addGoal = () => {
    if (!newGoalTitle.trim()) return;
    addGoalMutation.mutate();
  };

  const deleteGoal = (goalId: string) => {
    deleteGoalMutation.mutate(goalId);
  };

  const moveGoal = (goalId: string, direction: "up" | "down") => {
    const index = goals?.findIndex((goal) => goal.id === goalId) ?? -1;
    if (
      index === -1 ||
      (direction === "up" && index === 0) ||
      (direction === "down" && index === (goals?.length ?? 0) - 1)
    )
      return;

    const newPosition =
      goals?.[index + (direction === "up" ? -1 : 1)]?.position ?? 0;
    moveGoalMutation.mutate({ goalId, newPosition });
  };

  const groupedGoals = (goals || []).reduce<Record<string, Goal[]>>((acc, goal) => {
    const timeframe = goal.timeframe || 'long-term';
    if (!acc[timeframe]) {
      acc[timeframe] = [];
    }
    acc[timeframe].push(goal);
    return acc;
  }, {});

  return (
    <PageContainer>
      <div className="space-y-6 pb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/home")}
              className="rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Goals
            </h1>
          </div>
          <Button
            size="sm"
            onClick={() => setShowNewGoalInput(true)}
            className="text-xs bg-primary hover:bg-primary-600 text-white"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="p-4 border border-primary-100 dark:border-primary-900/20 shadow-sm">
            <h3 className="text-sm font-medium text-primary-500 mb-3">Category Filter</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={selectedCategory === null ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="whitespace-nowrap rounded-full"
              >
                <LayoutGrid className="w-3.5 h-3.5 mr-1" />
                All
              </Button>
              {CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="whitespace-nowrap rounded-full"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-4 border border-primary-100 dark:border-primary-900/20 shadow-sm">
            <h3 className="text-sm font-medium text-primary-500 mb-3">Timeframe Filter</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={selectedTimeframe === null ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(null)}
                className="whitespace-nowrap rounded-full"
              >
                <Clock className="w-3.5 h-3.5 mr-1" />
                All
              </Button>
              {TIMEFRAMES.map((timeframe) => (
                <Button
                  key={timeframe.value}
                  variant={selectedTimeframe === timeframe.value ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe.value)}
                  className="whitespace-nowrap rounded-full"
                >
                  {timeframe.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {showNewGoalInput && (
          <Card className="p-5 border-primary-100 dark:border-primary-900/20 shadow-md">
            <h2 className="text-lg font-medium mb-4 text-primary-700 dark:text-primary-300">Add New Goal</h2>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1 block">Goal Title</label>
                <Input
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="Enter goal title..."
                  className="border-primary-100 dark:border-primary-800/30 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1 block">Category</label>
                  <Select
                    value={newGoalCategory}
                    onValueChange={setNewGoalCategory}
                  >
                    <SelectTrigger className="border-primary-100 dark:border-primary-800/30">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1 block">Timeframe</label>
                  <Select
                    value={newGoalTimeframe}
                    onValueChange={setNewGoalTimeframe}
                  >
                    <SelectTrigger className="border-primary-100 dark:border-primary-800/30">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEFRAMES.map((timeframe) => (
                        <SelectItem key={timeframe.value} value={timeframe.value}>
                          {timeframe.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1 block">Deadline (Optional)</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-primary-100 dark:border-primary-800/30",
                        !newGoalDeadline && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newGoalDeadline ? format(newGoalDeadline, "PPP") : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={newGoalDeadline}
                      onSelect={setNewGoalDeadline}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewGoalInput(false)}
                  className="border-primary-200 hover:bg-primary-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={addGoal}
                  size="sm"
                  className="bg-primary hover:bg-primary-600 text-white"
                >
                  Add Goal
                </Button>
              </div>
            </div>
          </Card>
        )}

        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-primary-50 dark:bg-primary-900/10 rounded-xl"
              />
            ))}
          </div>
        ) : !goals?.length ? (
          <Card className="p-8 text-center space-y-5 border-primary-100 dark:border-primary-900/20 shadow-sm bg-gradient-to-br from-white to-primary-50/30 dark:from-gray-900 dark:to-primary-900/10">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <Target className="w-10 h-10 text-primary opacity-70" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                {selectedCategory || selectedTimeframe
                  ? "No matching goals found"
                  : "Set Your First Goal"
                }
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {selectedCategory || selectedTimeframe
                  ? "Try changing your filters or add a new goal that matches your criteria"
                  : "Add your first goal to start tracking your progress toward success without burnout"
                }
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setShowNewGoalInput(true)}
              className="mx-auto bg-primary hover:bg-primary-600 text-white px-4"
            >
              <Plus className="w-4 h-4 mr-1" />
              {selectedCategory || selectedTimeframe ? "Add Matching Goal" : "Add Your First Goal"}
            </Button>
          </Card>
        ) : selectedTimeframe ? (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-primary-700 dark:text-primary-300">
              {TIMEFRAMES.find(t => t.value === selectedTimeframe)?.label || "Goals"}
              <span className="ml-2 text-sm text-muted-foreground">({goals.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal, index) => (
                <GoalCard 
                  key={goal.id}
                  goal={goal}
                  onToggle={() => toggleGoalMutation.mutate(goal.id)}
                  onDelete={() => deleteGoal(goal.id)}
                  onMoveUp={() => moveGoal(goal.id, "up")}
                  onMoveDown={() => moveGoal(goal.id, "down")}
                  canMoveUp={index > 0}
                  canMoveDown={index < (goals?.length ?? 0) - 1}
                  isDemoMode={isDemoMode}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(TIMEFRAMES.reduce((acc, timeframe) => {
              acc[timeframe.value] = {
                label: timeframe.label,
                goals: groupedGoals[timeframe.value] || []
              };
              return acc;
            }, {} as Record<string, { label: string, goals: Goal[] }>))
            .filter(([_, { goals }]) => goals.length > 0)
            .map(([timeframeKey, { label, goals }]) => (
              <Collapsible key={timeframeKey} defaultOpen={timeframeKey === "today" || timeframeKey === "week"} className="space-y-3">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">{label}</h3>
                    <span className="ml-2 px-2 py-0.5 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                      {goals.length}
                    </span>
                  </div>
                  <ChevronDownIcon className="h-5 w-5 text-primary-400 transform transition-transform" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-2 animate-accordion-down">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.map((goal, index) => (
                      <GoalCard 
                        key={goal.id}
                        goal={goal}
                        onToggle={() => toggleGoalMutation.mutate(goal.id)}
                        onDelete={() => deleteGoal(goal.id)}
                        onMoveUp={() => moveGoal(goal.id, "up")}
                        onMoveDown={() => moveGoal(goal.id, "down")}
                        canMoveUp={index > 0}
                        canMoveDown={index < goals.length - 1}
                        isDemoMode={isDemoMode}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

interface GoalCardProps {
  goal: Goal;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isDemoMode: boolean;
}

function GoalCard({ goal, onToggle, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown, isDemoMode }: GoalCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const localSelectedTimeframe = goal.timeframe;

  return (
    <Card 
      className={`transition-all duration-300 border-primary-100 dark:border-primary-900/20 shadow-sm hover:shadow-md ${
        goal.completed ? 'bg-primary-50/50 dark:bg-primary-900/5' : 'bg-white dark:bg-gray-950'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={`h-8 w-8 p-0 rounded-full ${
              goal.completed
                ? 'text-primary bg-primary-100 dark:bg-primary-900/20'
                : 'text-muted-foreground hover:bg-primary-50 dark:hover:bg-primary-900/10'
            }`}
          >
            <CheckCircle className={`h-5 w-5 ${goal.completed ? 'fill-primary-200' : ''}`} />
          </Button>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className={`font-medium text-gray-900 dark:text-gray-100 ${
                  goal.completed ? 'line-through text-muted-foreground' : ''
                }`}>
                  {goal.title}
                </h3>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {goal.category && (
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {CATEGORIES.find(c => c.value === goal.category)?.label || goal.category}
                    </div>
                  )}
                  {goal.timeframe && goal.timeframe !== localSelectedTimeframe && (
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                      {TIMEFRAMES.find(t => t.value === goal.timeframe)?.label || goal.timeframe}
                    </div>
                  )}
                </div>
                {goal.deadline && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="w-3.5 h-3.5 mr-1 opacity-70" />
                    Due {format(new Date(goal.deadline), "MMM d, yyyy")}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                {canMoveUp && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMoveUp}
                    className="h-8 w-8 p-0 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-full"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                )}
                {canMoveDown && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMoveDown}
                    className="h-8 w-8 p-0 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-full"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isDemoMode && (
              <div className="mt-4">
                <GoalProgress goalId={goal.id} />
              </div>
            )}

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(!isOpen)} 
              className="mt-3 text-xs text-primary hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10"
            >
              {isOpen ? "Hide Tasks" : "Show Tasks"}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 animate-fade-in">
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="w-full mb-4 bg-white dark:bg-gray-900 border border-primary-100 dark:border-primary-900/20 rounded-md">
              <TabsTrigger 
                value="daily" 
                className="flex-1 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 dark:data-[state=active]:bg-primary-900/10 dark:data-[state=active]:text-primary-400 rounded-sm"
              >
                Daily Tasks
              </TabsTrigger>
              <TabsTrigger 
                value="weekly" 
                className="flex-1 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 dark:data-[state=active]:bg-primary-900/10 dark:data-[state=active]:text-primary-400 rounded-sm"
              >
                Weekly Tasks
              </TabsTrigger>
              <TabsTrigger 
                value="monthly" 
                className="flex-1 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 dark:data-[state=active]:bg-primary-900/10 dark:data-[state=active]:text-primary-400 rounded-sm"
              >
                Monthly Tasks
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="mt-2">
              <TodoList frequency="daily" goalId={goal.id} />
            </TabsContent>
            
            <TabsContent value="weekly" className="mt-2">
              <TodoList frequency="weekly" goalId={goal.id} />
            </TabsContent>
            
            <TabsContent value="monthly" className="mt-2">
              <TodoList frequency="monthly" goalId={goal.id} />
            </TabsContent>
          </Tabs>
