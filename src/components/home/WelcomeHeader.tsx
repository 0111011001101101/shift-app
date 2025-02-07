
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StandUpDialog } from "../stand-up/StandUpDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface WelcomeHeaderProps {
  username?: string;
  children?: React.ReactNode;
}

export function WelcomeHeader({ username = "there", children }: WelcomeHeaderProps) {
  const [showStandUp, setShowStandUp] = useState(false);
  
  const { data: todayStandUp, isLoading } = useQuery({
    queryKey: ["todayStandUp"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const { data, error } = await supabase
        .from("stand_ups")
        .select("*")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .gte("created_at", today.toISOString())
        .lt("created_at", tomorrow.toISOString())
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <div className="relative py-6 px-1">
        <div className="flex items-center gap-5 mb-8">
          <Avatar className="h-14 w-14 ring-2 ring-violet-100/50 shadow-md">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gradient-to-br from-violet-50 to-violet-100/80 text-violet-700 font-semibold text-lg">
              {username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold bg-gradient-to-br from-violet-800 via-violet-700 to-violet-600 bg-clip-text text-transparent">
              Good morning, {username}
            </h1>
            <p className="text-sm text-violet-600/60 mt-1 font-medium">Let's make today count</p>
          </div>
        </div>
        <div className="relative">
          {children}
        </div>
      </div>

      <StandUpDialog 
        open={showStandUp} 
        onOpenChange={setShowStandUp}
        completed={todayStandUp?.completed}
        standUpData={todayStandUp}
      />
    </>
  );
}
