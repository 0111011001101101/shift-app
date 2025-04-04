
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Frown, Meh, SmilePlus, Smile, Heart } from "lucide-react";

interface MoodTrackerProps {
  value: number[];
  onChange: (value: number[]) => void;
}

export function MoodTracker({ value, onChange }: MoodTrackerProps) {
  const getMoodIcon = (score: number) => {
    const iconClass = "w-12 h-12 transition-all duration-300";
    if (score <= 3) return <Frown className={cn(iconClass, "text-destructive")} />;
    if (score <= 5) return <Meh className={cn(iconClass, "text-warning")} />;
    if (score <= 7) return <Smile className={cn(iconClass, "text-primary")} />;
    if (score <= 9) return <SmilePlus className={cn(iconClass, "text-success")} />;
    return <Heart className={cn(iconClass, "text-success")} />;
  };

  const getMoodLabel = (score: number) => {
    if (score <= 3) return "Struggling";
    if (score <= 5) return "Not Great";
    if (score <= 7) return "Okay";
    if (score <= 9) return "Good";
    return "Amazing";
  };

  return (
    <Card className="p-6 space-y-6 bg-white shadow-sm border border-gray-100">
      <div className="space-y-5">
        <h2 className="font-medium text-center text-gray-800">How are you feeling today?</h2>
        <div className="flex flex-col items-center gap-2">
          {getMoodIcon(value[0])}
          <p className="text-sm font-medium text-gray-700">{getMoodLabel(value[0])}</p>
        </div>
        <div className="px-2 pt-2">
          <Slider
            value={value}
            onValueChange={onChange}
            max={10}
            min={1}
            step={0.1}
            className={cn(
              "w-full",
              value[0] <= 3 ? "accent-destructive" :
              value[0] <= 5 ? "accent-warning" :
              value[0] <= 7 ? "accent-primary" :
              value[0] <= 9 ? "accent-success" :
              "accent-success"
            )}
          />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Not great</span>
            <span>Amazing</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
