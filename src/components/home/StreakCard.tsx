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
    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#FEC6A1] border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => navigate("/stand-up")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform duration-500">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            {streak > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center animate-pulse">
                <Star className="w-2.5 h-2.5 text-[#F97316]" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-white/90">Current Streak</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">
                {streak}
              </span>
              <span className="text-sm text-white/80">days</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 hover:bg-white/10 backdrop-blur-sm text-white flex items-center gap-1.5 group"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/settings");
            }}
          >
            <Clock className="w-3.5 h-3.5 text-white/80 group-hover:scale-110 transition-transform" />
            <span className="text-xs">{formattedTime}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 hover:bg-white/10 backdrop-blur-sm p-0"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/settings");
            }}
          >
            <Calendar className="w-3.5 h-3.5 text-white/80" />
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}