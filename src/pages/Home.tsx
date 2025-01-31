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
import { Brain, Activity, Sparkles, Shield } from "lucide-react";

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

  const features = [
    {
      icon: <Brain className="w-6 h-6 stroke-[1.5]" />,
      label: "AI Coach",
      description: "24/7 personalized guidance",
      bgClass: "from-[#0EA5E9] to-[#0284C7]",
    },
    {
      icon: <Activity className="w-6 h-6 stroke-[1.5]" />,
      label: "Daily Growth",
      description: "Track progress effortlessly",
      bgClass: "from-[#F97316] to-[#EA580C]",
    },
    {
      icon: <Sparkles className="w-6 h-6 stroke-[1.5]" />,
      label: "Quick Check-ins",
      description: "5-min morning stand-ups",
      bgClass: "from-[#8B5CF6] to-[#6D28D9]",
    },
    {
      icon: <Shield className="w-6 h-6 stroke-[1.5]" />,
      label: "Hurdle Management",
      description: "Turn blocks into stepping stones",
      bgClass: "from-[#10B981] to-[#059669]",
    }
  ];

  return (
    <PageContainer>
      <div className="space-y-6 animate-fadeIn">
        <WelcomeHeader username={profile?.first_name} />
        
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.label}
              className={`p-6 rounded-2xl bg-gradient-to-br ${feature.bgClass}
                       hover:shadow-lg transition-all duration-300 group
                       hover:-translate-y-1`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20
                              flex items-center justify-center backdrop-blur-sm
                              group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-medium text-white">{feature.label}</span>
                  <span className="text-sm text-white/90">{feature.description}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky -top-2 z-10 pt-4 pb-2">
          <StreakCard streak={profile?.streak || 0} standUpTime={profile?.stand_up_time} />
        </div>

        <div className="space-y-4 bg-gradient-to-br from-white via-gray-50/95 to-white rounded-3xl border border-primary-100/30 shadow-xl overflow-hidden backdrop-blur-lg">
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="w-full mb-4 bg-black/[0.02] border-b border-black/[0.08] p-1.5">
              <TabsTrigger 
                value="today" 
                className="flex-1 py-2.5 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                Today's To-Do
              </TabsTrigger>
              <TabsTrigger 
                value="week" 
                className="flex-1 py-2.5 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                Week's To-Do
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-2 focus-visible:outline-none focus-visible:ring-0 px-4 pb-4">
              <TodoList frequency="daily" />
            </TabsContent>
            
            <TabsContent value="week" className="mt-2 focus-visible:outline-none focus-visible:ring-0 px-4 pb-4">
              <TodoList frequency="weekly" />
            </TabsContent>
          </Tabs>
        </div>

        <div className="px-1">
          <GoalsSection />
        </div>
        
        <div className="px-1 pb-24">
          <HurdlesButton />
        </div>
      </div>
    </PageContainer>
  );
}