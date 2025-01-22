import { Trophy, Star, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StreakCardProps {
  streak?: number;
  standUpTime?: string | null;
}

export function StreakCard({ streak = 0, standUpTime }: StreakCardProps) {
  const navigate = useNavigate();
  const formattedTime = standUpTime ? format(new Date(`2000-01-01T${standUpTime}`), 'h:mm a') : '9:30 AM';
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return (
    <div className="p-6 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-primary-600/5 opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)] animate-pulse" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-secondary-400/30 blur-xl rounded-full animate-pulse" />
            <div className="relative p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Streak</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">{streak}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">days</span>
            </div>
          </div>
        </div>
        <Star className="w-5 h-5 text-primary-400 animate-pulse opacity-75" />
      </div>
      
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5 justify-center bg-white/50 dark:bg-gray-800/50 py-2 px-3 rounded-lg backdrop-blur-sm group-hover:bg-white/70 dark:group-hover:bg-gray-800/70 transition-colors">
          <Clock className="w-3.5 h-3.5" />
          Next stand-up: Tomorrow, {formattedTime}
        </p>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs hover:bg-primary-500/10 flex items-center gap-2 justify-center"
          onClick={() => navigate("/settings")}
        >
          <Calendar className="w-3.5 h-3.5" />
          Change stand-up time
        </Button>
      </div>
    </div>
  );
}