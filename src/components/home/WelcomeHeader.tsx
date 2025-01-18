import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeHeaderProps {
  username?: string;
  children?: ReactNode;
}

export function WelcomeHeader({ username = "there", children }: WelcomeHeaderProps) {
  const navigate = useNavigate();
  const { data: todayStandUp } = useQuery({
    queryKey: ["todayStandUp"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from("stand_ups")
        .select("*")
        .gte("created_at", today.toISOString())
        .lt("created_at", new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString())
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  return (
    <div className="relative py-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl -z-10" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fadeIn relative inline-block">
              Hi {username}!
            </h1>
            <p className="text-lg font-medium tracking-wide text-gray-600 dark:text-gray-300 bg-gradient-to-r from-secondary/80 to-primary/80 bg-clip-text text-transparent">
              Let's make things happen
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/goals")}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            View Goals
          </Button>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
          <span className="text-sm font-medium">Today's Stand-up:</span>
          {todayStandUp?.completed ? (
            <div className="flex items-center gap-1 px-3 py-1 bg-success/10 text-success rounded-full text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 bg-warning/10 text-warning rounded-full text-sm">
              <XCircle2 className="w-4 h-4" />
              <span>Not done yet</span>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}