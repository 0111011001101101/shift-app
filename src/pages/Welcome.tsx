import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Target, Shield, Sparkles, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 via-white to-primary-50/80">
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-primary-500/10 rounded-2xl mb-4 animate-float">
            <Brain className="w-8 h-8 text-primary-500" />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent bg-clip-text text-transparent">SHIFT</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-md mx-auto leading-relaxed">
              Your AI-powered companion for peak performance and mental clarity
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto px-4">
            <div className="card p-6 space-y-3">
              <div className="inline-flex items-center justify-center p-2 bg-primary-100 rounded-xl">
                <Target className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-semibold text-secondary-800">Daily Stand-ups</h3>
              <p className="text-sm text-secondary-600">Track your progress and stay accountable</p>
            </div>

            <div className="card p-6 space-y-3">
              <div className="inline-flex items-center justify-center p-2 bg-secondary-100 rounded-xl">
                <Shield className="w-5 h-5 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-secondary-800">Goal Tracking</h3>
              <p className="text-sm text-secondary-600">Set and achieve meaningful milestones</p>
            </div>

            <div className="card p-6 space-y-3">
              <div className="inline-flex items-center justify-center p-2 bg-accent/10 rounded-xl">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-secondary-800">AI Coaching</h3>
              <p className="text-sm text-secondary-600">Get personalized guidance 24/7</p>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <Button 
              onClick={() => navigate("/auth")} 
              className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary-600 to-primary-500 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              Get Started
              <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-sm text-secondary-500">
              Join ambitious leaders who use SHIFT to stay focused and resilient
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center p-8 bg-white/50 backdrop-blur-sm border-t border-primary-100/20">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm font-medium text-secondary-600">
            "The only way to do great work is to love what you do." - Steve Jobs
          </p>
        </div>
      </footer>
    </div>
  );
}