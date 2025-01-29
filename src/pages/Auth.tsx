import { useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Auth() {
  const [isLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/95 to-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-black/[0.02]"
      >
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 via-primary-400 to-accent shadow-sm">
            <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-medium tracking-tight text-black">SHIFT</span>
        </div>
      </motion.nav>

      <div className="px-6 pt-28 pb-12 max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-secondary-600">Sign in to continue your journey</p>
          </div>

          <div className="card-container">
            <SupabaseAuth 
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#0EA5E9',
                      brandAccent: '#0284C7',
                    }
                  }
                },
                className: {
                  container: 'w-full',
                  button: '!p-3 !rounded-xl !font-medium',
                  input: '!p-3 !rounded-xl !border-gray-200',
                  label: '!font-medium !text-secondary-700',
                  message: '!text-sm !text-secondary-600',
                  anchor: '!text-primary-600 !font-medium hover:!text-primary-700',
                }
              }}
              providers={[]}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Email address',
                    password_label: 'Password',
                    button_label: 'Sign in',
                    loading_button_label: 'Signing in...',
                    social_provider_text: 'Sign in with {{provider}}',
                    link_text: "Already have an account? Sign in",
                  },
                  sign_up: {
                    email_label: 'Email address',
                    password_label: 'Create password',
                    button_label: 'Create account',
                    loading_button_label: 'Creating account...',
                    social_provider_text: 'Sign up with {{provider}}',
                    link_text: "Don't have an account? Sign up",
                  },
                },
              }}
            />
          </div>
        </motion.div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-xl">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}