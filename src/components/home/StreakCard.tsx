
import { Button } from "@/components/ui/button";
import { Trophy, Clock, CheckCircle2, AlertCircle, Target, Heart } from "lucide-react";
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
    <div className="grid grid-cols-1 gap-4">
      <div 
        className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer overflow-hidden"
        onClick={() => navigate("/stand-up")}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Trophy className="w-5 h-5 text-primary-500" />
            </div>
            <span className="text-sm font-medium text-secondary-700">Daily Streak</span>
          </div>
          
          <div>
            {isStandUpDoneToday() ? (
              <div className="flex items-center gap-1.5 text-xs font-medium text-white bg-success/90 px-2 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                <span>Completed</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-medium text-white bg-accent/90 px-2 py-1 rounded-full animate-pulse">
                <AlertCircle className="w-3 h-3" />
                <span>Due Today</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-secondary-800">
              {streak}
            </span>
            <span className="text-xs text-secondary-600 bg-gray-100 px-2 py-1 rounded-full">
              {streak === 1 ? "day" : "days"}
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 hover:bg-gray-100 text-secondary-600 flex items-center gap-1.5"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/settings");
            }}
          >
            <Clock className="w-3.5 h-3.5 text-secondary-500" />
            <span className="text-xs">{formattedTime}</span>
          </Button>
        </div>
        
        {latestStandUp && isStandUpDoneToday() && (
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-500" />
              <span className="text-xs text-secondary-700 truncate">{latestStandUp.focus || "Not set"}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent-500" />
              <div className="flex items-center gap-1">
                <span className="text-base">{getWellbeingEmoji(latestStandUp.mental_health)}</span>
                <span className="text-xs text-secondary-700 truncate">
                  {latestStandUp.mental_health}/10
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
