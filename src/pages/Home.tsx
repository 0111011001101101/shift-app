import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sun, Target, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <PageContainer>
      <div className="space-y-6">
        <header className="space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Good Morning, User
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Let's start your day with intention</p>
        </header>
        
        <Card 
          className="relative overflow-hidden bg-gradient-to-br from-white/95 via-gray-50/90 to-gray-100/95 dark:from-gray-800/95 dark:via-gray-900/90 dark:to-gray-950/95 backdrop-blur-lg border border-gray-100/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 animate-slideUp group"
          onClick={() => navigate("/stand-up")}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/30 rounded-xl shadow-inner">
                  <Sun className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Morning Stand-Up</h2>
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full">5 min</span>
            </div>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">Start your day with intention. Check in with yourself and set your focus.</p>
            <Button variant="secondary" className="w-full text-sm py-2 h-10 bg-gradient-to-r from-blue-500 via-blue-600 to-secondary hover:from-blue-600 hover:via-blue-700 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
              Begin Check-in <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>

        <section className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-secondary/20 to-transparent">
              <Target className="w-4 h-4 text-secondary" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Today's Focus</h2>
          </div>
          <Card className="space-y-3 p-5 bg-gradient-to-br from-white via-gray-50/95 to-gray-100/90 dark:from-gray-800 dark:via-gray-900/95 dark:to-gray-950/90 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Complete project presentation</span>
            </div>
            <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm text-gray-700 dark:text-gray-300">30 min meditation</span>
            </div>
          </Card>
        </section>

        <section className="space-y-4 animate-fadeIn">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Current Streak
          </h2>
          <Card className="text-center py-8 px-4 bg-gradient-to-br from-white via-gray-50/95 to-gray-100/90 dark:from-gray-800 dark:via-gray-900/95 dark:to-gray-950/90 hover:shadow-lg transition-all duration-300 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-blue-500 bg-clip-text text-transparent animate-pulse mb-2">7</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">days of consistent check-ins</p>
            </div>
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}