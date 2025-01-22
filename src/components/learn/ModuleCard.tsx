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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative p-6">
          <div className="flex gap-4">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 leading-tight break-words">
                  {title}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">{estimatedMinutes}m</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Progress</span>
                  <span className="text-primary font-semibold">{progress}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-1.5 bg-primary/10"
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 flex items-center text-primary opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <span className="text-sm font-medium mr-2">Start Learning</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Card>
    </Link>
  );
}