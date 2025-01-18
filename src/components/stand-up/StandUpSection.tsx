import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StandUpSectionProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  templates?: string[];
}

export function StandUpSection({
  icon,
  title,
  value,
  onChange,
  placeholder,
  templates,
}: StandUpSectionProps) {
  const { toast } = useToast();

  const handleTemplateClick = (template: string) => {
    onChange(template);
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
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleVoiceRecording}
        >
          <Mic className="w-4 h-4" />
        </Button>
      </div>
      {templates && templates.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {templates.map((template, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleTemplateClick(template)}
              className="text-xs"
            >
              {template}
            </Button>
          ))}
        </div>
      )}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px]"
      />
    </Card>
  );
}