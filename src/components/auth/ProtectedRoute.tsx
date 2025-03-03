
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Tables } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  
  // For demonstration mode - bypass authentication
  const isDemoMode = true;

  useEffect(() => {
    let mounted = true;

    // Skip authentication in demo mode
    if (isDemoMode) {
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          if (mounted) {
            setIsLoading(false);
            setSession(null);
          }
          navigate("/auth", { replace: true });
          return;
        }

        if (mounted) {
          setSession(session);
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select()
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (mounted) {
          setProfile(profile);
        }

        if (!profile?.onboarding_completed && location.pathname !== "/onboarding") {
          navigate("/onboarding", { replace: true });
        } else if (profile?.onboarding_completed && location.pathname === "/onboarding") {
          navigate("/home", { replace: true });
        }

      } catch (error) {
        console.error("Auth check error:", error);
        if (mounted) {
          setSession(null);
          setProfile(null);
        }
        navigate("/auth", { replace: true });
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted || isDemoMode) return;

      setSession(session);

      if (!session) {
        setProfile(null);
        navigate("/auth", { replace: true });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select()
        .eq("id", session.user.id)
        .maybeSingle();

      if (mounted) {
        setProfile(profile);
      }

      if (!profile?.onboarding_completed && location.pathname !== "/onboarding") {
        navigate("/onboarding", { replace: true });
      } else if (profile?.onboarding_completed && location.pathname === "/onboarding") {
        navigate("/home", { replace: true });
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [navigate, location.pathname, isDemoMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50/90 via-white to-primary-50/80">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-400 to-accent shadow-xl mb-4">
          <Loader2 className="w-7 h-7 text-white animate-spin" strokeWidth={2.5} />
        </div>
        <p className="text-secondary-600 animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  // In demo mode, always render children
  if (isDemoMode || session) {
    return <>{children}</>;
  }

  navigate("/auth", { replace: true });
  return null;
};
