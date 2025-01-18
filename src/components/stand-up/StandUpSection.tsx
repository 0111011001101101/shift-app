import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Plus, Minus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface BulletPoint {
  id: string;
  text: string;
  solution?: string;
}

interface StandUpSectionProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  templates?: string[];
  required?: boolean;
  allowMultiple?: boolean;
  requireSolution?: boolean;
}

export function StandUpSection({
  icon,
  title,
  value,
  onChange,
  placeholder,
  templates,
  required = true,
  allowMultiple = false,
  requireSolution = false,
}: StandUpSectionProps) {
  const { toast } = useToast();
  const [bulletPoints, setBulletPoints] = useState<BulletPoint[]>([
    { id: '1', text: '', solution: requireSolution ? '' : undefined }
  ]);
  const [noChallengesToday, setNoChallengesToday] = useState(false);

  const handleBulletPointChange = (id: string, text: string, isSolution = false) => {
    if (noChallengesToday) return;
    
    const updatedPoints = bulletPoints.map(point => {
      if (point.id === id) {
        return isSolution 
          ? { ...point, solution: text }
          : { ...point, text };
      }
      return point;
    });
    setBulletPoints(updatedPoints);
    
    const combinedText = updatedPoints
      .filter(point => point.text.trim() || (point.solution && point.solution.trim()))
      .map(point => point.solution 
        ? `• ${point.text}\n  → ${point.solution}`
        : `• ${point.text}`
      )
      .join('\n');
    onChange(combinedText);
  };

  const addBulletPoint = () => {
    if (noChallengesToday) return;
    
    setBulletPoints([
      ...bulletPoints,
      { 
        id: Date.now().toString(),
        text: '',
        solution: requireSolution ? '' : undefined
      }
    ]);
  };

  const removeBulletPoint = (id: string) => {
    if (noChallengesToday) return;
    
    if (bulletPoints.length > 1) {
      const updatedPoints = bulletPoints.filter(point => point.id !== id);
      setBulletPoints(updatedPoints);
      
      const combinedText = updatedPoints
        .filter(point => point.text.trim() || (point.solution && point.solution.trim()))
        .map(point => point.solution 
          ? `• ${point.text}\n  → ${point.solution}`
          : `• ${point.text}`
        )
        .join('\n');
      onChange(combinedText);
    }
  };

  const handleVoiceRecording = () => {
    toast({
      title: "Voice recording",
      description: "Voice recording feature coming soon!",
    });
  };

  const handleNoChallengesToday = () => {
    setNoChallengesToday(true);
    setBulletPoints([{ id: '1', text: '', solution: '' }]);
    onChange("No significant challenges expected today!");
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-medium">{title}</h2>
          {required && <span className="text-destructive">*</span>}
        </div>
        <div className="flex gap-2">
          {!noChallengesToday && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={addBulletPoint}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleVoiceRecording}
              >
                <Mic className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {requireSolution && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleNoChallengesToday}
          className="w-full text-xs sm:text-sm py-2 px-3 h-auto min-h-[36px] whitespace-normal text-left justify-start"
          disabled={noChallengesToday}
        >
          <Check className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>I'm ready for today - no significant challenges expected!</span>
        </Button>
      )}

      {!noChallengesToday && (
        <div className="space-y-4">
          {bulletPoints.map((point) => (
            <div key={point.id} className="space-y-2">
              <p className="text-sm text-muted-foreground ml-1">
                {placeholder}
              </p>
              <div className="flex gap-2">
                <Textarea
                  value={point.text}
                  onChange={(e) => handleBulletPointChange(point.id, e.target.value)}
                  className="flex-1 min-h-[80px] resize-y"
                  required={required && bulletPoints.indexOf(point) === 0}
                  disabled={noChallengesToday}
                />
                {bulletPoints.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBulletPoint(point.id)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {requireSolution && (
                <div className="ml-4 border-l-2 border-muted pl-4">
                  <p className="text-sm text-muted-foreground mb-2">Solution</p>
                  <Textarea
                    value={point.solution}
                    onChange={(e) => handleBulletPointChange(point.id, e.target.value, true)}
                    className="w-full min-h-[80px] resize-y"
                    required={required && bulletPoints.indexOf(point) === 0}
                    disabled={noChallengesToday}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {templates && templates.length > 0 && !noChallengesToday && (
        <div className="flex gap-2 flex-wrap">
          {templates.map((template, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => {
                if (bulletPoints.length === 1 && !bulletPoints[0].text) {
                  handleBulletPointChange(bulletPoints[0].id, template);
                } else {
                  setBulletPoints([
                    ...bulletPoints,
                    { id: Date.now().toString(), text: template, solution: requireSolution ? '' : undefined }
                  ]);
                }
              }}
              className="text-xs"
            >
              {template}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}