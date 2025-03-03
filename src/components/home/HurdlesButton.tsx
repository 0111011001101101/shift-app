
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

  if (isError || !hurdles?.length) {
    return (
      <Link 
        to="/hurdles" 
        className="block rounded-xl bg-white shadow-md transition-all hover:shadow-lg border border-orange-100/30"
      >
        <div className="p-6 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-orange-50 p-3 mb-3 border border-orange-100/50">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">
            No active hurdles
          </h3>
          <p className="text-gray-500 text-sm">
            Tap to add challenges you're facing
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to="/hurdles" 
      className="block rounded-xl bg-white shadow-md overflow-hidden transition-all hover:shadow-lg border border-orange-100/30"
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-orange-50 p-2.5 border border-orange-100/50">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              Current Hurdles
            </h3>
            <p className="text-gray-500 text-sm">
              {hurdles.length} active {hurdles.length === 1 ? 'challenge' : 'challenges'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
      
      {hurdles.slice(0, 2).map((hurdle) => (
        <div 
          key={hurdle.id} 
          className="px-4 py-3.5 border-t border-gray-100"
        >
          <p className="text-sm text-gray-700 truncate">{hurdle.title}</p>
        </div>
      ))}
      
      {hurdles.length > 2 && (
        <div className="p-2.5 text-xs text-center text-primary-600 bg-primary-50/80 border-t border-gray-100 font-medium">
          +{hurdles.length - 2} more
        </div>
      )}
    </Link>
  );
}
