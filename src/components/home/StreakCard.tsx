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
    <div className="p-6 rounded-xl bg-white border border-secondary-100/10 shadow-sm hover:shadow-md transition-all duration-300 group backdrop-blur-sm">
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 bg-primary-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-secondary-600">Current Streak</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">{streak}</span>
              <span className="text-xs text-secondary-500">days</span>
            </div>
          </div>
        </div>
        <Star className="w-5 h-5 text-accent animate-pulse opacity-75" />
      </div>
      
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs text-secondary-600 flex items-center gap-1.5 justify-center bg-secondary-50/50 py-2 px-3 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-primary-600" />
          Next stand-up: Tomorrow, {formattedTime}
        </p>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs hover:bg-primary-50 flex items-center gap-2 justify-center group/btn"
          onClick={() => navigate("/settings")}
        >
          <Calendar className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform text-primary-600" />
          <span className="group-hover/btn:translate-x-0.5 transition-transform">Change stand-up time</span>
        </Button>
      </div>
    </div>
  );
}