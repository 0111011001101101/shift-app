import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUp, Brain, Target, Shield, Sparkles, Rocket, BrainCog, ClipboardCheck, Activity } from "lucide-react";
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
          <div className="p-2 rounded-xl bg-accent">
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
          <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight">
            Shift your <span className="text-accent">mind</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-md mx-auto font-medium leading-relaxed">
            Productivity and mental wellness tools crafted for high achievers who are always on the go but strive for a healthier path forward
          </p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate("/auth")}
            className="px-8 py-4 bg-accent text-white rounded-xl font-medium 
                     hover:bg-accent/90 active:bg-accent/95 transition-colors
                     flex items-center gap-2 mx-auto shadow-lg shadow-accent/20"
          >
            Get started
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {[
            {
              icon: <BrainCog className="w-6 h-6" />,
              title: "Smart AI Coach",
              description: "24/7 personalized guidance that evolves with you"
            },
            {
              icon: <Activity className="w-6 h-6" />,
              title: "Growth Tracking",
              description: "Quick daily check-ins to maintain momentum"
            },
            {
              icon: <Rocket className="w-6 h-6" />,
              title: "Obstacle Navigator",
              description: "Turn challenges into opportunities"
            },
            {
              icon: <ClipboardCheck className="w-6 h-6" />,
              title: "Progress Dashboard",
              description: "Track your journey with clear metrics"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (index * 0.1) }}
              className="p-6 rounded-2xl border border-black/[0.08] hover:border-black/[0.16] 
                       hover:shadow-lg transition-all duration-300 group bg-white"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-black/[0.03] flex items-center justify-center 
                            group-hover:scale-110 transition-transform duration-300">
                  <div className="text-accent">{feature.icon}</div>
                </div>
                <div>
                  <h3 className="font-medium text-black">{feature.title}</h3>
                  <p className="text-sm text-black/60">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center gap-2 justify-center">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-xs font-medium">A</div>
              <div className="w-8 h-8 rounded-full bg-primary-300 flex items-center justify-center text-xs font-medium">B</div>
              <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center text-xs font-medium">C</div>
            </div>
            <p className="text-sm text-black/60 font-medium flex items-center gap-2">
              Join 10,000+ leaders
              <ArrowRight className="w-4 h-4" />
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;