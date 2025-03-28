import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUp, Target, Shield, Sparkles, Calendar } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();
  
  return <div className="min-h-screen bg-white">
      <motion.nav initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-black/[0.02]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent">
            <ArrowUp className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-medium tracking-tight text-black">SHIFT</span>
        </div>
        <button onClick={() => navigate("/onboarding")} className="text-sm font-medium px-4 py-2 rounded-lg text-black/70 hover:text-black transition-colors">
          Try it out
        </button>
      </motion.nav>

      <div className="px-6 pt-24 pb-12 max-w-md mx-auto space-y-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="space-y-4">
          <h1 className="text-[2rem] leading-[1.1] font-medium tracking-tight text-black">
            <span className="bg-gradient-to-r from-primary-500 to-accent bg-clip-text text-transparent">Healthier Habits</span>
          </h1>
          <div>
            <p className="text-lg sm:text-xl leading-tight font-medium bg-gradient-to-r from-black/70 to-black/60 bg-clip-text text-transparent">
              A mental health &amp;<br className="sm:hidden" /> productivity app in one.
            </p>
          </div>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="grid grid-cols-1 gap-4">
          {[{
          icon: <Calendar className="w-6 h-6 stroke-[1.5]" />,
          label: "Daily Stand-ups",
          description: "Track your progress daily",
          bgClass: "from-primary-500/90 to-primary-600",
          iconBgClass: "from-white/20 to-white/5"
        }, {
          icon: <Target className="w-6 h-6 stroke-[1.5]" />,
          label: "Smart Goals",
          description: "Set and achieve your goals",
          bgClass: "from-accent/90 to-accent",
          iconBgClass: "from-white/20 to-white/5"
        }, {
          icon: <Shield className="w-6 h-6 stroke-[1.5]" />,
          label: "Hurdle Management",
          description: "Overcome your challenges",
          bgClass: "from-purple-500/90 to-purple-500",
          iconBgClass: "from-white/20 to-white/5"
        }, {
          icon: <Sparkles className="w-6 h-6 stroke-[1.5]" />,
          label: "Task Management",
          description: "Keep track of your daily tasks",
          bgClass: "from-emerald-500/90 to-emerald-500",
          iconBgClass: "from-white/20 to-white/5"
        }].map((feature, index) => <motion.div key={feature.label} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2 + index * 0.1
        }} className={`p-6 rounded-2xl bg-gradient-to-br ${feature.bgClass}
                       hover:shadow-lg transition-all duration-300 group
                       hover:-translate-y-1`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.iconBgClass} 
                              flex items-center justify-center backdrop-blur-sm
                              group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-medium text-white">{feature.label}</span>
                  <span className="text-sm text-white/90">{feature.description}</span>
                </div>
              </div>
            </motion.div>)}
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.6
      }} className="space-y-6">
          <p className="text-secondary-400 text-sm leading-relaxed text-center">
            Experience success without sacrificing well-being, make the shift.
          </p>
          
          <button onClick={() => navigate("/onboarding")} className="w-full h-14 rounded-2xl bg-black text-white font-medium 
                     flex items-center justify-center gap-2 
                     hover:bg-black/90 active:bg-black/95 transition-colors">
            Get started
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.7
        }} className="relative py-4">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.02] to-transparent" />
            
            <div className="relative flex flex-col items-center gap-3">
              <div className="flex -space-x-1.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-xs font-medium text-primary-700 ring-2 ring-white">E</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/10 to-accent/20 flex items-center justify-center text-xs font-medium text-accent ring-2 ring-white">L</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-xs font-medium text-purple-700 ring-2 ring-white">H</div>
              </div>
              
              <p className="text-center text-sm text-black/60 font-medium px-4 leading-relaxed">Join our growing community</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>;
}
