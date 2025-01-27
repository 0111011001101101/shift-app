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
    <PageContainer className="max-w-3xl mx-auto space-y-8 px-4 sm:px-6 pb-safe-area-inset-bottom">
      <div className="space-y-6 animate-fadeIn">
        <WelcomeHeader username={profile?.first_name} />
        
        <div className="sticky -top-2 z-10 pt-4 pb-2">
          <StreakCard streak={profile?.streak || 0} standUpTime={profile?.stand_up_time} />
        </div>

        <div className="space-y-4 bg-white/60 backdrop-blur-xl rounded-3xl border border-primary-100/20 shadow-lg overflow-hidden">
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="w-full mb-4 bg-primary-50/50 border-0 p-1.5">
              <TabsTrigger 
                value="today" 
                className="flex-1 py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-md rounded-xl transition-all duration-300"
              >
                Today's To-Do
              </TabsTrigger>
              <TabsTrigger 
                value="week" 
                className="flex-1 py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-md rounded-xl transition-all duration-300"
              >
                Week's To-Do
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
              <TodoList frequency="daily" />
            </TabsContent>
            
            <TabsContent value="week" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
              <TodoList frequency="weekly" />
            </TabsContent>
          </Tabs>
        </div>

        <GoalsSection />
        <HurdlesButton />
      </div>
    </PageContainer>
  );
}