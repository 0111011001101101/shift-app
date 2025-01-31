import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-6 px-2">
      <div className="relative flex justify-between items-center">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary-100/30 via-secondary-100/50 to-secondary-100/30 -translate-y-1/2 rounded-full" />
        
        {/* Progress line */}
        <motion.div 
          className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-primary-400 via-primary-500 to-accent 
                     -translate-y-1/2 rounded-full shadow-sm shadow-primary-500/10"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        {/* Step indicators */}
        <div className="relative flex justify-between w-full">
          {steps.map((_, index) => (
            <motion.div 
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: index <= currentStep ? 1 : 0.8,
                opacity: 1
              }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.1
              }}
              className="relative group"
            >
              <div 
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300 border",
                  index <= currentStep
                    ? "bg-gradient-to-r from-primary-400 to-primary-500 border-white shadow-sm shadow-primary-400/20"
                    : "bg-white border-secondary-200"
                )}
              />
              {index <= currentStep && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -inset-1.5 rounded-full bg-primary-400/20 animate-pulse"
                />
              )}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-1.5 py-0.5 rounded-md bg-white/90 backdrop-blur-sm shadow-sm border border-secondary-100/30 text-[10px] text-secondary-600 whitespace-nowrap">
                  {steps[index]}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}