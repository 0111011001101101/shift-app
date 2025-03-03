
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, ChevronRight, Shield } from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="rounded-xl bg-white/90 shadow-sm border border-orange-100/30 animate-pulse">
        <div className="h-20 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-orange-100/50"></div>
        </div>
      </div>
    );
  }

  if (isError || !hurdles?.length) {
    return (
      <Link 
        to="/hurdles" 
        className="block"
      >
        <motion.div
          whileHover={{ y: -2, boxShadow: "0 8px 20px -6px rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.2 }}
          className="rounded-xl bg-white/90 shadow-sm transition-all border border-orange-100/30 hover:border-orange-200/50 overflow-hidden"
        >
          <div className="p-5 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-orange-50 p-3 mb-3 border border-orange-100/50 shadow-sm">
              <Shield className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">
              No active challenges
            </h3>
            <p className="text-gray-500 text-sm">
              Tap to identify obstacles you're facing
            </p>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link 
      to="/hurdles" 
      className="block"
    >
      <motion.div
        whileHover={{ y: -2, boxShadow: "0 8px 20px -6px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
        className="rounded-xl bg-white/90 shadow-sm overflow-hidden transition-all border border-orange-100/30 hover:border-orange-200/50"
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-50 p-2.5 border border-orange-100/50 shadow-sm">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">
                Active Challenges
              </h3>
              <p className="text-gray-500 text-sm">
                {hurdles.length} {hurdles.length === 1 ? 'challenge' : 'challenges'} to overcome
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        
        {hurdles.slice(0, 2).map((hurdle) => (
          <div 
            key={hurdle.id} 
            className="px-4 py-3 border-t border-gray-100 bg-white hover:bg-orange-50/30 transition-all duration-200"
          >
            <p className="text-sm text-gray-700 truncate">{hurdle.title}</p>
          </div>
        ))}
        
        {hurdles.length > 2 && (
          <div className="p-2.5 text-xs text-center text-orange-600 bg-orange-50/50 border-t border-gray-100 font-medium">
            +{hurdles.length - 2} more challenges
          </div>
        )}
      </motion.div>
    </Link>
  );
}
