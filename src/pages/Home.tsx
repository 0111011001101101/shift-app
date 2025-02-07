
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
    <PageContainer className="bg-gray-50/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 max-w-lg mx-auto px-4"
      >
        <WelcomeHeader username={profile?.first_name}>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4"
          >
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="w-full h-auto grid grid-cols-4 gap-1 p-1 bg-gray-100/80 rounded-xl">
                <TabsTrigger 
                  value="today" 
                  className="py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-violet-700 rounded-lg transition-all duration-200 shadow-none data-[state=active]:shadow-sm"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger 
                  value="week" 
                  className="py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-violet-700 rounded-lg transition-all duration-200 shadow-none data-[state=active]:shadow-sm"
                >
                  Week
                </TabsTrigger>
                <TabsTrigger 
                  value="month" 
                  className="py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-violet-700 rounded-lg transition-all duration-200 shadow-none data-[state=active]:shadow-sm"
                >
                  Month
                </TabsTrigger>
                <TabsTrigger 
                  value="year" 
                  className="py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-violet-700 rounded-lg transition-all duration-200 shadow-none data-[state=active]:shadow-sm"
                >
                  Year
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-6 space-y-4">
                <TabsContent value="today" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                  <TodoList frequency="daily" />
                </TabsContent>
                
                <TabsContent value="week" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                  <TodoList frequency="weekly" />
                </TabsContent>

                <TabsContent value="month" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                  <div className="text-center py-8 text-gray-500">
                    Coming soon
                  </div>
                </TabsContent>

                <TabsContent value="year" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                  <div className="text-center py-8 text-gray-500">
                    Coming soon
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </WelcomeHeader>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <GoalsSection />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pb-20"
        >
          <HurdlesButton />
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
