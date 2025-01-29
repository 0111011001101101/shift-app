import { useState } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Auth() {
  const [isLoading] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-black/[0.02]"
      >
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent">
            <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-medium tracking-tight text-black">SHIFT</span>
        </div>
      </motion.nav>

      <div className="px-6 pt-28 pb-12 max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8 space-y-3"
        >
          <h1 className="text-2xl font-bold">Welcome to SHIFT</h1>
          <p className="text-secondary-600">
            Your personal space for growth and mental well-being. Join our community of entrepreneurs and leaders.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100"
        >
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
                container: 'w-full space-y-4',
                button: '!p-3 !rounded-xl !font-medium',
                input: '!p-3 !rounded-xl !bg-white',
                divider: '!my-6',
                message: 'text-sm text-secondary-600 mb-4',
                label: '!font-medium !text-secondary-700',
              }
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email address',
                  password_label: 'Your password',
                  button_label: 'Sign in to your account',
                },
                sign_up: {
                  email_label: 'Email address',
                  password_label: 'Create a password',
                  button_label: 'Create your account',
                }
              }
            }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-6 text-sm text-secondary-500"
        >
          By signing up, you agree to our Terms of Service and Privacy Policy
        </motion.p>
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