import { Button } from "@/components/ui/button";
import { Target, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GoalsSection() {
  const navigate = useNavigate();
  
  return (
    <section className="space-y-4 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Long Term Goals</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs"
          onClick={() => navigate("/goals")}
        >
          View All
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 backdrop-blur-sm transition-all duration-300 hover:bg-primary/10">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Launch MVP Product</h3>
              <p className="text-sm text-gray-500 mt-0.5">Target: Q2 2025</p>
            </div>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">65%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-amber-500/30 via-secondary/40 to-primary/30 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-300" style={{ width: '65%' }} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-secondary/10 bg-secondary/5 backdrop-blur-sm transition-all duration-300 hover:bg-secondary/10">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Scale User Base</h3>
              <p className="text-sm text-gray-500 mt-0.5">Target: Q4 2024</p>
            </div>
            <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">25%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-amber-500/30 via-secondary/40 to-primary/30 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-300" style={{ width: '25%' }} />
          </div>
        </div>
      </div>
    </section>
  );
}