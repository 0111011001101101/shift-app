import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const handleAuth = async (type: "LOGIN" | "SIGNUP") => {
    try {
      setLoading(true);
      setError(null);

      const { error } =
        type === "LOGIN"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (error) throw error;

      toast({
        title: type === "LOGIN" ? "Welcome back!" : "Account created!",
        description:
          type === "LOGIN"
            ? "You've successfully signed in."
            : "Please check your email to verify your account.",
      });

      if (type === "LOGIN") {
        navigate("/home");
      }
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50/80">
      <div className="mx-auto max-w-md px-6 py-12 min-h-screen">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
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

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {/* Auth Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 px-4 rounded-2xl border border-black/[0.08] bg-white/80 backdrop-blur-sm
                       text-black placeholder:text-secondary-400
                       focus:outline-none focus:ring-2 focus:ring-primary-500/20
                       disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-4 rounded-2xl border border-black/[0.08] bg-white/80 backdrop-blur-sm
                       text-black placeholder:text-secondary-400
                       focus:outline-none focus:ring-2 focus:ring-primary-500/20
                       disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            />
            <button
              onClick={() => handleAuth("LOGIN")}
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-black text-white font-medium 
                       hover:bg-black/90 active:bg-black/95 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Sign in"}
            </button>
            <button
              onClick={() => handleAuth("SIGNUP")}
              disabled={loading}
              className="w-full h-14 rounded-2xl border border-black/[0.08] font-medium 
                       text-black/80 hover:text-black
                       hover:bg-black/[0.02] active:bg-black/[0.05] transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create account
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;