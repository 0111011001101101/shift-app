
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
      <div className="space-y-5 pb-20 max-w-screen-sm mx-auto px-1">
        <WelcomeHeader username={profile?.first_name} />
        
        <StreakCard streak={profile?.streak || 0} standUpTime={profile?.stand_up_time} />

        <section className="space-y-3">
          <h2 className="text-base font-medium text-gray-700 px-1">Today's Focus</h2>
          <div className="rounded-xl bg-white shadow-sm">
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="w-full grid grid-cols-2 rounded-none border-b bg-transparent h-12">
                <TabsTrigger 
                  value="today" 
                  className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary-500 data-[state=active]:shadow-none py-3 text-sm font-medium transition-all"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger 
                  value="week" 
                  className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary-500 data-[state=active]:shadow-none py-3 text-sm font-medium transition-all"
                >
                  This Week
                </TabsTrigger>
              </TabsList>
              
              <div className="p-4">
                <TabsContent value="today" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <TodoList frequency="daily" />
                </TabsContent>
                
                <TabsContent value="week" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <TodoList frequency="weekly" />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-gray-700 px-1">Goals & Growth</h2>
          <GoalsSection />
        </section>
        
        <section className="space-y-3">
          <h2 className="text-base font-medium text-gray-700 px-1">Overcome Challenges</h2>
          <HurdlesButton />
        </section>
      </div>
    </PageContainer>
  );
}
