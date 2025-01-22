import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { StreakCard } from "@/components/home/StreakCard";
import { TodoList } from "@/components/home/TodoList";
import { GoalsSection } from "@/components/home/GoalsSection";
import { HurdlesButton } from "@/components/home/HurdlesButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error fetching profile",
          description: "Please try again later",
          variant: "destructive",
        });
        return null;
      }
      
      return data;
    },
  });

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <WelcomeHeader username={profile?.first_name} />
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="w-full mb-4 bg-gray-50 dark:bg-gray-900/50">
                <TabsTrigger 
                  value="today" 
                  className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                >
                  Today's To-Do
                </TabsTrigger>
                <TabsTrigger 
                  value="week" 
                  className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
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

          <GoalsSection />
          <HurdlesButton />
        </div>

        {/* Right Column - Streak & Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-6">
            <StreakCard 
              streak={profile?.streak || 0} 
              standUpTime={profile?.stand_up_time} 
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}