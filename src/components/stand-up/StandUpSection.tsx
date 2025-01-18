import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Plus, Minus } from "lucide-react";
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

  const handleBulletPointChange = (id: string, text: string, isSolution = false) => {
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

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-medium">{title}</h2>
          {required && <span className="text-destructive">*</span>}
        </div>
        <div className="flex gap-2">
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
        </div>
      </div>

      <div className="space-y-4">
        {bulletPoints.map((point) => (
          <div key={point.id} className="space-y-2">
            <p className="text-sm text-muted-foreground ml-1">
              {placeholder}
            </p>
            <div className="flex gap-2">
              <Input
                value={point.text}
                onChange={(e) => handleBulletPointChange(point.id, e.target.value)}
                className="flex-1"
                required={required && bulletPoints.indexOf(point) === 0}
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
              <>
                <p className="text-sm text-muted-foreground ml-6">Solution</p>
                <Input
                  value={point.solution}
                  onChange={(e) => handleBulletPointChange(point.id, e.target.value, true)}
                  className="ml-6"
                  required={required && bulletPoints.indexOf(point) === 0}
                />
              </>
            )}
          </div>
        ))}
      </div>

      {templates && templates.length > 0 && (
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