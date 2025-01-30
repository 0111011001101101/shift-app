import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="relative flex justify-between items-center">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-secondary-100 -translate-y-1/2 rounded-full" />
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-primary-400 to-primary-500 transition-all duration-500 -translate-y-1/2 rounded-full"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between w-full">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300 relative",
                index <= currentStep
                  ? "bg-gradient-to-r from-primary-400 to-primary-500 scale-100"
                  : "bg-secondary-100 scale-90"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}