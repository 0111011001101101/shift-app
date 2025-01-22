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
  
  // Fetch user profile for personalization
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
    <PageContainer className="space-y-6">
      <div className="space-y-6 animate-fadeIn">
        <WelcomeHeader username={profile?.first_name} />
        <StreakCard streak={profile?.streak || 0} standUpTime={profile?.stand_up_time} />
        
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