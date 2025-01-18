import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Smile, Users } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-fadeIn">
          <div className="flex justify-center space-x-4 mb-6">
            <Smile className="w-12 h-12 text-primary animate-pulse" />
            <Users className="w-12 h-12 text-secondary animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Welcome to Shift
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Your personal space for mindful moments and daily growth.
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 animate-slideUp">
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
                      brand: '#0A2463',
                      brandAccent: '#7E72F2',
                    },
                    radii: {
                      borderRadiusButton: '0.75rem',
                      buttonBorderRadius: '0.75rem',
                      inputBorderRadius: '0.75rem',
                    },
                  },
                },
                className: {
                  container: 'w-full',
                  button: 'w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200',
                  input: 'w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20',
                  message: 'text-sm text-red-500 mt-1',
                },
              }}
              theme="light"
              providers={[]}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center p-4 text-sm text-gray-500">
        <p>Start your mindful journey today</p>
      </div>
    </div>
  );
};

export default Auth;