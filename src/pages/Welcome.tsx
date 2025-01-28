import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Target, Shield, Sparkles, BarChart, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50/80">
      <div className="flex flex-col items-center justify-between min-h-screen">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center w-full px-6 py-12">
          {/* Animated Logo */}
          <MotionDiv
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary-200 rounded-[2rem] rotate-12 opacity-20" />
              <div className="absolute -top-2 -left-2 w-20 h-20 bg-primary-300 rounded-[2rem] rotate-6 opacity-40" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-[2rem] flex items-center justify-center shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
            </div>
          </MotionDiv>

          {/* Text Content */}
          <MotionDiv
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-6 max-w-sm mb-12"
          >
            <h1 className="text-5xl font-bold tracking-tight leading-tight">
              Your Mind,{" "}
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent bg-clip-text text-transparent">
                Unleashed
              </span>
            </h1>
            <p className="text-lg text-secondary-600">
              The pocket psychologist helping leaders achieve peak performance
            </p>
          </MotionDiv>

          {/* Feature Grid */}
          <MotionDiv
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12"
          >
            {[
              {
                icon: <Target className="w-5 h-5 text-primary-600" />,
                title: "Daily Goals",
                description: "Track your progress",
                gradient: "from-primary-500/10 to-primary-600/5",
              },
              {
                icon: <Shield className="w-5 h-5 text-secondary-600" />,
                title: "Mental Health",
                description: "Stay resilient",
                gradient: "from-secondary-500/10 to-secondary-600/5",
              },
              {
                icon: <BarChart className="w-5 h-5 text-accent" />,
                title: "Performance",
                description: "Reach new heights",
                gradient: "from-accent/10 to-accent/5",
              },
              {
                icon: <Zap className="w-5 h-5 text-warning-DEFAULT" />,
                title: "AI Coach",
                description: "24/7 guidance",
                gradient: "from-warning-DEFAULT/10 to-warning-DEFAULT/5",
              },
            ].map((feature, index) => (
              <MotionDiv
                key={feature.title}
                variants={item}
                className={`glass p-4 space-y-2 bg-gradient-to-br ${feature.gradient}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="text-xs text-secondary-600">{feature.description}</p>
              </MotionDiv>
            ))}
          </MotionDiv>

          {/* Social Proof */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="flex -space-x-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-secondary-100 to-secondary-200"
                />
              ))}
            </div>
            <div className="text-sm">
              <span className="font-semibold">10,000+</span>{" "}
              <span className="text-secondary-600">leaders trust SHIFT</span>
            </div>
          </MotionDiv>

          {/* CTA Buttons */}
          <MotionDiv
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4 w-full max-w-sm px-6"
          >
            <Button 
              onClick={() => navigate("/auth")} 
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 hover:opacity-90 text-white font-medium shadow-lg shadow-primary-500/20"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <button
              onClick={() => navigate("/auth")}
              className="w-full text-sm text-secondary-600 hover:text-secondary-800 transition-colors"
            >
              Already on the path? Sign in
            </button>
          </MotionDiv>
        </div>

        {/* Footer */}
        <MotionDiv
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-full py-8 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-sm"
        >
          <div className="max-w-sm mx-auto px-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center gap-2 text-primary-600">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Join the community</span>
            </div>
            <p className="text-xs text-secondary-500 font-medium italic">
              "The only way to do great work is to love what you do"
            </p>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}