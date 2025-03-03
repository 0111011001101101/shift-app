
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
import { Card } from "@/components/ui/card";

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <PageContainer>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 pb-24"
      >
        <motion.div variants={item}>
          <WelcomeHeader username={profile?.first_name} />
        </motion.div>

        <motion.div variants={item}>
          <Card className="border border-gray-100 shadow-sm overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm">
            <StreakCard streak={profile?.streak || 0} standUpTime={profile?.stand_up_time} />
          </Card>
        </motion.div>

        <motion.div variants={item} className="space-y-2">
          <h2 className="text-base font-semibold text-gray-800 mb-2 px-1">Today's Focus</h2>
          <Card className="border border-gray-100 shadow-sm p-4 rounded-xl bg-white/90 backdrop-blur-sm">
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="w-full mb-4 grid grid-cols-2 h-10 rounded-lg bg-gray-100/80 p-1">
                <TabsTrigger 
                  value="today" 
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-medium"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger 
                  value="week" 
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-medium"
                >
                  This Week
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="today" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <TodoList frequency="daily" />
              </TabsContent>
              
              <TabsContent value="week" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <TodoList frequency="weekly" />
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>

        <motion.div variants={item} className="space-y-2">
          <h2 className="text-base font-semibold text-gray-800 mb-2 px-1">Goals & Growth</h2>
          <GoalsSection />
        </motion.div>
        
        <motion.div variants={item} className="space-y-2">
          <h2 className="text-base font-semibold text-gray-800 mb-2 px-1">Overcome Challenges</h2>
          <HurdlesButton />
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
