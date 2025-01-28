import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUp, Brain, Target, Sparkles, Shield } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-black/[0.02]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-accent">
            <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-medium tracking-tight text-black">SHIFT</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container max-w-lg mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-secondary-900">
              Welcome to SHIFT
            </h1>
            <p className="text-xl text-secondary-600">
              Your pocket psychologist for high achievers
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Feature Cards */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-secondary-50 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-900">Daily Check-ins</h3>
              <p className="text-sm text-secondary-600">Track your mental well-being with quick morning stand-ups</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-secondary-50 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-900">Goal Setting</h3>
              <p className="text-sm text-secondary-600">Set and track meaningful goals with AI guidance</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-secondary-50 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-900">AI Coach</h3>
              <p className="text-sm text-secondary-600">Get personalized guidance whenever you need it</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-secondary-50 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-secondary-900">Privacy First</h3>
              <p className="text-sm text-secondary-600">Your data is encrypted and secure</p>
            </motion.div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={() => navigate("/auth")}
              className="w-full bg-accent text-white rounded-xl px-6 py-3 font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}