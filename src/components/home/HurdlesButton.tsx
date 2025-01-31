import { Button } from "@/components/ui/button";
import { Brain, Shield, Heart, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function HurdlesButton() {
  const navigate = useNavigate();
  
  const { data: activeHurdles } = useQuery({
    queryKey: ["activeHurdles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("hurdles")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed", false)
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching hurdles:", error);
        return [];
      }
      
      return data || [];
    },
  });
  
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full group relative overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-gradient-to-br from-[#10B981] to-[#34D399] border-0 shadow-lg hover:shadow-xl backdrop-blur-lg rounded-2xl h-auto py-4 text-white"
      onClick={() => navigate("/hurdles")}
    >
      <div className="relative flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="p-2.5 bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-500">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="p-2.5 bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-500 delay-75">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="p-2.5 bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-500 delay-150">
              <Heart className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-base font-medium group-hover:translate-x-0.5 transition-transform">
              {activeHurdles && activeHurdles.length > 0 ? 'Mental Resilience Hub' : 'Build Mental Resilience'}
            </span>
            {activeHurdles && activeHurdles.length > 0 ? (
              <span className="text-xs text-white/90">
                {activeHurdles.length} active {activeHurdles.length === 1 ? 'challenge' : 'challenges'} to overcome
              </span>
            ) : (
              <span className="text-xs text-white/90">
                Track and overcome challenges mindfully
              </span>
            )}
          </div>
        </div>
        {activeHurdles && activeHurdles.length > 0 ? (
          <ChevronRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform duration-500" />
        ) : (
          <Plus className="w-5 h-5 text-white/90 group-hover:rotate-90 transition-transform duration-500" />
        )}
      </div>
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
    </Button>
  );
}