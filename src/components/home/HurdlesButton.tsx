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
      className="w-full group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      onClick={() => navigate("/hurdles")}
    >
      <div className="relative flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary-500/10 rounded-lg">
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