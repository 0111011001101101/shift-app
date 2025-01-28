import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, MessageSquare, Sparkles } from "lucide-react";

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
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent">
            <Star className="w-5 h-5 text-white" />
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

      <div className="px-6 pt-24 pb-12 max-w-md mx-auto space-y-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-[2.5rem] leading-[1.1] font-medium tracking-tight text-black">
            Your mind,{" "}
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent bg-clip-text text-transparent font-medium">
              unleashed
            </span>
          </h1>
          <p className="text-black/70 text-lg leading-relaxed font-normal">
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
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] shadow-lg 
                         hover:shadow-xl transition-all duration-300 group">
            <div className="flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center 
                            group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-2">
                <span className="text-xl font-medium text-white">AI Coach</span>
                <p className="text-base font-normal text-white/90">24/7 guidance & support tailored to your journey</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#FB923C] shadow-lg
                         hover:shadow-xl transition-all duration-300 group">
            <div className="flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center 
                            group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-2">
                <span className="text-xl font-medium text-white">Daily Growth</span>
                <p className="text-base font-normal text-white/90">Track progress & celebrate achievements</p>
              </div>
            </div>
          </div>
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
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium 
                     flex items-center justify-center gap-2 
                     hover:shadow-lg active:opacity-90 transition-all"
          >
            Get started
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => navigate("/auth")}
            className="w-full h-14 rounded-2xl border border-black/[0.08] font-medium 
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
          <div className="flex items-center justify-between px-6 py-5 rounded-2xl 
                        bg-gradient-to-br from-primary-500/10 via-primary-400/5 to-accent/10
                        border border-primary-200/20 hover:shadow-lg
                        transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white 
                             bg-gradient-to-br from-primary-500 to-accent
                             flex items-center justify-center text-sm font-medium text-white
                             shadow-sm group-hover:scale-105 transition-transform duration-300"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-black/70 font-medium">
                Join <span className="font-semibold text-black">10,000+</span> leaders
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-black/40 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}