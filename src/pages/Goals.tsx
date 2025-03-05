
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
  Filter,
  ArrowRight,
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

// Create the GoalCard component to clean up the main component
const GoalCard = ({ 
  goal, 
  onToggle, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  canMoveUp, 
  canMoveDown,
  isDemoMode 
}: { 
  goal: Goal;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isDemoMode: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card className="overflow-hidden border border-primary-100 dark:border-primary-900/20 shadow-sm transition-all hover:shadow-md">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className={`mt-0.5 h-5 w-5 p-0 rounded-full ${
                goal.completed
                  ? 'text-primary bg-primary-100 dark:bg-primary-900/20'
                  : 'text-muted-foreground hover:bg-primary-50 dark:hover:bg-primary-900/10'
              }`}
            >
              <CheckCircle className={`h-4 w-4 ${goal.completed ? 'fill-primary-200' : ''}`} />
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : 'text-gray-900 dark:text-gray-100'}`}>
                  {goal.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-7 w-7 p-0 ml-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                {goal.category && (
                  <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full">
                    {CATEGORIES.find(c => c.value === goal.category)?.label}
                  </span>
                )}
                {goal.timeframe && (
                  <span className="text-xs px-2 py-0.5 bg-secondary-50 text-secondary-700 rounded-full">
                    {TIMEFRAMES.find(t => t.value === goal.timeframe)?.label}
                  </span>
                )}
                {goal.deadline && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(goal.deadline), "MMM d, yyyy")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="h-8 text-xs text-red-600 bg-red-50 hover:bg-red-100 border-red-100 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
              
              <div className="flex rounded-md overflow-hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onMoveUp}
                  disabled={!canMoveUp}
                  className="h-8 rounded-r-none text-xs border-primary-100 hover:bg-primary-50"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onMoveDown}
                  disabled={!canMoveDown}
                  className="h-8 rounded-l-none text-xs border-primary-100 hover:bg-primary-50"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            
            {/* Add progress tracking */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <GoalProgress value={goal.completed ? 100 : 0} />
              {!isDemoMode && (
                <div className="mt-3">
                  <GoalTags tags={["Focus", "Priority"]} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

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
  const [showFilters, setShowFilters] = useState(false);
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
      if (!newGoalTitle.trim()) {
        throw new Error("Goal title is required");
      }
      
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

      // Create goal object with only required fields
      const goalData: any = { 
        title: newGoalTitle,
        user_id: session.user.id,
        position: (goals?.length || 0) + 1
      };
      
      // Only add optional fields if they have values
      if (newGoalCategory) {
        goalData.category = newGoalCategory;
      }
      
      if (newGoalTimeframe) {
        goalData.timeframe = newGoalTimeframe;
      }
      
      if (newGoalDeadline) {
        goalData.deadline = newGoalDeadline.toISOString();
      }

      const { data, error } = await supabase
        .from("goals")
        .insert([goalData])
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
    if (!newGoalTitle.trim()) {
      toast({
        title: "Goal title required",
        description: "Please enter a title for your goal.",
        variant: "destructive",
      });
      return;
    }
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
      <div className="space-y-6 pb-24">
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-xs border-primary-100 hover:bg-primary-50"
            >
              <Filter className="w-3.5 h-3.5 mr-1" /> Filters
            </Button>
            <Button
              size="sm"
              onClick={() => setShowNewGoalInput(true)}
              className="text-xs bg-primary hover:bg-primary-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Goal
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-100 dark:border-primary-900/20 dark:bg-gray-950">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-primary-500 mb-2">Category</h3>
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
              </div>

              <div>
                <h3 className="text-sm font-medium text-primary-500 mb-2">Timeframe</h3>
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
              </div>
            </div>
          </div>
        )}

        {showNewGoalInput && (
          <Card className="p-5 border-primary-100 dark:border-primary-900/20 shadow-md">
            <h2 className="text-lg font-medium mb-4 text-primary-700 dark:text-primary-300">Add New Goal</h2>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1 block">
                  Goal Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="Enter goal title..."
                  className="border-primary-100 dark:border-primary-800/30 focus:ring-2 focus:ring-primary-500/20"
                />
                {newGoalTitle.trim() === "" && (
                  <p className="text-xs text-red-500 mt-1">Title is required</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1 block">
                    Category <span className="text-xs text-gray-500">(Optional)</span>
                  </label>
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
                  <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1 block">
                    Timeframe <span className="text-xs text-gray-500">(Optional)</span>
                  </label>
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
                <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1 block">
                  Deadline <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal border-primary-100 dark:border-primary-800/30",
                          !newGoalDeadline && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {newGoalDeadline ? format(newGoalDeadline, "PPP") : <span>No deadline set</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={newGoalDeadline}
                        onSelect={setNewGoalDeadline}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  {newGoalDeadline && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setNewGoalDeadline(undefined)}
                      className="h-10 w-10 rounded-full text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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
                  disabled={!newGoalTitle.trim()}
                  className={`bg-primary hover:bg-primary-600 text-white ${!newGoalTitle.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            <Card className="p-6 border-primary-100 shadow-sm overflow-hidden bg-gradient-to-r from-white to-primary-50/20 dark:from-gray-900 dark:to-primary-900/5">
              <div className="flex flex-col">
                <h2 className="text-lg font-medium text-primary-700 dark:text-primary-300 mb-4">
                  Your Path to Success
                </h2>
                
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary-200 dark:bg-primary-700/30"></div>
                  
                  <div className="space-y-6">
                    {/* Today's Actions */}
                    <div className="relative pl-10">
                      <div className="absolute left-2 top-1.5 w-5 h-5 rounded-full bg-primary-600 border-4 border-white dark:border-gray-900 z-10"></div>
                      <h3 className="text-base font-medium text-primary-600 mb-2 flex items-center">
                        Today 
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedTimeframe("today")} 
                          className="ml-2 text-xs h-7 text-primary-600 hover:bg-primary-50"
                        >
                          <span>View All</span>
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </h3>
                      
                      {groupedGoals["today"]?.length ? (
                        <div className="space-y-2">
                          {groupedGoals["today"].slice(0, 3).map(goal => (
                            <div key={goal.id} className="p-3 bg-white rounded-lg shadow-sm border border-primary-100 hover:border-primary-200 transition-all">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleGoalMutation.mutate(goal.id)}
                                    className={`h-6 w-6 p-0 rounded-full ${
                                      goal.completed
                                        ? 'text-primary bg-primary-100 dark:bg-primary-900/20'
                                        : 'text-muted-foreground hover:bg-primary-50 dark:hover:bg-primary-900/10'
                                    }`}
                                  >
                                    <CheckCircle className={`h-4 w-4 ${goal.completed ? 'fill-primary-200' : ''}`} />
                                  </Button>
                                  <div>
                                    <h4 className={`text-sm font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                                      {goal.title}
                                    </h4>
                                    {goal.deadline && (
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        <Calendar className="w-3 h-3 inline mr-1" /> 
                                        Due {format(new Date(goal.deadline), "MMM d")}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {goal.category && (
                                  <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full">
                                    {CATEGORIES.find(c => c.value === goal.category)?.label}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          {groupedGoals["today"].length > 3 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedTimeframe("today")}
                              className="text-xs text-primary-600 hover:bg-primary-50"
                            >
                              +{groupedGoals["today"].length - 3} more today
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No goals set for today</p>
                      )}
                    </div>
                    
                    {/* This Week */}
                    <div className="relative pl-10">
                      <div className="absolute left-2 top-1.5 w-5 h-5 rounded-full bg-secondary-500 border-4 border-white dark:border-gray-900 z-10"></div>
                      <h3 className="text-base font-medium text-secondary-600 mb-2 flex items-center">
                        This Week
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedTimeframe("week")} 
                          className="ml-2 text-xs h-7 text-secondary-600 hover:bg-secondary-50"
                        >
                          <span>View All</span>
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </h3>
                      
                      {groupedGoals["week"]?.length ? (
                        <div className="space-y-2">
                          {groupedGoals["week"].slice(0, 2).map(goal => (
                            <div key={goal.id} className="p-3 bg-white rounded-lg shadow-sm border border-secondary-100 hover:border-secondary-200 transition-all">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleGoalMutation.mutate(goal.id)}
                                    className={`h-6 w-6 p-0 rounded-full ${
                                      goal.completed
                                        ? 'text-secondary bg-secondary-100'
                                        : 'text-muted-foreground hover:bg-secondary-50'
                                    }`}
                                  >
                                    <CheckCircle className={`h-4 w-4 ${goal.completed ? 'fill-secondary-200' : ''}`} />
                                  </Button>
                                  <div>
                                    <h4 className={`text-sm font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                                      {goal.title}
                                    </h4>
                                    {goal.deadline && (
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        <Calendar className="w-3 h-3 inline mr-1" /> 
                                        Due {format(new Date(goal.deadline), "MMM d")}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {goal.category && (
                                  <span className="text-xs px-2 py-0.5 bg-secondary-50 text-secondary-700 rounded-full">
                                    {CATEGORIES.find(c => c.value === goal.category)?.label}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          {groupedGoals["week"].length > 2 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedTimeframe("week")}
                              className="text-xs text-secondary-600 hover:bg-secondary-50"
                            >
                              +{groupedGoals["week"].length - 2} more this week
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No goals set for this week</p>
                      )}
                    </div>
                    
                    {/* This Month */}
                    <div className="relative pl-10">
                      <div className="absolute left-2 top-1.5 w-5 h-5 rounded-full bg-amber-500 border-4 border-white dark:border-gray-900 z-10"></div>
                      <h3 className="text-base font-medium text-amber-600 mb-2 flex items-center">
                        This Month
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedTimeframe("month")} 
                          className="ml-2 text-xs h-7 text-amber-600 hover:bg-amber-50"
                        >
                          <span>View All</span>
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </h3>
                      
                      {groupedGoals["month"]?.length ? (
                        <div className="space-y-2">
                          {groupedGoals["month"].slice(0, 2).map(goal => (
                            <div key={goal.id} className="p-3 bg-white rounded-lg shadow-sm border border-amber-100 hover:border-amber-200 transition-all">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleGoalMutation.mutate(goal.id)}
                                    className={`h-6 w-6 p-0 rounded-full ${
                                      goal.completed
                                        ? 'text-amber-500 bg-amber-100'
                                        : 'text-muted-foreground hover:bg-amber-50'
                                    }`}
                                  >
                                    <CheckCircle className={`h-4 w-4 ${goal.completed ? 'fill-amber-200' : ''}`} />
                                  </Button>
                                  <div>
                                    <h4 className={`text-sm font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                                      {goal.title}
                                    </h4>
                                    {goal.deadline && (
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        <Calendar className="w-3 h-3 inline mr-1" /> 
                                        Due {format(new Date(goal.deadline), "MMM d")}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {goal.category && (
                                  <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                                    {CATEGORIES.find(c => c.value === goal.category)?.label}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          {groupedGoals["month"].length > 2 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedTimeframe("month")}
                              className="text-xs text-amber-600 hover:bg-amber-50"
                            >
                              +{groupedGoals["month"].length - 2} more this month
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No goals set for this month</p>
                      )}
                    </div>
                    
                    {/* Long-term */}
                    <div className="relative pl-10">
                      <div className="absolute left-2 top-1.5 w-5 h-5 rounded-full bg-indigo-500 border-4 border-white dark:border-gray-900 z-10"></div>
                      <h3 className="text-base font-medium text-indigo-600 mb-2 flex items-center">
                        Long-term
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedTimeframe("long-term")} 
                          className="ml-2 text-xs h-7 text-indigo-600 hover:bg-indigo-50"
                        >
                          <span>View All</span>
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </h3>
                      
                      {groupedGoals["long-term"]?.length ? (
                        <div className="space-y-2">
                          {groupedGoals["long-term"].slice(0, 2).map(goal => (
                            <div key={goal.id} className="p-3 bg-white rounded-lg shadow-sm border border-indigo-100 hover:border-indigo-200 transition-all">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleGoalMutation.mutate(goal.id)}
                                    className={`h-6 w-6 p-0 rounded-full ${
                                      goal.completed
                                        ? 'text-indigo-500 bg-indigo-100'
                                        : 'text-muted-foreground hover:bg-indigo-50'
                                    }`}
                                  >
                                    <CheckCircle className={`h-4 w-4 ${goal.completed ? 'fill-indigo-200' : ''}`} />
                                  </Button>
                                  <div>
                                    <h4 className={`text-sm font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                                      {goal.title}
                                    </h4>
                                    {goal.deadline && (
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        <Calendar className="w-3 h-3 inline mr-1" /> 
                                        Due {format(new Date(goal.deadline), "MMM d")}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {goal.category && (
                                  <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                                    {CATEGORIES.find(c => c.value === goal.category)?.label}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          {groupedGoals["long-term"].length > 2 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedTimeframe("long-term")}
                              className="text-xs text-indigo-600 hover:bg-indigo-50"
                            >
                              +{groupedGoals["long-term"].length - 2} more long-term
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No long-term goals set</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
