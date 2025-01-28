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

      <div className="px-6 pt-28 pb-12 max-w-lg mx-auto space-y-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-8"
        >
          <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight">
            Your pocket psychologist for{" "}
            <span className="text-accent">high achievers</span>
          </h1>
          <p className="text-lg sm:text-xl text-black/70 max-w-md mx-auto font-medium leading-relaxed">
            Daily mental wellness tools designed for entrepreneurs who never stand still
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
              icon: <Brain className="w-6 h-6" />,
              title: "AI Coach",
              description: "24/7 personalized guidance that adapts to your needs"
            },
            {
              icon: <Target className="w-6 h-6" />,
              title: "Daily Growth",
              description: "Track progress with 5-min morning check-ins"
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "Hurdle Management",
              description: "Transform challenges into stepping stones"
            },
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "Progress Tracking",
              description: "Visualize your mental wellness journey"
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
          <p className="text-sm text-black/60 font-medium">
            Start your mental wellness journey today
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;