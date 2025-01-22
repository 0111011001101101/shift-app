import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { StreakCard } from "@/components/home/StreakCard";
import { TodoList } from "@/components/home/TodoList";
import { GoalsSection } from "@/components/home/GoalsSection";
import { HurdlesButton } from "@/components/home/HurdlesButton";

export default function Home() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <WelcomeHeader />
        <StreakCard />

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="w-full mb-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm">
            <TabsTrigger value="today" className="flex-1 data-[state=active]:bg-primary/20">
              Today's To-Do
            </TabsTrigger>
            <TabsTrigger value="week" className="flex-1 data-[state=active]:bg-primary/20">
              Week's To-Do
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-2">
            <TodoList frequency="daily" />
          </TabsContent>
          
          <TabsContent value="week" className="space-y-2">
            <TodoList frequency="weekly" />
          </TabsContent>
        </Tabs>

        <GoalsSection />
        <HurdlesButton />
      </div>
    </PageContainer>
  );
}