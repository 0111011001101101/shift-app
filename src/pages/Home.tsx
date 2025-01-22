import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { StreakCard } from "@/components/home/StreakCard";
import { TodoList } from "@/components/home/TodoList";
import { GoalsSection } from "@/components/home/GoalsSection";
import { HurdlesButton } from "@/components/home/HurdlesButton";

export default function Home() {
  return (
    <PageContainer className="space-y-6">
      <div className="space-y-6 animate-fadeIn">
        <WelcomeHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                  <span className="text-lg font-semibold">8</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Today's Goals</h3>
                <p className="text-sm text-muted-foreground">Track your progress</p>
              </div>
            </div>
            <StreakCard />
          </div>

          <div className="glass p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                  <span className="text-lg font-semibold">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">AI Support</h3>
                <p className="text-sm text-muted-foreground">Get guidance</p>
              </div>
            </div>
            <GoalsSection />
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <Tabs defaultValue="today" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Daily Focus</h3>
                <p className="text-sm text-muted-foreground">3 of 5 completed</p>
              </div>
              <TabsList className="bg-white/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20">
                <TabsTrigger 
                  value="today" 
                  className="data-[state=active]:bg-primary-500/10 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger 
                  value="week" 
                  className="data-[state=active]:bg-primary-500/10 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400"
                >
                  This Week
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="today" className="mt-2 space-y-4">
              <TodoList frequency="daily" />
            </TabsContent>
            
            <TabsContent value="week" className="mt-2 space-y-4">
              <TodoList frequency="weekly" />
            </TabsContent>
          </Tabs>
        </div>

        <HurdlesButton />
      </div>
    </PageContainer>
  );
}