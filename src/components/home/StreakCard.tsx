import { Button } from "@/components/ui/button";
import { Trophy, Star, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
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
    <div className="relative p-3 rounded-2xl bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA] border border-accent-200/30 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="p-2 bg-accent rounded-xl group-hover:scale-110 transition-transform duration-500">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            {streak > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full flex items-center justify-center animate-pulse">
                <Star className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-accent-700/90">Current Streak</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-accent-600">
                {streak}
              </span>
              <span className="text-xs text-accent-600/80">days</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <p className="text-xs text-accent-700/80 flex items-center gap-1.5 bg-white/60 backdrop-blur-sm py-1.5 px-2 rounded-lg border border-accent-100/20">
            <Clock className="w-3 h-3 text-accent-500/80" />
            {formattedTime}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 hover:bg-white/60 backdrop-blur-sm"
            onClick={() => navigate("/settings")}
          >
            <Calendar className="w-3 h-3 text-accent-500/80" />
          </Button>
        </div>
      </div>
    </div>
  );
}