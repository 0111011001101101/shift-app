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
    <div className="relative p-6 rounded-3xl bg-gradient-to-br from-primary-500/10 via-primary-400/5 to-accent/5 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group backdrop-blur-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-primary-100/20 to-transparent rounded-3xl opacity-60" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-primary-100/80 to-primary-50/60 backdrop-blur-xl rounded-2xl group-hover:scale-110 transition-transform duration-500">
              <Trophy className="w-6 h-6 text-primary-600" />
            </div>
            {streak > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <Star className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-secondary-700/90">Current Streak</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black bg-gradient-to-br from-primary-600 to-primary-700 bg-clip-text text-transparent">{streak}</span>
              <span className="text-xs text-secondary-600/90">days</span>
            </div>
          </div>
        </div>
        <Star className="w-5 h-5 text-accent animate-pulse opacity-75" />
      </div>
      
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs text-secondary-700/90 flex items-center gap-1.5 justify-center bg-gradient-to-r from-white/60 to-primary-50/40 py-2.5 px-4 rounded-xl backdrop-blur-xl border border-white/20">
          <Clock className="w-3.5 h-3.5 text-primary-600" />
          Next stand-up: Tomorrow, {formattedTime}
        </p>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs hover:bg-white/40 flex items-center gap-2 justify-center group/btn backdrop-blur-xl active:scale-95 transition-all duration-200 text-secondary-700/90"
          onClick={() => navigate("/settings")}
        >
          <Calendar className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform text-primary-600" />
          <span className="group-hover/btn:translate-x-0.5 transition-transform">Change stand-up time</span>
        </Button>
      </div>
    </div>
  );
}