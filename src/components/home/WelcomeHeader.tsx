import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle } from "lucide-react";

interface WelcomeHeaderProps {
  username?: string;
  children?: ReactNode;
}

export function WelcomeHeader({ username = "there", children }: WelcomeHeaderProps) {
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
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="relative py-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl -z-10" />
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fadeIn relative inline-block">
              Hi {username}!
            </h1>
            <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              Pro Member
            </span>
          </div>
          <p className="text-lg font-medium tracking-wide text-gray-600 dark:text-gray-300">
            Your mental fitness journey is trending upward 📈
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <span className="text-sm font-medium">Today's Stand-up:</span>
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-24 rounded-full" />
          ) : todayStandUp ? (
            todayStandUp.completed ? (
              <div className="flex items-center gap-1 px-3 py-1 bg-success/10 text-success rounded-full text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-3 py-1 bg-warning/10 text-warning rounded-full text-sm">
                <XCircle className="w-4 h-4" />
                <span>Not done yet</span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 bg-warning/10 text-warning rounded-full text-sm">
              <XCircle className="w-4 h-4" />
              <span>Not started</span>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}