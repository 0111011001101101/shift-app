import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

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
            <Star className="w-5 h-5 text-white" />
          </div>
          <span className="font-light tracking-tight text-black">SHIFT</span>
        </div>
        <button 
          onClick={() => navigate("/auth")}
          className="text-sm font-light px-4 py-2 rounded-lg text-black/70 hover:text-black transition-colors"
        >
          Sign in
        </button>
      </motion.nav>

      <div className="px-6 pt-24 pb-12 max-w-md mx-auto space-y-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-[2.5rem] leading-[1.1] font-light tracking-tight text-black">
            Your mind,{" "}
            <span className="bg-gradient-to-r from-primary-500 to-accent bg-clip-text text-transparent">
              unleashed
            </span>
          </h1>
          <p className="text-black/70 text-lg leading-relaxed font-light">
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
            { 
              icon: <Star className="w-5 h-5" />, 
              label: "AI Coach",
              bgClass: "bg-gradient-to-br from-primary-500/10 via-primary-400/5 to-transparent"
            },
            { 
              icon: <ArrowRight className="w-5 h-5" />, 
              label: "Daily Growth",
              bgClass: "bg-gradient-to-br from-accent/10 via-accent/5 to-transparent"
            },
          ].map((feature) => (
            <div
              key={feature.label}
              className={`p-6 rounded-2xl ${feature.bgClass} hover:shadow-lg transition-all duration-300
                       border border-black/[0.03] flex flex-col items-center gap-3 group`}
            >
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center 
                            group-hover:scale-110 transition-transform duration-300">
                <div className="text-white">{feature.icon}</div>
              </div>
              <span className="text-sm font-light text-black/80">{feature.label}</span>
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
            className="w-full h-14 rounded-2xl bg-black text-white font-light 
                     flex items-center justify-center gap-2 
                     hover:bg-black/90 active:bg-black/95 transition-colors"
          >
            Get started
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => navigate("/auth")}
            className="w-full h-14 rounded-2xl border border-black/[0.08] font-light 
                     text-black/80 hover:text-black
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
          className="pt-8"
        >
          <div className="flex items-center justify-between px-5 py-4 rounded-2xl 
                        bg-gradient-to-br from-primary-500/5 via-transparent to-accent/5
                        border border-black/[0.03] hover:shadow-lg
                        transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white 
                             bg-gradient-to-br from-primary-500 to-accent
                             flex items-center justify-center text-xs font-light text-white
                             shadow-sm group-hover:scale-105 transition-transform duration-300"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-black/60 font-light">
                Join <span className="font-normal text-black">10,000+</span> leaders
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-black/40 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}