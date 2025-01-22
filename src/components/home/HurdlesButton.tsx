import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HurdlesButton() {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 bg-white/50 dark:bg-gray-900/50 border-gray-200/20 dark:border-gray-700/20 rounded-2xl"
      onClick={() => navigate("/hurdles")}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-primary-500/10 to-primary-500/5 group-hover:from-primary-500/10 group-hover:via-primary-500/15 group-hover:to-primary-500/10 transition-colors" />
      <div className="relative flex items-center justify-between w-full p-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-xl group-hover:from-primary-500/30 group-hover:to-secondary-500/30 transition-colors">
            <AlertCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="text-primary-600 dark:text-primary-400 font-medium">View Current Hurdles</span>
        </div>
        <ChevronRight className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </Button>
  );
}