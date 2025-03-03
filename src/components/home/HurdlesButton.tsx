
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
      <div className="rounded-xl bg-white shadow-md border border-orange-100/30 animate-pulse">
        <div className="h-24 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-orange-100/50"></div>
        </div>
      </div>
    );
  }

  if (isError || !hurdles?.length) {
    return (
      <motion.div 
        whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        transition={{ duration: 0.2 }}
      >
        <Link 
          to="/hurdles" 
          className="block rounded-xl bg-white shadow-md transition-all border border-orange-100/30 hover:border-orange-200/50"
        >
          <div className="p-6 flex flex-col items-center justify-center text-center">
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
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.2 }}
    >
      <Link 
        to="/hurdles" 
        className="block rounded-xl bg-white shadow-md overflow-hidden transition-all border border-orange-100/30 hover:border-orange-200/50"
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-50 p-2.5 border border-orange-100/50 shadow-sm">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Current Challenges
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
            className="px-4 py-3.5 border-t border-gray-100 hover:bg-orange-50/30 transition-all duration-200"
          >
            <p className="text-sm text-gray-700 truncate">{hurdle.title}</p>
          </div>
        ))}
        
        {hurdles.length > 2 && (
          <div className="p-2.5 text-xs text-center text-orange-600 bg-orange-50/80 border-t border-gray-100 font-medium">
            +{hurdles.length - 2} more challenges
          </div>
        )}
      </Link>
    </motion.div>
  );
}
