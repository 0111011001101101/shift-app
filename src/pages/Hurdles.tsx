import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Solution {
  id: string;
  text: string;
  isCompleted: boolean;
  frequency: "daily" | "weekly";
}

interface Hurdle {
  id: string;
  title: string;
  solutions: Solution[];
}

export default function Hurdles() {
  const { toast } = useToast();
  const [hurdles, setHurdles] = useState<Hurdle[]>([
    {
      id: "1",
      title: "Time Management Issues",
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
  ]);
  const [newHurdleTitle, setNewHurdleTitle] = useState("");
  const [showNewHurdleInput, setShowNewHurdleInput] = useState(false);

  const addHurdle = () => {
    if (!newHurdleTitle.trim()) return;

    const newHurdle: Hurdle = {
      id: Date.now().toString(),
      title: newHurdleTitle,
      solutions: [],
    };

    setHurdles([...hurdles, newHurdle]);
    setNewHurdleTitle("");
    setShowNewHurdleInput(false);
    toast({
      title: "Hurdle Added",
      description: "Your new hurdle has been created.",
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
      title: "Hurdle Deleted",
      description: "The hurdle has been removed.",
      variant: "destructive",
    });
  };

  const moveHurdle = (hurdleId: string, direction: "up" | "down") => {
    const index = hurdles.findIndex((hurdle) => hurdle.id === hurdleId);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === hurdles.length - 1)
    )
      return;

    const newHurdles = [...hurdles];
    const temp = newHurdles[index];
    newHurdles[index] = newHurdles[index + (direction === "up" ? -1 : 1)];
    newHurdles[index + (direction === "up" ? -1 : 1)] = temp;
    setHurdles(newHurdles);
  };

  const calculateProgress = (hurdle: Hurdle) => {
    if (hurdle.solutions.length === 0) return 0;
    const completed = hurdle.solutions.filter((s) => s.isCompleted).length;
    return Math.round((completed / hurdle.solutions.length) * 100);
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Hurdles</h1>
        <Button
          size="sm"
          onClick={() => setShowNewHurdleInput(true)}
          className="text-xs"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Hurdle
        </Button>
      </div>

      {showNewHurdleInput && (
        <Card className="p-4 mb-4">
          <div className="flex gap-2">
            <Input
              value={newHurdleTitle}
              onChange={(e) => setNewHurdleTitle(e.target.value)}
              placeholder="Enter hurdle description..."
              className="flex-1"
            />
            <Button onClick={addHurdle} size="sm">
              Add
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {hurdles.map((hurdle, index) => (
          <Card key={hurdle.id} className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-gray-900">{hurdle.title}</h3>
                  <div className="flex items-center gap-1">
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveHurdle(hurdle.id, "up")}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    )}
                    {index < hurdles.length - 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveHurdle(hurdle.id, "down")}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHurdle(hurdle.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {hurdle.solutions.length > 0 && (
                  <div className="mt-3">
                    <Progress value={calculateProgress(hurdle)} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {calculateProgress(hurdle)}% complete
                    </p>
                  </div>
                )}

                <div className="mt-3 space-y-2">
                  {hurdle.solutions.map((solution) => (
                    <div
                      key={solution.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSolution(hurdle.id, solution.id)}
                        className={`h-8 w-8 p-0 ${
                          solution.isCompleted
                            ? "text-success"
                            : "text-muted-foreground"
                        }`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <span
                        className={`flex-1 ${
                          solution.isCompleted
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {solution.text}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {solution.frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}