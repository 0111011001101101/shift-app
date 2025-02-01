import { Button } from "@/components/ui/button";
import { Trophy, Star, Clock, Calendar, Target, Flame, Heart, XCircle, AlertCircle } from "lucide-react";
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

  const isStandUpDoneToday = () => {
    if (!latestStandUp) return false;
    const today = new Date().toDateString();
    const standUpDate = new Date(latestStandUp.created_at).toDateString();
    return today === standUpDate && latestStandUp.completed;
  };
  
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        {/* Streak Section */}
        <div 
          className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden backdrop-blur-xl border border-white/10"
          onClick={() => navigate("/stand-up")}
        >
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="p-2 sm:p-2.5 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-500">
                  {streak === 0 ? (
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
                  ) : (
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </div>
                {streak > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full flex items-center justify-center animate-pulse">
                    <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-primary-500" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-medium text-white/90">Daily Streak</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white group-hover:scale-105 transition-transform">
                    {streak}
                  </span>
                  <span className="text-xs sm:text-sm text-white/80 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                    {streak === 1 ? "day" : "days"}
                  </span>
                  {streak > 0 && (
                    <span className="text-lg animate-pulse">
                      {getStreakEmoji(streak)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {!isStandUpDoneToday() && (
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-white bg-accent/90 px-2.5 py-1.5 rounded-full backdrop-blur-sm animate-pulse shadow-lg">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Stand-up Due</span>
                  </div>
                  <span className="text-[10px] text-white/80">Complete by {formattedTime}</span>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 sm:h-8 px-2 sm:px-3 hover:bg-white/10 backdrop-blur-sm text-white flex items-center gap-1.5 group/time"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/settings");
                }}
              >
                <Clock className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 text-white/80 group-hover/time:scale-110 transition-transform" />
                <span className="text-xs">{formattedTime}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Wellbeing Section */}
        <div 
          className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent-500 via-accent-600 to-accent-700 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden backdrop-blur-xl border border-white/10"
          onClick={() => navigate("/stand-up")}
        >
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
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-white/90">
                  <AlertCircle className="w-5 h-5 animate-pulse" />
                  <p className="text-sm font-medium">Morning Stand-up Required</p>
                </div>
                <p className="text-xs text-white/80">Start your day mindfully and maintain your streak</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1 sm:mt-2 text-white hover:bg-white/20 group/btn text-xs sm:text-sm border border-white/20"
                  onClick={() => navigate("/stand-up")}
                >
                  Complete Stand-up
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover/btn:translate-y-[-2px] transition-transform" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}