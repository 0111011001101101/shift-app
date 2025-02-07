
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
      className="w-full group relative overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-white/95 border border-gray-100/50 shadow-sm hover:shadow-md backdrop-blur-lg rounded-2xl h-auto py-4 text-secondary-800"
      onClick={() => navigate("/hurdles")}
    >
      <div className="relative flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="p-2.5 bg-primary-50/50 rounded-xl group-hover:scale-110 transition-transform duration-500">
              <Brain className="w-5 h-5 text-primary-600" />
            </div>
            <div className="p-2.5 bg-primary-50/50 rounded-xl group-hover:scale-110 transition-transform duration-500 delay-75">
              <Shield className="w-5 h-5 text-primary-600" />
            </div>
            <div className="p-2.5 bg-primary-50/50 rounded-xl group-hover:scale-110 transition-transform duration-500 delay-150">
              <Heart className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-base font-medium group-hover:translate-x-0.5 transition-transform">
              {activeHurdles && activeHurdles.length > 0 ? 'Mental Resilience Hub' : 'Build Mental Resilience'}
            </span>
            {activeHurdles && activeHurdles.length > 0 ? (
              <span className="text-xs text-secondary-500">
                {activeHurdles.length} active {activeHurdles.length === 1 ? 'challenge' : 'challenges'} to overcome
              </span>
            ) : (
              <span className="text-xs text-secondary-500">
                Track and overcome challenges mindfully
              </span>
            )}
          </div>
        </div>
        {activeHurdles && activeHurdles.length > 0 ? (
          <ChevronRight className="w-5 h-5 text-secondary-500 group-hover:translate-x-1 transition-transform duration-500" />
        ) : (
          <Plus className="w-5 h-5 text-secondary-500 group-hover:rotate-90 transition-transform duration-500" />
        )}
      </div>
    </Button>
  );
}
