
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
import { CalendarClock } from "lucide-react";

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
      <div className="space-y-4 pb-24 max-w-screen-sm mx-auto px-1">
        <WelcomeHeader username={profile?.first_name} />
        
        <StreakCard streak={profile?.streak || 0} standUpTime={profile?.stand_up_time} />

        <section className="space-y-2">
          <h2 className="text-base font-medium text-gray-700 px-1 flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
              <CalendarClock className="w-3 h-3 text-primary-600" />
            </div>
            Today's Focus
          </h2>
          <div className="rounded-xl bg-white shadow-sm overflow-hidden">
            <TodoList frequency="daily" />
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-gray-700 px-1">Goals & Growth</h2>
          <GoalsSection />
        </section>
        
        <section className="space-y-2">
          <h2 className="text-base font-medium text-gray-700 px-1">Overcome Challenges</h2>
          <HurdlesButton />
        </section>
      </div>
    </PageContainer>
  );
}
