import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sun, Target, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <header className="space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
            <h1 className="text-base font-medium tracking-tight text-gray-900 dark:text-gray-100">Good Morning, User</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Let's start your day with intention</p>
        </header>
        
        <Card className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-sm p-4 border border-gray-100/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 animate-slideUp">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Sun className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">Morning Stand-Up</h2>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">5 min</span>
          </div>
          <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">Start your day with intention. Check in with yourself and set your focus.</p>
          <Button variant="secondary" className="w-full text-xs py-2 h-9 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
            Begin Check-in <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Card>

        <section className="space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-secondary" />
            <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">Today's Focus</h2>
          </div>
          <Card className="space-y-2.5 p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Complete project presentation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm text-gray-700 dark:text-gray-300">30 min meditation</span>
            </div>
          </Card>
        </section>

        <section className="space-y-3 animate-fadeIn">
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">Current Streak</h2>
          <Card className="text-center py-6 px-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-md transition-all duration-300">
            <div className="text-3xl font-semibold bg-gradient-to-r from-blue-500 to-secondary bg-clip-text text-transparent mb-1 animate-pulse">7</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">days of consistent check-ins</p>
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}