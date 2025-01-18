import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Target, Brain } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-2xl mx-auto animate-fadeIn">
          <div className="inline-flex items-center justify-center p-2 bg-primary/5 rounded-full mb-4">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Welcome to SHIFT
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
              Your AI-powered companion for peak performance and mental clarity
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Daily Stand-ups</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Goal Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>AI Coaching</span>
            </div>
          </div>

          <Button 
            onClick={() => navigate("/auth")} 
            className="px-8 py-6 text-lg rounded-full bg-primary hover:bg-primary/90 text-white"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center p-6">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Join ambitious leaders who use SHIFT to stay focused and resilient
        </p>
      </div>
    </div>
  );
}