import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-secondary-600">
          {currentStep + 1}/{steps.length}
        </span>
        <span className="text-sm font-medium text-primary-600">
          {steps[currentStep]}
        </span>
      </div>
    </div>
  );
}