import { Trophy, Star, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StreakCard() {
  return (
    <Card className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30 border-0 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-primary-600/5 opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)] animate-pulse" />
      
      <div className="relative p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-secondary-400/30 blur-xl rounded-full animate-pulse" />
              <div className="relative p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Streak</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">7</span>
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </div>
          </div>
          <Star className="w-5 h-5 text-primary-400 animate-pulse opacity-75" />
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/50 dark:bg-gray-800/50 py-2 px-3 rounded-lg backdrop-blur-sm group-hover:bg-white/70 dark:group-hover:bg-gray-800/70 transition-colors">
          <Clock className="w-3.5 h-3.5" />
          <span>Next stand-up: Tomorrow, 9:30</span>
        </div>
      </div>
    </Card>
  );
}