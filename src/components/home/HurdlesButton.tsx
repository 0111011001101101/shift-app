
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, ChevronRight, Shield, PlusCircle } from "lucide-react";

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
        className="block rounded-xl bg-white shadow-md transition-all hover:translate-y-[-1px] hover:shadow-lg border border-orange-100/30 hover:border-orange-200/50 overflow-hidden"
      >
        <div className="p-4 flex items-center gap-3">
          <div className="rounded-full bg-orange-50 p-2.5 border border-orange-100/50 shadow-sm">
            <Shield className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm">
              No active challenges
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Identify obstacles you're facing
            </p>
          </div>
          <div className="ml-auto">
            <PlusCircle className="w-5 h-5 text-orange-400" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to="/hurdles" 
      className="block rounded-xl bg-white shadow-md overflow-hidden transition-all hover:translate-y-[-1px] hover:shadow-lg border border-orange-100/30 hover:border-orange-200/50"
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-orange-50 p-2.5 border border-orange-100/50 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm">
              Active Challenges
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {hurdles.length} {hurdles.length === 1 ? 'challenge' : 'challenges'} to overcome
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
      
      {hurdles.slice(0, 2).map((hurdle) => (
        <div 
          key={hurdle.id} 
          className="px-4 py-3 border-t border-gray-100 hover:bg-orange-50/30 transition-all duration-200"
        >
          <p className="text-sm text-gray-700 truncate">{hurdle.title}</p>
        </div>
      ))}
      
      {hurdles.length > 2 && (
        <div className="p-2 text-xs text-center text-orange-600 bg-orange-50/80 border-t border-gray-100 font-medium">
          +{hurdles.length - 2} more challenges
        </div>
      )}
    </Link>
  );
}
