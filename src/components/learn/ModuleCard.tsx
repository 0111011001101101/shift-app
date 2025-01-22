import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  progress: number;
  featured?: boolean;
}

export function ModuleCard({ 
  id, 
  title, 
  description, 
  estimatedMinutes, 
  progress,
  featured = false 
}: ModuleCardProps) {
  if (featured) {
    return (
      <Link to={`/learn/${id}`} className="block">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/20 via-[#7E69AB]/20 to-[#D6BCFA]/20 backdrop-blur-sm" />
          <div className="relative p-6 sm:p-8 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium mb-4">
              <Zap className="w-3 h-3" />
              Featured
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
            <p className="text-white/80 mb-6">{description}</p>
            <div className="flex items-center gap-4 text-sm mb-6">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 opacity-80" />
                {estimatedMinutes} mins
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 opacity-80" />
                5 lessons
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-2 rounded-full bg-white/20">
                <div 
                  className="h-full rounded-full bg-white transition-all duration-500" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <button className="w-full py-3 px-6 rounded-xl bg-white text-[#7E69AB] font-medium hover:bg-white/90 transition-colors">
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/learn/${id}`}>
      <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-[#D6BCFA]/20 hover:border-[#9b87f5]/30">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/5 to-[#7E69AB]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative p-6">
          <div className="flex gap-4">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#9b87f5]/10 text-[#9b87f5] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                  <span className="text-[#9b87f5] font-semibold">{progress}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-1.5 bg-[#9b87f5]/10"
                  indicatorClassName="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]"
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 flex items-center text-[#9b87f5] opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <span className="text-sm font-medium mr-2">Start Learning</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Card>
    </Link>
  );
}