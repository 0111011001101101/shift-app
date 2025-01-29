import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", session.user.id)
          .single();

        if (profile?.onboarding_completed) {
          navigate("/home");
        } else {
          navigate("/onboarding");
        }

        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case 'Password should be at least 6 characters.':
        return 'Please use a password that is at least 6 characters long.';
      case 'Invalid login credentials':
        return 'The email or password you entered is incorrect.';
      case 'Email not confirmed':
        return 'Please verify your email address before signing in.';
      case 'User not found':
        return 'No account found. Please sign up first.';
      default:
        return error.message;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50/80">
      <div className="max-w-md mx-auto px-6 py-12 min-h-screen flex flex-col">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-secondary-600 hover:text-secondary-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </motion.button>

        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 mb-12 flex items-center justify-center"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-accent">
              <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-medium tracking-tight text-black text-xl">SHIFT</span>
          </div>
        </motion.div>

        {/* Auth Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex flex-col justify-center -mt-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-br from-primary-600 via-primary-500 to-accent bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="text-lg text-secondary-600/90 font-medium">
              Continue your growth journey
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Auth Form */}
          <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl shadow-black/[0.03] border border-black/[0.05]">
            <SupabaseAuth 
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#F97316',
                      brandAccent: '#F97316',
                      brandButtonText: 'white',
                    },
                    radii: {
                      borderRadiusButton: '0.75rem',
                      buttonBorderRadius: '0.75rem',
                      inputBorderRadius: '0.75rem',
                    },
                    fonts: {
                      bodyFontFamily: `'Inter', system-ui, sans-serif`,
                      buttonFontFamily: `'Inter', system-ui, sans-serif`,
                      inputFontFamily: `'Inter', system-ui, sans-serif`,
                      labelFontFamily: `'Inter', system-ui, sans-serif`,
                    },
                  },
                },
                className: {
                  container: 'w-full',
                  button: 'w-full h-12 rounded-xl font-medium transition-colors duration-200',
                  input: 'w-full h-12 px-4 rounded-xl border border-black/[0.08] focus:ring-2 focus:ring-accent/20 bg-white/80',
                  message: 'text-sm text-red-500 mt-1',
                  divider: 'bg-black/[0.08]',
                  label: 'text-secondary-800 font-medium',
                  anchor: 'text-accent hover:text-accent/90 font-medium',
                },
              }}
              theme="light"
              providers={[]}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;