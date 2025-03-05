
import { PageContainer } from "@/components/layout/PageContainer";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { StreakCard } from "@/components/home/StreakCard";
import { TodoList } from "@/components/home/TodoList";
import { LongTermGoalsCard } from "@/components/home/LongTermGoalsCard";
import { HurdlesButton } from "@/components/home/HurdlesButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { toast } = useToast();
  const [focusTab, setFocusTab] = useState<"daily" | "weekly">("daily");
  
  const { data: profile, isLoading: profileLoading } = useQuery({
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.35,
        ease: "easeOut"
      }
    })
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <WelcomeHeader username={profile?.first_name} />
        
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <StreakCard 
            streak={profile?.streak || 0} 
            standUpTime={profile?.stand_up_time} 
          />
        </motion.div>

        <motion.section 
          custom={1}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold text-gray-800 px-1 flex items-center gap-2">
            Today's Focus
          </h2>
          
          <Card className="rounded-xl overflow-hidden border-none shadow-md">
            <Tabs 
              defaultValue="daily" 
              value={focusTab} 
              onValueChange={(value) => setFocusTab(value as "daily" | "weekly")}
              className="w-full"
            >
              <div className="px-4 pt-4 pb-2">
                <TabsList className="bg-gray-100 w-full grid grid-cols-2 h-10 p-1 rounded-lg">
                  <TabsTrigger 
                    value="daily" 
                    className="text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md data-[state=active]:font-medium"
                  >
                    Today
                  </TabsTrigger>
                  <TabsTrigger 
                    value="weekly"
                    className="text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md data-[state=active]:font-medium"
                  >
                    This Week
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="daily" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <TodoList frequency="daily" />
              </TabsContent>
              <TabsContent value="weekly" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <TodoList frequency="weekly" />
              </TabsContent>
            </Tabs>
          </Card>
        </motion.section>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="pt-1"
        >
          <LongTermGoalsCard />
        </motion.div>
        
        <motion.section
          custom={3}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="pb-6 pt-1"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3 px-1">Current Challenges</h2>
          <HurdlesButton />
        </motion.section>
      </div>
    </PageContainer>
  );
}
