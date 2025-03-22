import { PageContainer } from "@/components/layout/PageContainer";
import { Brain, Clock, Target, ThumbsUp, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export default function Learn() {
  const navigate = useNavigate();
  const upcomingModules = [{
    title: "Managing Burnout",
    description: "Learn proven techniques to identify, prevent and recover from burnout",
    icon: ThumbsUp,
    estimatedMinutes: 15,
    gradient: "from-blue-500 to-indigo-600"
  }, {
    title: "Overcoming Imposter Syndrome",
    description: "Build confidence and overcome self-doubt with evidence-based strategies",
    icon: Target,
    estimatedMinutes: 12,
    gradient: "from-orange-500 to-amber-600"
  }, {
    title: "Peak Performance Routines",
    description: "Design your ideal day for maximum productivity and wellness",
    icon: Clock,
    estimatedMinutes: 18,
    gradient: "from-emerald-500 to-teal-600"
  }];
  return <PageContainer className="max-w-4xl">
      <div className="space-y-8 animate-fadeIn">
        {/* Header Section */}
        <div className="text-center space-y-4 px-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#9b87f5] via-[#7E69AB] to-[#D6BCFA] blur-md opacity-75" />
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-3 sm:p-4">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-[#9b87f5] animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] via-[#7E69AB] to-[#D6BCFA]">
            Learn & Grow
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Explore curated content designed to help you overcome challenges and achieve your goals
          </p>
        </div>

        {/* Featured Module */}
        <div className="px-4">
          <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-[#9b87f5]/90 to-[#D6BCFA]/90 text-white">
            <div className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="bg-white/20 w-fit p-2 rounded-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">Mental Resilience </h2>
                <p className="text-white/80">
                  A comprehensive guide to maintaining peak mental performance while avoiding burnout
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center text-white/90 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>20 min</span>
                  </div>
                </div>
                <Button className="bg-white text-[#9b87f5] hover:bg-white/90 mt-2 w-full sm:w-auto" size="sm">
                  <span>View Preview</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Modules */}
        <div className="px-4 space-y-4">
          <h2 className="text-lg font-semibold px-1">Upcoming Modules</h2>
          <div className="grid gap-4">
            {upcomingModules.map((module, index) => <motion.div key={module.title} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2 + index * 0.1
          }}>
                <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${module.gradient} text-white`}>
                        <module.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-800">{module.title}</h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {module.estimatedMinutes} min
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>)}
          </div>
        </div>

        {/* Feature Preview Section */}
        <div className="px-4 pt-4 pb-8">
          <Card className="border border-primary-100 bg-primary-50/30 p-6">
            <div className="text-center space-y-4">
              <div className="bg-primary-100 text-primary-700 mx-auto rounded-full w-12 h-12 flex items-center justify-center">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Full Learning Experience Coming Soon</h3>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                We're developing comprehensive learning modules with expert insights and interactive exercises to boost your mental resilience.
              </p>
              <Button variant="outline" className="bg-white border-primary-200 text-primary-700 hover:bg-primary-50" onClick={() => navigate('/settings')}>
                Learn More in Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>;
}