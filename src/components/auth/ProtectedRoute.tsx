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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking auth...");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session:", session);
        setSession(session);

        if (!session) {
          console.log("No session, redirecting to auth");
          navigate("/auth");
          setIsLoading(false);
          return;
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        console.log("Profile:", profile);
        console.log("Profile error:", profileError);

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setIsLoading(false);
          return;
        }

        setProfile(profile);

        // Handle routing based on onboarding status
        if (!profile?.onboarding_completed && location.pathname !== "/onboarding") {
          console.log("Redirecting to onboarding");
          navigate("/onboarding");
        } else if (profile?.onboarding_completed && location.pathname === "/onboarding") {
          console.log("Redirecting to home");
          navigate("/home");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      setSession(session);
      
      if (!session) {
        console.log("No session after auth change");
        navigate("/auth");
        return;
      }

      // Fetch user profile on auth state change
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile on auth change:", profileError);
        return;
      }

      console.log("Profile after auth change:", profile);
      setProfile(profile);

      // Handle routing based on onboarding status
      if (!profile?.onboarding_completed && location.pathname !== "/onboarding") {
        console.log("Redirecting to onboarding after auth change");
        navigate("/onboarding");
      } else if (profile?.onboarding_completed && location.pathname === "/onboarding") {
        console.log("Redirecting to home after auth change");
        navigate("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

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

  if (!session) {
    return null;
  }

  return <>{children}</>;
};