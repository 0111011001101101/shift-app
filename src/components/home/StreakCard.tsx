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
    <div className="relative p-6 rounded-3xl bg-white border border-black/[0.08] shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 bg-black/[0.02] backdrop-blur-xl rounded-2xl group-hover:scale-110 transition-transform duration-500">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            {streak > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <Star className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-black/70">Current Streak</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-black">{streak}</span>
              <span className="text-xs text-black/60">days</span>
            </div>
          </div>
        </div>
        <Star className="w-5 h-5 text-black/40 animate-pulse" />
      </div>
      
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs text-black/70 flex items-center gap-1.5 justify-center bg-black/[0.02] py-2.5 px-4 rounded-xl backdrop-blur-xl border border-black/[0.08]">
          <Clock className="w-3.5 h-3.5 text-black/60" />
          Next stand-up: Tomorrow, {formattedTime}
        </p>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs hover:bg-black/[0.02] flex items-center gap-2 justify-center group/btn backdrop-blur-xl active:scale-95 transition-all duration-200 text-black/70"
          onClick={() => navigate("/settings")}
        >
          <Calendar className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform text-black/60" />
          <span className="group-hover/btn:translate-x-0.5 transition-transform">Change stand-up time</span>
        </Button>
      </div>
    </div>
  );
}