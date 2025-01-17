import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Target, ChevronRight, Trophy, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative py-6">
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

        {/* Streak Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
              <div className="relative p-2 bg-gradient-to-br from-amber-500/30 to-secondary/30 rounded-xl backdrop-blur-sm">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Streak</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-secondary bg-clip-text text-transparent">7</span>
                <span className="text-xs text-gray-500">days</span>
              </div>
            </div>
          </div>
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-amber-500/20 to-secondary/20 flex items-center justify-center"
              >
                <Star className="w-4 h-4 text-amber-500" />
              </div>
            ))}
          </div>
        </div>

        {/* To-Do Tabs Section */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="today" className="flex-1">Today's To-Do</TabsTrigger>
            <TabsTrigger value="week" className="flex-1">Week's To-Do</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            <div className="space-y-2">
              {/* Today's Goals */}
              <div className="flex items-center justify-between text-sm">
                <span>Take lunch breaks away from desk</span>
                <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">Daily</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>No work emails after 6 PM</span>
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">Daily</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="week" className="space-y-4">
            <div className="space-y-2">
              {/* Weekly Goals */}
              <div className="flex items-center justify-between text-sm">
                <span>Exercise 3 times per week</span>
                <span className="text-xs px-2 py-0.5 bg-warning/10 text-warning rounded-full">2/3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Weekend digital detox</span>
                <span className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded-full">Weekly</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Long Term Goals Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold">Long Term Goals</h2>
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
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Launch MVP Product</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Target: Q2 2024</p>
                </div>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">In Progress</span>
              </div>
              <Progress value={65} className="h-1.5 mb-2" />
            </div>

            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Scale User Base</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Target: Q4 2024</p>
                </div>
                <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">Planning</span>
              </div>
              <Progress value={25} className="h-1.5 mb-2" />
            </div>
          </div>
        </section>

        {/* Current Hurdles Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-destructive" />
              <h2 className="text-base font-semibold">Current Hurdles</h2>
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

          <div className="space-y-4">
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Time Management</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pomodoro Technique</span>
                  <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">Effective</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Weekly Planning</span>
                  <span className="text-xs px-2 py-0.5 bg-warning/10 text-warning rounded-full">In Progress</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Work-Life Balance</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Set Work Hours</span>
                  <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">Effective</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Regular Exercise</span>
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">New Solution</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}