import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { ArrowRight, Lock, Sparkles, Target, Shield } from "lucide-react";
import { motion } from "framer-motion";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Check if user has completed onboarding
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
      if (event === "SIGNED_OUT") {
        setErrorMessage("");
      }
      if (event === "USER_UPDATED") {
        const { error } = await supabase.auth.getSession();
        if (error) {
          setErrorMessage(getErrorMessage(error));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.message) {
        case 'Password should be at least 6 characters.':
          return 'Please use a password that is at least 6 characters long for better security.';
        case 'Invalid login credentials':
          return 'The email or password you entered is incorrect. Please try again.';
        case 'Email not confirmed':
          return 'Please verify your email address before signing in.';
        case 'User not found':
          return 'No account found with these credentials. Please sign up first.';
        default:
          if (error.message.includes('weak_password')) {
            return 'Please use a password that is at least 6 characters long for better security.';
          }
          return error.message;
      }
    }
    return error.message;
  };

  const features = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Goal Tracking",
      description: "Set and achieve your ambitious goals"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Mental Clarity",
      description: "Stay focused and resilient"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "AI Coaching",
      description: "24/7 personalized guidance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50/80">
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-6 max-w-2xl mx-auto animate-fadeIn"
        >
          <div className="inline-flex items-center justify-center p-2 bg-primary/5 rounded-full mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Welcome to <span className="gradient-text">SHIFT</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-md mx-auto leading-relaxed">
              Your AI-powered companion for peak performance and mental clarity
            </p>
          </div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="card-container"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="icon-container">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-secondary-800">{feature.title}</h3>
                  <p className="text-sm text-secondary-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-md animate-slideUp"
        >
          <div className="section-container">
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <SupabaseAuth 
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary))',
                      brandButtonText: 'white',
                    },
                    radii: {
                      borderRadiusButton: '1rem',
                      buttonBorderRadius: '1rem',
                      inputBorderRadius: '1rem',
                    },
                  },
                },
                className: {
                  container: 'w-full',
                  button: 'w-full px-4 py-3 rounded-xl font-medium transition-colors duration-200',
                  input: 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20',
                  message: 'text-sm text-red-500 mt-1',
                },
              }}
              theme="light"
              providers={[]}
            />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center p-6"
        >
          <p className="text-sm font-medium text-secondary-600">
            Join ambitious leaders who use SHIFT to stay focused and resilient
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;