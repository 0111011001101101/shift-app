import { PageContainer } from "@/components/layout/PageContainer";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { TodoList } from "@/components/home/TodoList";
import { GoalsSection } from "@/components/home/GoalsSection";
import { HurdlesButton } from "@/components/home/HurdlesButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <PageContainer className="bg-[#F8F7FF]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <WelcomeHeader username={profile?.first_name} />

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white shadow-sm border border-gray-100"
          >
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="w-full h-auto flex items-center gap-1 p-2 bg-transparent border-b">
                <TabsTrigger 
                  value="today" 
                  className="flex-1 py-2.5 text-sm data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 rounded-xl transition-all duration-200"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger 
                  value="week" 
                  className="flex-1 py-2.5 text-sm data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 rounded-xl transition-all duration-200"
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
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GoalsSection />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pb-24"
          >
            <HurdlesButton />
          </motion.div>
        </div>
      </motion.div>
    </PageContainer>
  );
}