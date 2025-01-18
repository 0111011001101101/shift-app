import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-6">
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-muted via-muted to-muted rounded-full -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full transition-all duration-500 -translate-y-1/2"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 relative z-10",
                  index <= currentStep
                    ? "bg-gradient-to-br from-primary to-secondary text-white shadow-lg scale-110"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </div>
              <span className="text-[10px] mt-1 text-muted-foreground font-medium">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}