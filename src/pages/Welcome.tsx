import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUp, Brain, Target, Sparkles, Shield } from "lucide-react";

export default function Welcome() {
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent">
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

      <div className="px-6 pt-24 pb-12 max-w-md mx-auto space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-[2.5rem] leading-[1.1] font-medium tracking-tight text-black">
            Your mind,{" "}
            <span className="bg-gradient-to-r from-primary-500 to-accent bg-clip-text text-transparent">
              unleashed
            </span>
          </h1>
          <p className="text-black/70 text-lg leading-relaxed font-medium">
            Take control of your mental well-being with a pocket psychologist designed for high achievers.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 gap-4"
        >
          {[
            { 
              icon: <Brain className="w-6 h-6" />,
              label: "AI Coach",
              description: "24/7 personalized guidance",
              bgClass: "from-primary-500 to-primary-400",
              textColor: "text-white"
            },
            { 
              icon: <Target className="w-6 h-6" />,
              label: "Daily Growth",
              description: "Track progress effortlessly",
              bgClass: "from-accent to-orange-400",
              textColor: "text-white"
            },
            { 
              icon: <Sparkles className="w-6 h-6" />,
              label: "Quick Check-ins",
              description: "5-min morning stand-ups",
              bgClass: "from-purple-500 to-purple-400",
              textColor: "text-white"
            },
            { 
              icon: <Shield className="w-6 h-6" />,
              label: "Hurdle Management",
              description: "Turn blocks into stepping stones",
              bgClass: "from-emerald-500 to-emerald-400",
              textColor: "text-white"
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${feature.bgClass}
                       hover:shadow-lg transition-all duration-300 group
                       hover:-translate-y-1`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center 
                              group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                  <div className={`${feature.textColor}`}>{feature.icon}</div>
                </div>
                <div className="flex flex-col">
                  <span className={`text-lg font-medium ${feature.textColor}`}>{feature.label}</span>
                  <span className={`text-sm ${feature.textColor}/90`}>{feature.description}</span>
                </div>
              </div>
            </motion.div>
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
        </motion.div>
      </div>
    </div>
  );
}