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
import { motion } from "framer-motion";

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <WelcomeHeader username={profile?.first_name} />

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/10 p-6 rounded-3xl backdrop-blur-xl border border-white/20">
            <StreakCard streak={profile?.streak || 0} standUpTime={profile?.stand_up_time} />
          </div>

          <div className="bg-gradient-to-br from-[#F97316]/10 to-[#FB923C]/10 p-6 rounded-3xl backdrop-blur-xl border border-white/20">
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="w-full mb-6 bg-black/[0.02] border border-black/[0.04] p-1.5 rounded-2xl">
                <TabsTrigger 
                  value="today" 
                  className="flex-1 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F97316] data-[state=active]:to-[#FB923C] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
                >
                  Today's To-Do
                </TabsTrigger>
                <TabsTrigger 
                  value="week" 
                  className="flex-1 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F97316] data-[state=active]:to-[#FB923C] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
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

          <div className="bg-gradient-to-br from-[#0EA5E9]/10 to-[#38BDF8]/10 p-6 rounded-3xl backdrop-blur-xl border border-white/20">
            <GoalsSection />
          </div>
          
          <div className="pb-24">
            <HurdlesButton />
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
}