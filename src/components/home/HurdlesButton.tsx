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
      className="w-full group relative overflow-hidden hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 bg-gradient-to-br from-white via-gray-50/95 to-white border border-primary-100/20 shadow-lg hover:shadow-xl backdrop-blur-lg rounded-3xl h-auto py-4"
      onClick={() => navigate("/hurdles")}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/10 to-primary-100/5 rounded-3xl" />
      <div className="relative flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-50 to-primary-100/80 rounded-xl group-hover:scale-110 transition-transform duration-500">
            <AlertCircle className="w-4 h-4 text-primary-600" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-secondary-700 font-medium group-hover:translate-x-0.5 transition-transform">View Current Hurdles</span>
            {activeHurdles && activeHurdles.length > 0 && (
              <span className="text-xs text-secondary-600">
                {activeHurdles.length} active {activeHurdles.length === 1 ? 'hurdle' : 'hurdles'}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform duration-500" />
      </div>
    </Button>
  );
}