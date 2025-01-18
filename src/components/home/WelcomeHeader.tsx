import { ReactNode } from "react";
import { format } from "date-fns";

interface WelcomeHeaderProps {
  username?: string;
  children?: ReactNode;
}

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: "Good Morning",
      message: "Let's make today count"
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: "Good Afternoon",
      message: "Keep up the great work"
    };
  } else if (hour >= 17 && hour < 22) {
    return {
      greeting: "Good Evening",
      message: "Time to reflect on today's achievements"
    };
  } else {
    return {
      greeting: "Good Night",
      message: "Time to rest and recharge"
    };
  }
};

export function WelcomeHeader({ username = "there", children }: WelcomeHeaderProps) {
  const { greeting, message } = getTimeBasedGreeting();
  
  return (
    <div className="relative py-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl -z-10" />
      <div className="flex flex-col gap-1">
        <div className="space-y-1">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fadeIn relative inline-block">
              {greeting},
            </h1>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fadeIn relative inline-block">
              {username}
            </h1>
          </div>
          <p className="text-lg font-medium tracking-wide text-gray-600 dark:text-gray-300 bg-gradient-to-r from-secondary/80 to-primary/80 bg-clip-text text-transparent">
            {message}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}