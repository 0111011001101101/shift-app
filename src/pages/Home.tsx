import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Sun, Target, Sparkles, Trophy, Star, ChevronRight, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <PageContainer>
      <div className="space-y-4">
        {/* Streak Section */}
        <Card className="text-center py-4 px-3 bg-gradient-to-br from-white via-gray-50/95 to-gray-100/90 dark:from-gray-800 dark:via-gray-900/95 dark:to-gray-950/90 hover:shadow-lg transition-all duration-300 group overflow-hidden relative animate-fadeIn">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-center gap-3">
            <Star className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-secondary bg-clip-text text-transparent">7</span>
            <Star className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              day streak
            </span>
          </div>
        </Card>

        {/* Header Section - Enhanced Design */}
        <Card className="overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent backdrop-blur-sm border-0 shadow-none">
          <div className="relative p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl -z-10" />
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-sm">
                <Sun className="w-6 h-6 text-secondary animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Good Morning, User
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Let's make today count
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Stand-up Card */}
        <Card 
          className="relative overflow-hidden bg-gradient-to-br from-white/95 via-gray-50/90 to-gray-100/95 dark:from-gray-800/95 dark:via-gray-900/90 dark:to-gray-950/95 backdrop-blur-lg border border-gray-100/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 animate-slideUp group cursor-pointer"
          onClick={() => navigate("/stand-up")}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/30 rounded-xl shadow-inner">
                  <Sparkles className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Morning Stand-Up</h2>
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full">5 min</span>
            </div>
            <Button variant="secondary" className="w-full text-sm py-2 h-10 bg-gradient-to-r from-blue-500 via-blue-600 to-secondary hover:from-blue-600 hover:via-blue-700 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
              Begin Check-in <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>

        {/* Goals Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-secondary/20 to-transparent">
                <Target className="w-4 h-4 text-secondary" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Goals & Tasks</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => navigate("/goals")}
            >
              <Edit2 className="w-3 h-3 mr-1" />
              Edit Goals
            </Button>
          </div>
          
          <Card className="divide-y divide-gray-100 dark:divide-gray-800">
            {/* Daily Tasks */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Daily Tasks</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Checkbox id="task1" className="data-[state=checked]:bg-green-500" />
                  <label htmlFor="task1" className="text-sm text-gray-700 dark:text-gray-300">Complete project presentation</label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="task2" className="data-[state=checked]:bg-green-500" />
                  <label htmlFor="task2" className="text-sm text-gray-700 dark:text-gray-300">30 min meditation</label>
                </div>
              </div>
            </div>

            {/* Weekly Goals */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Weekly Goal Progress</span>
                </div>
                <span className="text-xs text-gray-500">4 days left</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Exercise Routine</span>
                    <span className="text-gray-500">60%</span>
                  </div>
                  <Progress value={60} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Reading Goal</span>
                    <span className="text-gray-500">40%</span>
                  </div>
                  <Progress value={40} className="h-1.5" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Hurdles Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-destructive/20 to-transparent">
                <Target className="w-4 h-4 text-destructive" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Current Hurdles</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => navigate("/hurdles")}
            >
              View All
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          
          <Card className="p-4 space-y-3">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">Time Management</span>
                  <span className="text-gray-500">2/3 solutions tried</span>
                </div>
                <Progress value={66} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">Work-Life Balance</span>
                  <span className="text-gray-500">1/4 solutions tried</span>
                </div>
                <Progress value={25} className="h-1.5" />
              </div>
            </div>
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}