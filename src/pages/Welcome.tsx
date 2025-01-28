import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Target, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

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
            className="mb-12"
          >
            <div className="relative">
              {/* Stacked cards effect */}
              <div className="absolute top-2 -left-2 w-16 h-16 bg-primary-200 rounded-2xl rotate-6 opacity-20" />
              <div className="absolute top-1 -left-1 w-16 h-16 bg-primary-300 rounded-2xl rotate-3 opacity-40" />
              <div className="relative w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
          </MotionDiv>

          {/* Text Content */}
          <MotionDiv
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-6 max-w-sm"
          >
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to <span className="text-gradient">SHIFT</span>
            </h1>
            <p className="text-lg text-secondary-600">
              Your pocket psychologist for peak performance
            </p>
          </MotionDiv>

          {/* Feature Cards */}
          <MotionDiv
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-4 mt-12 w-full max-w-sm"
          >
            <div className="glass p-4 space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <Target className="w-4 h-4 text-primary-600" />
              </div>
              <h3 className="text-sm font-semibold">Daily Goals</h3>
              <p className="text-xs text-secondary-600">Track your progress</p>
            </div>

            <div className="glass p-4 space-y-2">
              <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-secondary-600" />
              </div>
              <h3 className="text-sm font-semibold">Mental Health</h3>
              <p className="text-xs text-secondary-600">Stay resilient</p>
            </div>
          </MotionDiv>

          {/* CTA Buttons */}
          <MotionDiv
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 space-y-4 w-full max-w-sm px-6"
          >
            <Button 
              onClick={() => navigate("/auth")} 
              className="w-full h-12 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-medium"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <button
              onClick={() => navigate("/auth")}
              className="w-full text-sm text-secondary-600 hover:text-secondary-800 transition-colors"
            >
              I Already Have an Account
            </button>
          </MotionDiv>
        </div>

        {/* Footer */}
        <MotionDiv
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-full py-6 bg-white/50 backdrop-blur-sm border-t border-primary-100/20"
        >
          <div className="max-w-sm mx-auto px-6 text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-700">Used by 10k+ leaders</span>
            </div>
            <p className="text-xs text-secondary-500">
              "The only way to do great work is to love what you do"
            </p>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}