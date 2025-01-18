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
      <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-100/50 dark:border-gray-700/50">
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-2">
                {title}
              </h3>
              <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{estimatedMinutes}m</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-1.5 bg-gray-100 dark:bg-gray-700"
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}