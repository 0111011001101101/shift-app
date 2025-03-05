
import { PageContainer } from "@/components/layout/PageContainer";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { StreakCard } from "@/components/home/StreakCard";
import { TodoSection } from "@/components/home/TodoSection";
import { LongTermGoalsCard } from "@/components/home/LongTermGoalsCard";
import { HurdlesButton } from "@/components/home/HurdlesButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Home() {
  const { toast } = useToast();
  
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

        <motion.div 
          custom={1}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <TodoSection />
        </motion.div>

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
