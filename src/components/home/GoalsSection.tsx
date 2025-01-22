import { Button } from "@/components/ui/button";
import { Target, ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GoalsSection() {
  const navigate = useNavigate();
  
  return (
    <section className="space-y-4 bg-gradient-to-br from-white via-gray-50/80 to-gray-100/80 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)] animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-lg rounded-full" />
            <div className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl backdrop-blur-sm">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Long Term Goals</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs hover:bg-blue-500/10 group"
          onClick={() => navigate("/goals")}
        >
          View All
          <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-blue-500/10 bg-gradient-to-r from-blue-500/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:bg-blue-500/10 hover:scale-[1.02] group">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Launch MVP Product</h3>
              <p className="text-sm text-gray-500 mt-0.5">Target: Q2 2025</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full font-medium group-hover:bg-blue-500 group-hover:text-white transition-colors">65%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-500/10 to-transparent overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" style={{ width: '65%' }} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-purple-500/10 bg-gradient-to-r from-purple-500/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:bg-purple-500/10 hover:scale-[1.02] group">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Scale User Base</h3>
              <p className="text-sm text-gray-500 mt-0.5">Target: Q4 2024</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full font-medium group-hover:bg-purple-500 group-hover:text-white transition-colors">25%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-purple-500/10 to-transparent overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300" style={{ width: '25%' }} />
          </div>
        </div>
      </div>
    </section>
  );
}