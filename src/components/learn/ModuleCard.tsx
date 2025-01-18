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
      <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-100/50 dark:border-gray-700/50">
        <div className="p-4 sm:p-6">
          <div className="flex gap-3 sm:gap-4">
            {/* Icon Container */}
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            {/* Content Container */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Title and Time */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 leading-tight break-words pr-2">
                  {title}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground shrink-0 bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded-full">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium whitespace-nowrap">{estimatedMinutes}m</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>

              {/* Progress Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Progress</span>
                  <span className="text-primary font-semibold">{progress}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-1.5 bg-gray-100 dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Action Indicator */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center text-primary">
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