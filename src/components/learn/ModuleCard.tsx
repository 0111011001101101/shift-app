import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
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
      <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-gray-100/50 dark:border-gray-700/50">
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="space-y-2 flex-1 min-w-0"> {/* Added min-w-0 for text truncation */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 line-clamp-2">
                  {title}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground shrink-0 ml-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm whitespace-nowrap">{estimatedMinutes}m</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
                {description}
              </p>
            </div>
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

          <div className="flex items-center justify-end text-primary">
            <span className="text-sm font-medium mr-2 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              Start Learning
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
}