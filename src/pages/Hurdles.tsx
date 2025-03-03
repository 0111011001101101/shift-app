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
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Shield,
  BrainCircuit,
  CheckSquare,
  Square
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
  { value: "mental", label: "Mental", icon: <BrainCircuit className="w-4 h-4 mr-1" /> },
  { value: "practical", label: "Practical", icon: <Shield className="w-4 h-4 mr-1" /> },
  { value: "emotional", label: "Emotional", icon: <AlertCircle className="w-4 h-4 mr-1" /> },
];

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
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
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 pb-20"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/home")}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Challenges</h1>
          </div>
          <Button
            size="sm"
            onClick={() => setShowNewHurdleDialog(true)}
            className="rounded-lg bg-primary hover:bg-primary-600"
          >
            <Plus className="w-4 h-4 mr-1" /> New
          </Button>
        </div>

        <Card className="overflow-hidden shadow-sm rounded-xl border-0">
          <Tabs defaultValue={filter || "all"} className="w-full">
            <TabsList className="w-full grid grid-cols-4 rounded-none bg-gray-50 p-0 h-auto">
              <TabsTrigger 
                value="all" 
                onClick={() => setFilter(null)}
                className="rounded-none py-3 data-[state=active]:bg-white data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                All
              </TabsTrigger>
              {CATEGORIES.map(category => (
                <TabsTrigger 
                  key={category.value}
                  value={category.value}
                  onClick={() => setFilter(category.value)}
                  className="rounded-none py-3 data-[state=active]:bg-white data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary text-xs"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </Card>
        
        <AnimatePresence>
          {inProgressHurdles.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-gray-600 flex items-center">
                <Badge className="mr-2 bg-orange-500 text-white font-normal py-0">In Progress</Badge>
              </h2>
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
              <h2 className="text-sm font-medium text-gray-600 flex items-center">
                <Badge className="mr-2 bg-gray-400 text-white font-normal py-0">Not Started</Badge>
              </h2>
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
              <h2 className="text-sm font-medium text-gray-600 flex items-center">
                <Badge className="mr-2 bg-green-500 text-white font-normal py-0">Completed</Badge>
              </h2>
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="py-8 px-4 text-center space-y-4 border-0 rounded-xl bg-gray-50">
                <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <Shield className="w-8 h-8 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No challenges found</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    {filter 
                      ? `You don't have any ${CATEGORIES.find(c => c.value === filter)?.label.toLowerCase()} challenges yet.` 
                      : "Start tracking the challenges that stand between you and your goals."}
                  </p>
                </div>
                <Button 
                  onClick={() => setShowNewHurdleDialog(true)} 
                  className="mt-2 bg-primary hover:bg-primary-600"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Challenge
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* New Hurdle Dialog */}
      <Dialog open={showNewHurdleDialog} onOpenChange={setShowNewHurdleDialog}>
        <DialogContent className="sm:max-w-md rounded-lg border-0 shadow-lg">
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
                className="rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={newHurdleCategory} onValueChange={setNewHurdleCategory}>
                <SelectTrigger className="rounded-lg">
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
              <label className="text-sm font-medium">Target Date (Optional)</label>
              <Input
                type="date"
                value={newHurdleDeadline}
                onChange={(e) => setNewHurdleDeadline(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
                className="rounded-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="rounded-lg">Cancel</Button>
            </DialogClose>
            <Button onClick={addHurdle} className="rounded-lg bg-primary hover:bg-primary-600">Add Challenge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hurdle Detail Dialog */}
      <Dialog open={!!activeHurdle} onOpenChange={(open) => !open && setActiveHurdle(null)}>
        {activeHurdle && (
          <DialogContent className="sm:max-w-md rounded-lg border-0 shadow-lg p-0 overflow-hidden">
            <div className="bg-gray-50 p-4">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  {activeHurdle.category && (
                    <Badge className="bg-white text-gray-700 font-normal">
                      {CATEGORIES.find(c => c.value === activeHurdle.category)?.label}
                    </Badge>
                  )}
                  {activeHurdle.deadline && (
                    <Badge className="bg-white text-gray-700 font-normal">
                      Due {format(new Date(activeHurdle.deadline), "MMM d")}
                    </Badge>
                  )}
                </div>
                <DialogTitle>{activeHurdle.title}</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                <Progress value={calculateProgress(activeHurdle)} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{calculateProgress(activeHurdle)}% complete</span>
                  <span>{activeHurdle.solutions.filter(s => s.isCompleted).length}/{activeHurdle.solutions.length} steps</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Action Steps</h3>
              
              {activeHurdle.solutions.length === 0 ? (
                <div className="text-sm text-gray-500 italic">
                  No steps added yet. Add steps to overcome this challenge.
                </div>
              ) : (
                <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                  {activeHurdle.solutions.map((solution) => (
                    <div 
                      key={solution.id} 
                      className="flex items-start justify-between p-3 border border-gray-100 rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => toggleSolution(activeHurdle.id, solution.id)}
                          className={`mt-0.5 flex-shrink-0 ${solution.isCompleted ? 'text-green-500' : 'text-gray-300'}`}
                        >
                          {solution.isCompleted ? 
                            <CheckSquare className="h-5 w-5" /> : 
                            <Square className="h-5 w-5" />
                          }
                        </button>
                        <div>
                          <p className={`text-sm ${solution.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {solution.text}
                          </p>
                          <Badge 
                            variant="outline" 
                            className="mt-1 text-xs font-normal"
                          >
                            {FREQUENCIES.find(f => f.value === solution.frequency)?.label}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteSolution(activeHurdle.id, solution.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Add New Step</h3>
                <Textarea
                  value={newSolutionText}
                  onChange={(e) => setNewSolutionText(e.target.value)}
                  placeholder="What can you do to overcome this challenge?"
                  className="min-h-[80px] rounded-lg"
                />
                <div className="flex justify-between items-center mt-3">
                  <Select value={newSolutionFrequency} onValueChange={setNewSolutionFrequency}>
                    <SelectTrigger className="w-[130px] h-9 rounded-lg">
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
                    className="rounded-lg bg-primary hover:bg-primary-600"
                  >
                    Add Step
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  deleteHurdle(activeHurdle.id);
                  setActiveHurdle(null);
                }}
                className="text-red-500 border-red-200 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
              <DialogClose asChild>
                <Button variant="outline" className="rounded-lg">Close</Button>
              </DialogClose>
            </div>
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

function HurdleCard({ hurdle, onToggleSolution, onDelete, onView }: HurdleCardProps) {
  const progress = calculateProgress(hurdle);
  const allCompleted = hurdle.solutions.length > 0 && hurdle.solutions.every(s => s.isCompleted);
  
  return (
    <Card 
      className={`border-0 shadow-sm rounded-lg overflow-hidden`}
      onClick={onView}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {hurdle.category === 'mental' && <BrainCircuit className="w-4 h-4 text-purple-500" />}
            {hurdle.category === 'practical' && <Shield className="w-4 h-4 text-blue-500" />}
            {hurdle.category === 'emotional' && <AlertCircle className="w-4 h-4 text-orange-500" />}
            <h3 className={`font-medium text-gray-800 ${allCompleted ? 'line-through text-gray-400' : ''}`}>
              {hurdle.title}
            </h3>
          </div>
          {hurdle.deadline && (
            <div className="text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(hurdle.deadline), "MMM d")}
            </div>
          )}
        </div>

        {hurdle.solutions.length > 0 && (
          <>
            <Progress value={progress} className="h-1.5 my-2" />
            
            <div className="space-y-1 mt-3">
              {hurdle.solutions.slice(0, 2).map((solution) => (
                <div
                  key={solution.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className={`flex-shrink-0 ${
                      solution.isCompleted
                        ? "text-green-500"
                        : "text-gray-300"
                    }`}
                  >
                    {solution.isCompleted ? 
                      <CheckSquare className="h-4 w-4" /> : 
                      <Square className="h-4 w-4" />
                    }
                  </div>
                  <span
                    className={`flex-1 ${
                      solution.isCompleted
                        ? "line-through text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {solution.text}
                  </span>
                </div>
              ))}
              {hurdle.solutions.length > 2 && (
                <div className="text-xs text-gray-500 pl-6">
                  +{hurdle.solutions.length - 2} more steps
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

function calculateProgress(hurdle: Hurdle) {
  if (hurdle.solutions.length === 0) return 0;
  const completed = hurdle.solutions.filter((s) => s.isCompleted).length;
  return Math.round((completed / hurdle.solutions.length) * 100);
}
