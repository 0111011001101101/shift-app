
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
        className="space-y-6"
      >
        <WelcomeHeader username={profile?.first_name} />

        <div className="space-y-6 sm:space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StreakCard streak={profile?.streak || 0} standUpTime={profile?.stand_up_time} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="w-full mb-4 sm:mb-6 bg-white backdrop-blur-sm border border-primary-100/40 p-1 rounded-xl sm:rounded-2xl shadow-sm">
                <TabsTrigger 
                  value="today" 
                  className="flex-1 py-2.5 sm:py-3 text-sm sm:text-base text-secondary-700 data-[state=active]:bg-primary-500 data-[state=active]:text-white rounded-lg sm:rounded-xl transition-all duration-300"
                >
                  Today's Tasks
                </TabsTrigger>
                <TabsTrigger 
                  value="week" 
                  className="flex-1 py-2.5 sm:py-3 text-sm sm:text-base text-secondary-700 data-[state=active]:bg-primary-500 data-[state=active]:text-white rounded-lg sm:rounded-xl transition-all duration-300"
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

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
    </PageContainer>
  );
}
