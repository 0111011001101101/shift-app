
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
      <div className="space-y-7 pb-24 max-w-screen-sm mx-auto">
        <WelcomeHeader username={profile?.first_name} />
        
        <StreakCard streak={profile?.streak || 0} standUpTime={profile?.stand_up_time} />

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-secondary-800 px-1 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
              <CalendarClock className="w-3.5 h-3.5 text-primary-600" />
            </div>
            Today's Focus
          </h2>
          <div className="rounded-xl bg-white shadow-md overflow-hidden border border-primary-100/30">
            <TodoList frequency="daily" />
          </div>
        </section>

        <LongTermGoalsCard />
        
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-secondary-800 px-1 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
            </div>
            Overcome Challenges
          </h2>
          <HurdlesButton />
        </section>
      </div>
    </PageContainer>
  );
}
