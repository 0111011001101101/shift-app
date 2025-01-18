import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MoodTrackerProps {
  value: number[];
  onChange: (value: number[]) => void;
}

export function MoodTracker({ value, onChange }: MoodTrackerProps) {
  const getMoodEmoji = (score: number) => {
    if (score <= 3) return "😔";
    if (score <= 5) return "😐";
    if (score <= 7) return "🙂";
    if (score <= 9) return "😊";
    return "🤩";
  };

  const getMoodLabel = (score: number) => {
    if (score <= 3) return "Struggling";
    if (score <= 5) return "Not Great";
    if (score <= 7) return "Okay";
    if (score <= 9) return "Good";
    return "Amazing";
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-4">
        <h2 className="font-medium">How are you feeling today?</h2>
        <div className="text-center mb-4">
          <span className="text-4xl">{getMoodEmoji(value[0])}</span>
          <p className="text-sm text-muted-foreground mt-2">{getMoodLabel(value[0])}</p>
        </div>
        <div className="px-2">
          <Slider
            value={value}
            onValueChange={onChange}
            max={10}
            min={1}
            step={0.1}
            className={cn(
              "w-full",
              value[0] <= 3 ? "accent-red-500" :
              value[0] <= 5 ? "accent-orange-500" :
              value[0] <= 7 ? "accent-yellow-500" :
              value[0] <= 9 ? "accent-green-500" :
              "accent-emerald-500"
            )}
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Not great</span>
            <span>Amazing</span>
          </div>
        </div>
      </div>
    </Card>
  );
}