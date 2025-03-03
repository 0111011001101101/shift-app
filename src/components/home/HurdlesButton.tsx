
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, ChevronRight, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function HurdlesButton() {
  const { data: hurdles, isLoading, isError } = useQuery({
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

  if (isLoading) {
    return (
      <Card className="h-16 animate-pulse rounded-xl shadow-sm" />
    );
  }

  if (isError || !hurdles?.length) {
    return (
      <Link to="/hurdles" className="block">
        <Card className="rounded-xl shadow-sm hover:shadow transition-all bg-white">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-50 p-2">
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-600 text-sm">
                No active challenges
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to="/hurdles" className="block">
      <Card className="rounded-xl shadow-sm hover:shadow transition-all bg-white">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-50 p-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {hurdles.length} {hurdles.length === 1 ? 'challenge' : 'challenges'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </div>
        
        {hurdles.slice(0, 1).map((hurdle) => (
          <div 
            key={hurdle.id} 
            className="px-4 py-2 pb-3 border-t border-gray-50"
          >
            <p className="text-sm text-gray-600 truncate">{hurdle.title}</p>
          </div>
        ))}
        
        {hurdles.length > 1 && (
          <div className="p-2 text-xs text-center text-gray-500 border-t border-gray-50">
            +{hurdles.length - 1} more
          </div>
        )}
      </Card>
    </Link>
  );
}
