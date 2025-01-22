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
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
              <Trophy className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Streak</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-primary-600 dark:text-primary-400">{streak}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">days</span>
              </div>
            </div>
          </div>
          <Star className="w-5 h-5 text-primary-400 animate-pulse opacity-75" />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5 justify-center bg-gray-50 dark:bg-gray-900/50 py-2 px-3 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            Next stand-up: Tomorrow, {formattedTime}
          </p>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs hover:bg-primary-50 dark:hover:bg-primary-900/30 flex items-center gap-2 justify-center"
            onClick={() => navigate("/settings")}
          >
            <Calendar className="w-3.5 h-3.5" />
            Change stand-up time
          </Button>
        </div>
      </div>
    </div>
  );
}