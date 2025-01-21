import { Trophy, Star, Clock } from "lucide-react";

export function StreakCard() {
  return (
    <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/30 via-secondary/40 to-primary/30 backdrop-blur-sm border border-amber-500/40 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/40 blur-xl rounded-full" />
            <div className="relative p-2 bg-gradient-to-br from-amber-500/50 to-secondary/50 rounded-xl backdrop-blur-sm">
              <Trophy className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Current Streak</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-black relative">7</span>
              <span className="text-xs text-gray-700 dark:text-gray-300">days</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-700 dark:text-gray-300 mt-4 flex items-center gap-1 justify-center">
        <Clock className="w-3 h-3" />
        Next stand-up: Tomorrow, 9:30
      </p>
    </div>
  );
}