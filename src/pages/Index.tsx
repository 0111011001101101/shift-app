import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUp, Brain, Sparkles, Target, Clock } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
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
        <button 
          onClick={() => navigate("/auth")}
          className="text-sm font-medium px-4 py-2 rounded-lg text-black/70 hover:text-black transition-colors"
        >
          Sign in
        </button>
      </motion.nav>

      <div className="px-6 pt-28 pb-12 max-w-lg mx-auto space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-8"
        >
          <div className="flex justify-center gap-1 mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-medium">
              E
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-medium">
              L
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-medium">
              H
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Mental Wellness Meets Peak Performance
            </h1>
            <p className="text-lg text-black/70 max-w-md mx-auto font-medium leading-relaxed">
              Your all-in-one companion for balancing mental health and productivity
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50"
            >
              <div className="mb-3 p-2 rounded-xl bg-purple-500/10 w-fit">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-medium text-purple-900 mb-2">Mental Health</h3>
              <p className="text-sm text-purple-700/70">Daily check-ins, mood tracking, and AI coaching support</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50"
            >
              <div className="mb-3 p-2 rounded-xl bg-blue-500/10 w-fit">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-medium text-blue-900 mb-2">Productivity</h3>
              <p className="text-sm text-blue-700/70">Goal tracking, task management, and progress insights</p>
            </motion.div>
          </div>

          <div className="pt-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-accent text-white rounded-xl font-medium 
                       hover:bg-accent/90 active:bg-accent/95 transition-colors
                       flex items-center gap-2 mx-auto shadow-lg shadow-accent/20"
            >
              Get started
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>5 min setup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI-powered</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;