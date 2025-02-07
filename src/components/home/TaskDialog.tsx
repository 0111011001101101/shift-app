
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Star } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  deadline?: string | null;
}

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { 
    title: string; 
    goalId: string | null; 
    dueDate: Date | null;
    category: string;
    importance: number;
    notes: string;
  }) => void;
  goals?: Goal[];
  initialData?: {
    title: string;
    goalId: string | null;
    dueDate: Date | null;
    category?: string;
    importance?: number;
    notes?: string;
  };
  mode: "add" | "edit";
}

const CATEGORIES = [
  "Personal",
  "Work",
  "Health",
  "Family",
  "Learning",
  "Other"
];

export function TaskDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  goals = [],
  initialData,
  mode,
}: TaskDialogProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(initialData?.goalId || null);
  const [dueDate, setDueDate] = useState<Date | null>(initialData?.dueDate || null);
  const [category, setCategory] = useState(initialData?.category || "Personal");
  const [importance, setImportance] = useState(initialData?.importance || 1);
  const [notes, setNotes] = useState(initialData?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      goalId: selectedGoalId,
      dueDate,
      category,
      importance,
      notes,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 rounded-2xl bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-violet-900">
            {mode === "add" ? "Add New Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-violet-900">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="border-violet-100 focus:border-violet-300 bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-violet-900">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger className="border-violet-100 focus:border-violet-300 bg-white/50">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-violet-900">Importance</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant="outline"
                  onClick={() => setImportance(level)}
                  className={cn(
                    "flex-1 border-violet-100 bg-white/50",
                    importance >= level ? "text-yellow-500" : "text-gray-400"
                  )}
                >
                  <Star className="w-4 h-4" fill={importance >= level ? "currentColor" : "none"} />
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-violet-900">Link to Goal</Label>
            <Select
              value={selectedGoalId || undefined}
              onValueChange={(value) => setSelectedGoalId(value)}
            >
              <SelectTrigger className="border-violet-100 focus:border-violet-300 bg-white/50">
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Goal</SelectItem>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-violet-900">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-violet-100 focus:border-violet-300 bg-white/50",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-violet-900">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              className="border-violet-100 focus:border-violet-300 bg-white/50 min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-violet-200 text-violet-700 hover:bg-violet-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {mode === "add" ? "Add Task" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
