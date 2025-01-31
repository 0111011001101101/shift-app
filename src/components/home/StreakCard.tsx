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
    <div className="relative p-3 rounded-xl bg-gradient-to-br from-primary-50 to-white border border-primary-100/30 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 bg-primary-500/10 rounded-lg group-hover:scale-110 transition-transform duration-500">
              <Trophy className="w-4 h-4 text-primary-600" />
            </div>
            {streak > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center animate-pulse">
                <Star className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-secondary-600">Current Streak</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary-600">
                {streak}
              </span>
              <span className="text-xs text-secondary-500">days</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <p className="text-xs text-secondary-600 flex items-center gap-1.5 bg-secondary-50/50 py-1.5 px-2 rounded-lg">
            <Clock className="w-3 h-3 text-secondary-400" />
            {formattedTime}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 hover:bg-secondary-50/50"
            onClick={() => navigate("/settings")}
          >
            <Calendar className="w-3 h-3 text-secondary-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}