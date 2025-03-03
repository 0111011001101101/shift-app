
import { Button } from "@/components/ui/button";
import { Brain, ShieldCheck, ChevronRight, Plus } from "lucide-react";
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
      className="w-full relative bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-xl h-auto py-4 text-secondary-800"
      onClick={() => navigate("/hurdles")}
    >
      <div className="relative flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Brain className="w-5 h-5 text-primary-500" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-base font-medium">
              {activeHurdles && activeHurdles.length > 0 ? 'Mental Resilience Hub' : 'Build Mental Resilience'}
            </span>
            {activeHurdles && activeHurdles.length > 0 ? (
              <span className="text-xs text-secondary-600">
                {activeHurdles.length} active {activeHurdles.length === 1 ? 'challenge' : 'challenges'} to overcome
              </span>
            ) : (
              <span className="text-xs text-secondary-600">
                Track and overcome challenges mindfully
              </span>
            )}
          </div>
        </div>
        {activeHurdles && activeHurdles.length > 0 ? (
          <ChevronRight className="w-5 h-5 text-primary-500" />
        ) : (
          <Plus className="w-5 h-5 text-primary-500" />
        )}
      </div>
    </Button>
  );
}
