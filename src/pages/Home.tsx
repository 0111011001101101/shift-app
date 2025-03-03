
import { PageContainer } from "@/components/layout/PageContainer";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { StreakCard } from "@/components/home/StreakCard";
import { TodoList } from "@/components/home/TodoList";
import { LongTermGoalsCard } from "@/components/home/LongTermGoalsCard";
import { HurdlesButton } from "@/components/home/HurdlesButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CalendarClock, AlertTriangle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { motion } from "framer-motion";

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
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }
    })
  };

  return (
    <PageContainer>
      <div className="space-y-7 pb-24 max-w-screen-sm mx-auto">
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
          className="space-y-4"
        >
          <h2 className="text-base font-semibold text-secondary-800 px-1 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center shadow-sm">
              <CalendarClock className="w-4 h-4 text-primary-600" />
            </div>
            Focus
          </h2>
          <div className="rounded-xl bg-white shadow-md overflow-hidden border border-primary-100/30 hover:shadow-lg transition-all duration-300">
            <Tabs 
              defaultValue="daily" 
              value={focusTab} 
              onValueChange={(value) => setFocusTab(value as "daily" | "weekly")}
              className="w-full"
            >
              <div className="px-3 pt-3 border-b border-primary-100/30">
                <TabsList className="bg-primary-50/50 w-full grid grid-cols-2 h-9">
                  <TabsTrigger 
                    value="daily" 
                    className="text-sm data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:font-medium"
                  >
                    Today
                  </TabsTrigger>
                  <TabsTrigger 
                    value="weekly"
                    className="text-sm data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:font-medium"
                  >
                    This Week
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="daily" className="mt-0">
                <TodoList frequency="daily" />
              </TabsContent>
              <TabsContent value="weekly" className="mt-0">
                <TodoList frequency="weekly" />
              </TabsContent>
            </Tabs>
          </div>
        </motion.section>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <LongTermGoalsCard />
        </motion.div>
        
        <motion.section
          custom={3}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="space-y-4"
        >
          <h2 className="text-base font-semibold text-secondary-800 px-1 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shadow-sm">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            Overcome Challenges
          </h2>
          <HurdlesButton />
        </motion.section>
      </div>
    </PageContainer>
  );
}
