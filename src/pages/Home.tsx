import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { StreakCard } from "@/components/home/StreakCard";
import { TodoList } from "@/components/home/TodoList";
import { GoalsSection } from "@/components/home/GoalsSection";
import { HurdlesButton } from "@/components/home/HurdlesButton";
import { MetricsBar } from "@/components/home/MetricsBar";
import { GrowthChart } from "@/components/home/GrowthChart";

export default function Home() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <WelcomeHeader />
        
        <MetricsBar />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StreakCard />
          <GrowthChart />
        </div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="today" className="flex-1">Today's To-Do</TabsTrigger>
            <TabsTrigger value="week" className="flex-1">Week's To-Do</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            <TodoList />
          </TabsContent>
          
          <TabsContent value="week" className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Exercise 3 times per week</span>
              <span className="text-xs px-2 py-0.5 bg-warning/10 text-warning rounded-full">2/3</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Weekend digital detox</span>
              <span className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded-full">Weekly</span>
            </div>
          </TabsContent>
        </Tabs>

        <GoalsSection />
        <HurdlesButton />
      </div>
    </PageContainer>
  );
}