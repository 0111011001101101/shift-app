import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  progress: number;
}

export function ModuleCard({ id, title, description, estimatedMinutes, progress }: ModuleCardProps) {
  return (
    <Link to={`/learn/${id}`}>
      <Card className="p-4 hover:bg-muted/50 transition-colors">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-lg">{title}</h3>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{estimatedMinutes}m</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="space-y-1">
            <Progress value={progress} className="h-1.5" />
            <p className="text-xs text-muted-foreground">{progress}% complete</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}