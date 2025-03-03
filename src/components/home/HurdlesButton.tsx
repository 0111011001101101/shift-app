
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
      <Card className="h-20 animate-pulse rounded-lg shadow-sm border-none" />
    );
  }

  if (isError || !hurdles?.length) {
    return (
      <Link to="/hurdles" className="block">
        <Card className="rounded-lg border-none shadow-sm hover:shadow transition-all">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-2.5">
                <Shield className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-gray-600">
                No active challenges
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to="/hurdles" className="block">
      <Card className="rounded-lg border-none shadow-sm hover:shadow transition-all">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gray-100 p-2.5">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {hurdles.length} {hurdles.length === 1 ? 'challenge' : 'challenges'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        
        {hurdles.slice(0, 2).map((hurdle) => (
          <div 
            key={hurdle.id} 
            className="px-4 py-3 border-t border-gray-100"
          >
            <p className="text-sm text-gray-700 truncate">{hurdle.title}</p>
          </div>
        ))}
        
        {hurdles.length > 2 && (
          <div className="p-2.5 text-xs text-center text-gray-500 border-t border-gray-100">
            +{hurdles.length - 2} more
          </div>
        )}
      </Card>
    </Link>
  );
}
