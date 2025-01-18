import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-6">
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-800 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary transition-all -translate-y-1/2"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors relative z-10",
                  index <= currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                )}
              >
                {index + 1}
              </div>
              <span className="text-[10px] mt-1 text-muted-foreground">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}