import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, ChevronRight } from "lucide-react";

export function HurdlesButton() {
  const { data: hurdles, isError } = useQuery({
    queryKey: ["hurdles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("hurdles")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed", false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      {isError || !hurdles?.length ? (
        <Link 
          to="/hurdles" 
          className="block w-full p-4 rounded-xl bg-white/80 shadow-sm text-center"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="rounded-full bg-gray-100 p-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">
                No active hurdles
              </h3>
              <p className="text-gray-500 text-xs mt-1">
                Tap to add and track challenges you're facing
              </p>
            </div>
          </div>
        </Link>
      ) : (
        <Link 
          to="/hurdles" 
          className="block w-full rounded-xl bg-white/80 shadow-sm overflow-hidden"
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">
                  Current Hurdles
                </h3>
                <p className="text-gray-500 text-xs">
                  {hurdles.length} active {hurdles.length === 1 ? 'challenge' : 'challenges'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="border-t border-gray-100">
            {hurdles.slice(0, 2).map((hurdle) => (
              <div 
                key={hurdle.id} 
                className="p-3 border-b border-gray-100 last:border-b-0"
              >
                <p className="text-sm text-gray-700 truncate">{hurdle.title}</p>
              </div>
            ))}
            {hurdles.length > 2 && (
              <div className="p-3 text-xs text-center text-primary-600">
                +{hurdles.length - 2} more
              </div>
            )}
          </div>
        </Link>
      )}
    </div>
  );
}
