
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
      <div className="space-y-8 pb-24 max-w-screen-sm mx-auto">
        <WelcomeHeader username={profile?.first_name} />
        
        <StreakCard streak={profile?.streak || 0} standUpTime={profile?.stand_up_time} />

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-secondary-800 px-1 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center shadow-sm">
              <CalendarClock className="w-4 h-4 text-primary-600" />
            </div>
            Today's Focus
          </h2>
          <div className="rounded-xl bg-white shadow-md overflow-hidden border border-primary-100/30 hover:shadow-lg transition-all duration-300">
            <TodoList frequency="daily" />
          </div>
        </section>

        <LongTermGoalsCard />
        
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-secondary-800 px-1 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shadow-sm">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            Overcome Challenges
          </h2>
          <HurdlesButton />
        </section>
      </div>
    </PageContainer>
  );
}
