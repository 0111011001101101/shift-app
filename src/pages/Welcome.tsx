import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Target, Shield, Sparkles, BarChart, Users, ArrowRight } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center px-6 py-4"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-primary-600" />
          <span className="font-semibold text-xl">SHIFT</span>
        </div>
        <button 
          onClick={() => navigate("/auth")}
          className="text-sm font-medium text-secondary-600 hover:text-secondary-800"
        >
          Log in
        </button>
      </motion.nav>

      {/* Feature Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-6 pt-8 pb-4 grid grid-cols-4 gap-4 max-w-md mx-auto"
      >
        {[
          { icon: <Target className="w-5 h-5" />, label: "Goals" },
          { icon: <Shield className="w-5 h-5" />, label: "Resilience" },
          { icon: <BarChart className="w-5 h-5" />, label: "Growth" },
          { icon: <Sparkles className="w-5 h-5" />, label: "AI Coach" },
        ].map((feature, index) => (
          <motion.div
            key={feature.label}
            variants={item}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/80 flex items-center justify-center">
              <div className="text-primary-600">{feature.icon}</div>
            </div>
            <span className="text-xs font-medium text-secondary-600">{feature.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-6 pt-8 text-center"
      >
        <div className="max-w-md mx-auto space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Your Mind,{" "}
            <span className="bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
              Unleashed
            </span>
          </h1>
          <p className="text-secondary-600 text-lg leading-relaxed">
            Take control of your mental well-being with a pocket psychologist designed for high achievers.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 space-y-4 max-w-sm mx-auto">
          <button
            onClick={() => navigate("/auth")}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium shadow-lg shadow-primary-500/20 hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Get started
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="w-full h-14 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm text-secondary-800 font-medium hover:bg-gray-50 transition-all duration-300"
          >
            Explore features
          </button>
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-100 to-primary-200"
                />
              ))}
            </div>
            <p className="text-sm text-secondary-600">
              <span className="font-semibold">10,000+</span> leaders trust SHIFT
            </p>
          </div>
          <p className="text-xs text-secondary-500 font-medium italic">
            "The only way to do great work is to love what you do"
          </p>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 py-8 bg-gradient-to-t from-primary-50/50 to-transparent"
      >
        <div className="max-w-sm mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center gap-2 text-primary-600">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Join the community</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}