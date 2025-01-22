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
    <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-primary/20 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 bg-secondary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Streak</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{streak}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">days</span>
            </div>
          </div>
        </div>
        <Star className="w-5 h-5 text-secondary animate-pulse" />
      </div>
      
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5 justify-center bg-gray-50 dark:bg-gray-900/50 py-2 px-3 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-primary" />
          Next stand-up: Tomorrow, {formattedTime}
        </p>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs hover:bg-primary/10 flex items-center gap-2 justify-center group"
          onClick={() => navigate("/settings")}
        >
          <Calendar className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-primary" />
          <span className="group-hover:translate-x-0.5 transition-transform">Change stand-up time</span>
        </Button>
      </div>
    </div>
  );
}