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
  
  return (
    <div className="space-y-3">
      <div 
        className="relative p-6 rounded-2xl bg-gradient-to-br from-[#F97316] via-[#FB923C] to-[#FDBA74] border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer backdrop-blur-xl overflow-hidden" 
        onClick={() => navigate("/stand-up")}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:translate-y-[-120px] transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-3xl translate-y-32 -translate-x-32 group-hover:translate-y-[120px] transition-transform duration-700" />

        <div className="absolute top-0 right-0 p-4">
          <div className="text-white/90 text-sm font-medium flex items-center gap-2">
            <Flame className="w-4 h-4 animate-float" />
            {streak > 0 && (
              <span className="animate-pulse">
                {getStreakEmoji(streak)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 relative">
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
              <span className="text-xs font-medium text-white/90">Daily Growth & Wellbeing</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">
                  {streak}
                </span>
                <span className="text-sm text-white/80">day streak</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-3 hover:bg-white/10 backdrop-blur-sm text-white flex items-center gap-1.5 group/time"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/settings");
              }}
            >
              <Clock className="w-3.5 h-3.5 text-white/80 group-hover/time:scale-110 transition-transform" />
              <span className="text-xs">{formattedTime}</span>
            </Button>
          </div>
        </div>

        {latestStandUp ? (
          <div className="grid grid-cols-3 gap-3 relative">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-white/80" />
                <span className="text-xs font-medium text-white">Mental State</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{latestStandUp.mental_health}</span>
                <span className="text-xs text-white/80">/10</span>
              </div>
            </div>
            
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-white/80" />
                <span className="text-xs font-medium text-white">Focus</span>
              </div>
              <div className="text-sm text-white/90 truncate">
                {latestStandUp.focus || "Not set"}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-white/80" />
                <span className="text-xs font-medium text-white">Wellbeing</span>
              </div>
              <div className="text-sm text-white/90">
                {latestStandUp.mental_health >= 8 ? "Thriving" :
                 latestStandUp.mental_health >= 6 ? "Balanced" :
                 latestStandUp.mental_health >= 4 ? "Managing" : "Needs Care"}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm text-center relative">
            <p className="text-sm text-white/90 mb-2">Start your day mindfully</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-white hover:bg-white/20 group/btn"
              onClick={() => navigate("/stand-up")}
            >
              Complete Morning Stand-Up
              <TrendingUp className="w-4 h-4 ml-2 group-hover/btn:translate-y-[-2px] transition-transform" />
            </Button>
          </div>
        )}
        
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      </div>
    </div>
  );
}