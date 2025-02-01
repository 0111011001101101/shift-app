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
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white to-primary-50/30 -z-10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative space-y-6 sm:space-y-8"
        >
          <WelcomeHeader username={profile?.first_name} />

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border border-primary-100/30 p-6 space-y-6"
            >
              <StreakCard streak={profile?.streak || 0} standUpTime={profile?.stand_up_time} />

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Tabs defaultValue="today" className="w-full">
                  <TabsList className="w-full mb-6 bg-primary-50/50 backdrop-blur-sm border border-primary-100/30 p-1 rounded-xl">
                    <TabsTrigger 
                      value="today" 
                      className="flex-1 py-3 text-base text-secondary-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-accent data-[state=active]:text-white rounded-lg transition-all duration-300"
                    >
                      Today's Tasks
                    </TabsTrigger>
                    <TabsTrigger 
                      value="week" 
                      className="flex-1 py-3 text-base text-secondary-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-accent data-[state=active]:text-white rounded-lg transition-all duration-300"
                    >
                      Week's Tasks
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="today" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <TodoList frequency="daily" />
                  </TabsContent>
                  
                  <TabsContent value="week" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <TodoList frequency="weekly" />
                  </TabsContent>
                </Tabs>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border border-primary-100/30 p-6"
            >
              <GoalsSection />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pb-24"
            >
              <HurdlesButton />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}