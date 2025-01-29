import { useState, useEffect } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

export default function Auth() {
  const [isLoading] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <div className="min-h-screen bg-white">
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
        <SupabaseAuth 
          supabaseClient={supabase}
          view={mode === "sign-up" ? "sign_up" : "sign_in"}
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
              button: '!p-3 !rounded-xl',
              input: '!p-3 !rounded-xl',
            }
          }}
          providers={[]}
          onError={(error) => {
            toast({
              title: "Authentication Error",
              description: error.message,
              variant: "destructive",
            });
          }}
        />
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