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
    <div className="relative p-4 rounded-2xl bg-white/90 border border-primary-100/30 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-lg">
      <div className="relative flex items-center gap-4">
        <div className="relative">
          <div className="p-2.5 bg-primary-50 rounded-xl group-hover:scale-110 transition-transform duration-500">
            <Trophy className="w-5 h-5 text-primary-600" />
          </div>
          {streak > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center animate-bounce">
              <Star className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-secondary-600">Current Streak</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
              {streak}
            </span>
            <span className="text-xs text-secondary-500">days</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex flex-col gap-2">
        <p className="text-xs text-secondary-600 flex items-center gap-1.5 justify-center bg-secondary-50/50 py-2 px-3 rounded-lg backdrop-blur-sm">
          <Clock className="w-3.5 h-3.5 text-secondary-400" />
          Next stand-up: Tomorrow, {formattedTime}
        </p>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs hover:bg-secondary-50/50 flex items-center gap-1.5 justify-center group/btn backdrop-blur-sm active:scale-95 transition-all duration-200 text-secondary-600"
          onClick={() => navigate("/settings")}
        >
          <Calendar className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform text-secondary-400" />
          <span className="group-hover/btn:translate-x-0.5 transition-transform">Change stand-up time</span>
        </Button>
      </div>
    </div>
  );
}