import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUp, Brain, Target, Shield, Sparkles } from "lucide-react";
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

      <div className="px-6 pt-24 pb-12 max-w-lg mx-auto space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Your pocket psychologist for{" "}
            <span className="text-accent">high achievers</span>
          </h1>
          <p className="text-lg text-black/70 max-w-md mx-auto">
            Daily mental wellness and growth tools designed for entrepreneurs and leaders who never stand still.
          </p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate("/auth")}
            className="px-8 py-4 bg-accent text-white rounded-xl font-medium 
                     hover:bg-accent/90 active:bg-accent/95 transition-colors
                     flex items-center gap-2 mx-auto"
          >
            Get started
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {[
            {
              icon: <Brain className="w-6 h-6" />,
              title: "AI Coach",
              description: "24/7 personalized guidance"
            },
            {
              icon: <Target className="w-6 h-6" />,
              title: "Quick Stand-ups",
              description: "5-min daily check-ins"
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "Hurdle Management",
              description: "Turn blocks into progress"
            },
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "Growth Tracking",
              description: "Monitor your journey"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + (index * 0.1) }}
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
          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white bg-accent
                           flex items-center justify-center text-xs font-medium text-white"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-black/60">
              Join <span className="font-semibold text-black">10,000+</span> leaders
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;