import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronRight } from "lucide-react";
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
      className="w-full group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 bg-white/50 dark:bg-gray-900/50 border-gray-200/20 dark:border-gray-700/20"
      onClick={() => navigate("/hurdles")}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-primary-500/10 to-primary-500/5 group-hover:from-primary-500/10 group-hover:via-primary-500/15 group-hover:to-primary-500/10 transition-colors" />
      <div className="relative flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-lg group-hover:from-primary-500/30 group-hover:to-secondary-500/30 transition-colors">
            <AlertCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-primary-600 dark:text-primary-400 font-medium">View Current Hurdles</span>
            {activeHurdles && activeHurdles.length > 0 && (
              <span className="text-xs text-gray-500">
                {activeHurdles.length} active {activeHurdles.length === 1 ? 'hurdle' : 'hurdles'}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </Button>
  );
}