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
        <StreakCard />
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-primary-600/5 rounded-xl blur-xl" />
          <GoalsSection />
        </div>

        <div className="space-y-4 bg-white/50 dark:bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="w-full mb-4 bg-white dark:bg-gray-800 border border-gray-200/20 dark:border-gray-700/20">
              <TabsTrigger 
                value="today" 
                className="flex-1 data-[state=active]:bg-primary-500/10 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400"
              >
                Today's To-Do
              </TabsTrigger>
              <TabsTrigger 
                value="week" 
                className="flex-1 data-[state=active]:bg-primary-500/10 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400"
              >
                Week's To-Do
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-2">
              <TodoList frequency="daily" />
            </TabsContent>
            
            <TabsContent value="week" className="mt-2">
              <TodoList frequency="weekly" />
            </TabsContent>
          </Tabs>
        </div>

        <HurdlesButton />
      </div>
    </PageContainer>
  );
}