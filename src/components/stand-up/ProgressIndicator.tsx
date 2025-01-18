import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full mb-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              index <= currentStep
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400"
            )}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-12 mx-2",
                index < currentStep
                  ? "bg-primary"
                  : "bg-gray-100 dark:bg-gray-800"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}