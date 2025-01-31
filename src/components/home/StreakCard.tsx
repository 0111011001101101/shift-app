import { Button } from "@/components/ui/button";
import { Trophy, Star, Clock, Calendar, Brain, TrendingUp, Sparkles, Target, Flame, Heart } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StreakCardProps {
  streak?: number;
  standUpTime?: string | null;
}

export function StreakCard({ streak = 0, standUpTime }: StreakCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const formattedTime = standUpTime ? format(new Date(`2000-01-01T${standUpTime}`), 'h:mm a') : '9:30 AM';
  
  const { data: latestStandUp } = useQuery({
    queryKey: ["latestStandUp"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("stand_ups")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
        
      if (error) {
        console.error("Error fetching latest stand-up:", error);
        return null;
      }
      return data;
    },
  });

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥";
    if (streak >= 14) return "⚡️";
    if (streak >= 7) return "💫";
    return "✨";
  };

  const getWellbeingEmoji = (score: number) => {
    if (score >= 8) return "💪";
    if (score >= 6) return "✨";
    if (score >= 4) return "🌱";
    return "💗";
  };
  
  return (
    <div className="space-y-3">
      <div 
        className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#F97316] via-[#FB923C] to-[#FDBA74] shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden backdrop-blur-xl border border-white/10" 
        onClick={() => navigate("/stand-up")}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:translate-y-[-120px] transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-3xl translate-y-32 -translate-x-32 group-hover:translate-y-[120px] transition-transform duration-700" />

        <div className="absolute top-0 right-0 p-3 sm:p-4">
          <div className="text-white/90 text-sm font-medium flex items-center gap-2">
            <Flame className="w-4 h-4 animate-float" />
            {streak > 0 && (
              <span className="animate-pulse">
                {getStreakEmoji(streak)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 sm:mb-6 relative">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="p-2 sm:p-2.5 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-500">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              {streak > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full flex items-center justify-center animate-pulse">
                  <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#F97316]" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-medium text-white/90">Daily Growth & Wellbeing</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-white group-hover:scale-105 transition-transform">
                  {streak}
                </span>
                <span className="text-xs sm:text-sm text-white/80">day streak</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 sm:h-8 px-2 sm:px-3 hover:bg-white/10 backdrop-blur-sm text-white flex items-center gap-1.5 group/time"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/settings");
              }}
            >
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/80 group-hover/time:scale-110 transition-transform" />
              <span className="text-xs">{formattedTime}</span>
            </Button>
          </div>
        </div>

        {latestStandUp ? (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 relative">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
                <span className="text-xs font-medium text-white">Today's Focus</span>
              </div>
              <div className="text-xs sm:text-sm text-white/90 truncate">
                {latestStandUp.focus || "Not set"}
              </div>
            </div>

            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
                <span className="text-xs font-medium text-white">Wellbeing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{getWellbeingEmoji(latestStandUp.mental_health)}</span>
                <span className="text-xs sm:text-sm text-white/90">
                  {latestStandUp.mental_health >= 8 ? "Thriving" :
                   latestStandUp.mental_health >= 6 ? "Balanced" :
                   latestStandUp.mental_health >= 4 ? "Growing" : "Self-Care"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm text-center relative">
            <p className="text-sm text-white/90 mb-2">Start your day mindfully</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-1 sm:mt-2 text-white hover:bg-white/20 group/btn text-xs sm:text-sm"
              onClick={() => navigate("/stand-up")}
            >
              Complete Morning Stand-Up
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover/btn:translate-y-[-2px] transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}