import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

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

      <div className="px-6 pt-28 pb-12 max-w-lg mx-auto space-y-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-10"
        >
          {/* Logo circles */}
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

          <p className="text-xl text-black/70 max-w-md mx-auto font-medium leading-relaxed">
            Join our growing community of high achievers, entrepreneurs and leaders
          </p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-accent text-white rounded-xl font-medium 
                     hover:bg-accent/90 active:bg-accent/95 transition-colors
                     flex items-center gap-2 mx-auto shadow-lg shadow-accent/20"
          >
            Get started
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;