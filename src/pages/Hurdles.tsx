
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Calendar,
  XCircle,
  Shield,
  BrainCircuit
} from "lucide-react";
import { format, addDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Solution {
  id: string;
  text: string;
  isCompleted: boolean;
  frequency: "daily" | "weekly" | "as-needed";
}

interface Hurdle {
  id: string;
  title: string;
  solutions: Solution[];
  category?: string; // mental, practical, emotional
  deadline?: string;
}

const CATEGORIES = [
  { value: "mental", label: "Mental Block", icon: <BrainCircuit className="w-4 h-4 mr-2" /> },
  { value: "practical", label: "Practical Issue", icon: <Shield className="w-4 h-4 mr-2" /> },
  { value: "emotional", label: "Emotional Challenge", icon: <AlertCircle className="w-4 h-4 mr-2" /> },
];

const FREQUENCIES = [
  { value: "daily", label: "Daily Task" },
  { value: "weekly", label: "Weekly Task" },
  { value: "as-needed", label: "As Needed" },
];

export default function Hurdles() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hurdles, setHurdles] = useState<Hurdle[]>([
    {
      id: "1",
      title: "Time Management Issues",
      category: "practical",
      deadline: format(addDays(new Date(), 14), "yyyy-MM-dd"),
      solutions: [
        {
          id: "1-1",
          text: "Use Pomodoro Technique",
          isCompleted: true,
          frequency: "daily",
        },
        {
          id: "1-2",
          text: "Weekly planning session",
          isCompleted: false,
          frequency: "weekly",
        },
      ],
    },
    {
      id: "2",
      title: "Imposter Syndrome",
      category: "mental",
      solutions: [
        {
          id: "2-1",
          text: "Journal accomplishments",
          isCompleted: false,
          frequency: "daily",
        },
        {
          id: "2-2",
          text: "Speak with mentor",
          isCompleted: false,
          frequency: "weekly",
        },
      ],
    },
  ]);
  const [newHurdleTitle, setNewHurdleTitle] = useState("");
  const [newHurdleCategory, setNewHurdleCategory] = useState("mental");
  const [newHurdleDeadline, setNewHurdleDeadline] = useState<string>("");
  const [showNewHurdleDialog, setShowNewHurdleDialog] = useState(false);
  const [activeHurdle, setActiveHurdle] = useState<Hurdle | null>(null);
  const [newSolutionText, setNewSolutionText] = useState("");
  const [newSolutionFrequency, setNewSolutionFrequency] = useState("daily");
  const [filter, setFilter] = useState<string | null>(null);
  
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data;
    }
  });

  // In a real app, we would load hurdles from Supabase here
  // For now, we'll use the mock data

  const addHurdle = () => {
    if (!newHurdleTitle.trim()) return;

    const newHurdle: Hurdle = {
      id: Date.now().toString(),
      title: newHurdleTitle,
      category: newHurdleCategory,
      deadline: newHurdleDeadline || undefined,
      solutions: [],
    };

    setHurdles([...hurdles, newHurdle]);
    setNewHurdleTitle("");
    setNewHurdleCategory("mental");
    setNewHurdleDeadline("");
    setShowNewHurdleDialog(false);
    toast({
      title: "Challenge Added",
      description: "Your new challenge has been created.",
    });
  };

  const addSolution = (hurdleId: string) => {
    if (!newSolutionText.trim()) return;
    
    setHurdles(
      hurdles.map((hurdle) => {
        if (hurdle.id === hurdleId) {
          return {
            ...hurdle,
            solutions: [
              ...hurdle.solutions,
              {
                id: Date.now().toString(),
                text: newSolutionText,
                isCompleted: false,
                frequency: newSolutionFrequency as "daily" | "weekly" | "as-needed",
              },
            ],
          };
        }
        return hurdle;
      })
    );
    
    setNewSolutionText("");
    setNewSolutionFrequency("daily");
    toast({
      title: "Step Added",
      description: "A new step has been added to overcome this challenge.",
    });
  };

  const toggleSolution = (hurdleId: string, solutionId: string) => {
    setHurdles(
      hurdles.map((hurdle) => {
        if (hurdle.id === hurdleId) {
          return {
            ...hurdle,
            solutions: hurdle.solutions.map((solution) => {
              if (solution.id === solutionId) {
                return { ...solution, isCompleted: !solution.isCompleted };
              }
              return solution;
            }),
          };
        }
        return hurdle;
      })
    );
  };

  const deleteHurdle = (hurdleId: string) => {
    setHurdles(hurdles.filter((hurdle) => hurdle.id !== hurdleId));
    toast({
      title: "Challenge Removed",
      description: "The challenge has been deleted.",
      variant: "destructive",
    });
  };
  
  const deleteSolution = (hurdleId: string, solutionId: string) => {
    setHurdles(
      hurdles.map((hurdle) => {
        if (hurdle.id === hurdleId) {
          return {
            ...hurdle,
            solutions: hurdle.solutions.filter(s => s.id !== solutionId),
          };
        }
        return hurdle;
      })
    );
  };

  const calculateProgress = (hurdle: Hurdle) => {
    if (hurdle.solutions.length === 0) return 0;
    const completed = hurdle.solutions.filter((s) => s.isCompleted).length;
    return Math.round((completed / hurdle.solutions.length) * 100);
  };
  
  const filteredHurdles = filter
    ? hurdles.filter(hurdle => hurdle.category === filter)
    : hurdles;
  
  const completedHurdles = filteredHurdles.filter(hurdle => 
    hurdle.solutions.length > 0 && 
    hurdle.solutions.every(s => s.isCompleted)
  );
  
  const inProgressHurdles = filteredHurdles.filter(hurdle => 
    hurdle.solutions.length > 0 && 
    hurdle.solutions.some(s => s.isCompleted) &&
    !hurdle.solutions.every(s => s.isCompleted)
  );
  
  const notStartedHurdles = filteredHurdles.filter(hurdle => 
    hurdle.solutions.length === 0 || 
    hurdle.solutions.every(s => !s.isCompleted)
  );

  return (
    <PageContainer>
      <div className="space-y-5 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/home")}
              className="rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Mental Resilience</h1>
          </div>
          <Button
            size="sm"
            onClick={() => setShowNewHurdleDialog(true)}
            className="text-white bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Challenge
          </Button>
        </div>

        <Card className="border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2">
            <Button
              variant={filter === null ? "secondary" : "outline"}
              size="sm"
              onClick={() => setFilter(null)}
              className="whitespace-nowrap"
            >
              All Challenges
            </Button>
            {CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant={filter === category.value ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFilter(category.value)}
                className="whitespace-nowrap flex items-center"
              >
                {category.icon}
                {category.label}
              </Button>
            ))}
          </div>
          
          <div className="text-sm text-gray-500 mt-2 mb-4">
            Tracking {filteredHurdles.length} challenges: {completedHurdles.length} completed, 
            {inProgressHurdles.length} in progress, {notStartedHurdles.length} not started
          </div>
        </Card>

        <div className="space-y-4">
          {inProgressHurdles.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-medium text-gray-800 px-1">In Progress</h2>
              {inProgressHurdles.map((hurdle) => (
                <HurdleCard 
                  key={hurdle.id} 
                  hurdle={hurdle} 
                  onToggleSolution={toggleSolution}
                  onDelete={deleteHurdle}
                  onView={() => setActiveHurdle(hurdle)}
                  onDeleteSolution={deleteSolution}
                />
              ))}
            </div>
          )}
          
          {notStartedHurdles.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-medium text-gray-800 px-1">Not Started</h2>
              {notStartedHurdles.map((hurdle) => (
                <HurdleCard 
                  key={hurdle.id} 
                  hurdle={hurdle} 
                  onToggleSolution={toggleSolution}
                  onDelete={deleteHurdle}
                  onView={() => setActiveHurdle(hurdle)}
                  onDeleteSolution={deleteSolution}
                />
              ))}
            </div>
          )}
          
          {completedHurdles.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-medium text-gray-800 px-1">Completed</h2>
              {completedHurdles.map((hurdle) => (
                <HurdleCard 
                  key={hurdle.id} 
                  hurdle={hurdle} 
                  onToggleSolution={toggleSolution}
                  onDelete={deleteHurdle}
                  onView={() => setActiveHurdle(hurdle)}
                  onDeleteSolution={deleteSolution}
                />
              ))}
            </div>
          )}
          
          {filteredHurdles.length === 0 && (
            <Card className="p-8 text-center space-y-4 border border-gray-100">
              <div className="bg-orange-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Challenges Found</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  {filter 
                    ? `You don't have any ${CATEGORIES.find(c => c.value === filter)?.label.toLowerCase()} challenges yet.` 
                    : "Start tracking the challenges that stand between you and your goals."}
                </p>
              </div>
              <Button 
                onClick={() => setShowNewHurdleDialog(true)} 
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Your First Challenge
              </Button>
            </Card>
          )}
        </div>
      </div>
      
      {/* New Hurdle Dialog */}
      <Dialog open={showNewHurdleDialog} onOpenChange={setShowNewHurdleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Challenge</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Challenge Description</label>
              <Input
                value={newHurdleTitle}
                onChange={(e) => setNewHurdleTitle(e.target.value)}
                placeholder="What's holding you back?"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={newHurdleCategory} onValueChange={setNewHurdleCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center">
                        {category.icon}
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Completion Date (Optional)</label>
              <Input
                type="date"
                value={newHurdleDeadline}
                onChange={(e) => setNewHurdleDeadline(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={addHurdle} className="bg-orange-500 hover:bg-orange-600">Add Challenge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hurdle Detail Dialog */}
      <Dialog open={!!activeHurdle} onOpenChange={(open) => !open && setActiveHurdle(null)}>
        {activeHurdle && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                {activeHurdle.category && (
                  <Badge className="bg-gray-100 text-gray-700 border-0">
                    {CATEGORIES.find(c => c.value === activeHurdle.category)?.label}
                  </Badge>
                )}
                {activeHurdle.deadline && (
                  <Badge className="bg-blue-50 text-blue-700 border-0">
                    Due {format(new Date(activeHurdle.deadline), "MMM d, yyyy")}
                  </Badge>
                )}
              </div>
              <DialogTitle>{activeHurdle.title}</DialogTitle>
            </DialogHeader>
            
            <div className="py-3">
              <Progress value={calculateProgress(activeHurdle)} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{calculateProgress(activeHurdle)}% complete</span>
                <span>{activeHurdle.solutions.filter(s => s.isCompleted).length}/{activeHurdle.solutions.length} steps</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4 py-2">
              <h3 className="text-sm font-medium">Action Steps</h3>
              
              {activeHurdle.solutions.length === 0 ? (
                <div className="text-sm text-gray-500 italic">
                  No steps added yet. Add steps to overcome this challenge.
                </div>
              ) : (
                <div className="space-y-2">
                  {activeHurdle.solutions.map((solution) => (
                    <div 
                      key={solution.id} 
                      className="flex items-start justify-between p-3 border border-gray-100 rounded-md"
                    >
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => toggleSolution(activeHurdle.id, solution.id)}
                          className={`mt-0.5 flex-shrink-0 ${solution.isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <div>
                          <p className={`text-sm ${solution.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {solution.text}
                          </p>
                          <Badge 
                            variant="outline" 
                            className="mt-1 text-xs px-1.5 py-0"
                          >
                            {FREQUENCIES.find(f => f.value === solution.frequency)?.label}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteSolution(activeHurdle.id, solution.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-medium">Add New Step</h3>
                <Textarea
                  value={newSolutionText}
                  onChange={(e) => setNewSolutionText(e.target.value)}
                  placeholder="What can you do to overcome this challenge?"
                  className="min-h-[80px]"
                />
                <div className="flex justify-between items-center">
                  <Select value={newSolutionFrequency} onValueChange={setNewSolutionFrequency}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCIES.map(freq => (
                        <SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => addSolution(activeHurdle.id)} 
                    disabled={!newSolutionText.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Add Step
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => {
                  deleteHurdle(activeHurdle.id);
                  setActiveHurdle(null);
                }}
                className="mr-auto"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete Challenge
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </PageContainer>
  );
}

interface HurdleCardProps {
  hurdle: Hurdle;
  onToggleSolution: (hurdleId: string, solutionId: string) => void;
  onDelete: (hurdleId: string) => void;
  onView: () => void;
  onDeleteSolution: (hurdleId: string, solutionId: string) => void;
}

function HurdleCard({ hurdle, onToggleSolution, onDelete, onView, onDeleteSolution }: HurdleCardProps) {
  const progress = calculateProgress(hurdle);
  const allCompleted = hurdle.solutions.length > 0 && hurdle.solutions.every(s => s.isCompleted);
  
  const getCategoryIcon = () => {
    switch (hurdle.category) {
      case "mental": return <BrainCircuit className="w-5 h-5 text-purple-500" />;
      case "practical": return <Shield className="w-5 h-5 text-blue-500" />;
      case "emotional": return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default: return <AlertCircle className="w-5 h-5 text-orange-500" />;
    }
  };
  
  return (
    <Card className={`border border-gray-100 shadow-sm ${allCompleted ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            {getCategoryIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className={`font-medium text-gray-900 ${allCompleted ? 'line-through text-gray-500' : ''}`}>
                  {hurdle.title}
                </h3>
                {hurdle.deadline && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    Target: {format(new Date(hurdle.deadline), "MMM d, yyyy")}
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <Badge 
                  variant={allCompleted ? "outline" : "secondary"} 
                  className={`${allCompleted ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-none'}`}
                >
                  {allCompleted ? 'Completed' : `${progress}%`}
                </Badge>
              </div>
            </div>

            {hurdle.solutions.length > 0 && (
              <div className="mt-3">
                <Progress value={progress} className="h-1.5" />
              </div>
            )}

            <div className="mt-3 space-y-2">
              {hurdle.solutions.slice(0, 3).map((solution) => (
                <div
                  key={solution.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleSolution(hurdle.id, solution.id)}
                    className={`h-6 w-6 p-0 rounded-full ${
                      solution.isCompleted
                        ? "text-green-500"
                        : "text-gray-300 hover:text-gray-400"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <span
                    className={`flex-1 ${
                      solution.isCompleted
                        ? "line-through text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {solution.text}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {solution.frequency}
                  </span>
                </div>
              ))}
              {hurdle.solutions.length > 3 && (
                <div className="text-xs text-gray-500 ml-8">
                  +{hurdle.solutions.length - 3} more steps
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(hurdle.id)}
                className="text-xs text-red-500 border-red-100 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onView}
                className="text-xs"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function calculateProgress(hurdle: Hurdle) {
  if (hurdle.solutions.length === 0) return 0;
  const completed = hurdle.solutions.filter((s) => s.isCompleted).length;
  return Math.round((completed / hurdle.solutions.length) * 100);
}
