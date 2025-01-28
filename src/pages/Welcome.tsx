import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Users, ChevronRight } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-black">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-black">SHIFT</span>
        </div>
        <button 
          onClick={() => navigate("/auth")}
          className="text-sm font-medium px-4 py-2 rounded-lg text-black hover:bg-black/5 transition-colors"
        >
          Log in
        </button>
      </motion.nav>

      <div className="px-6 py-12 max-w-md mx-auto space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-black">
            Your Mind,{" "}
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Unleashed
            </span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Take control of your mental well-being with a pocket psychologist designed for high achievers.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { icon: <Brain className="w-5 h-5" />, label: "AI Coach" },
            { icon: <Users className="w-5 h-5" />, label: "Community" },
          ].map((feature, index) => (
            <div
              key={feature.label}
              className="p-6 rounded-2xl bg-black/[0.02] hover:bg-black/[0.04] transition-colors border border-black/5 flex flex-col items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                <div className="text-white">{feature.icon}</div>
              </div>
              <span className="text-sm font-medium text-black">{feature.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <button
            onClick={() => navigate("/auth")}
            className="w-full h-14 rounded-2xl bg-black text-white font-medium 
                     flex items-center justify-center gap-2 
                     hover:bg-black/90 active:bg-black/95 transition-colors"
          >
            Get started
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => navigate("/auth")}
            className="w-full h-14 rounded-2xl border border-black/10 font-medium text-black
                     hover:bg-black/[0.02] active:bg-black/[0.05] transition-colors"
          >
            Learn more
          </button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pt-8 space-y-6"
        >
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-black/[0.02] border border-black/5">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-black
                             flex items-center justify-center text-xs font-medium text-white"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-black">10,000+</span> leaders trust SHIFT
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-black/40" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}