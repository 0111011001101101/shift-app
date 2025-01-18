import { ReactNode } from "react";

interface WelcomeHeaderProps {
  username?: string;
  children?: ReactNode;
}

export function WelcomeHeader({ username = "there", children }: WelcomeHeaderProps) {
  return (
    <div className="relative py-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl -z-10" />
      <div className="flex flex-col gap-1">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fadeIn relative inline-block">
            Hi {username}!
          </h1>
          <p className="text-lg font-medium tracking-wide text-gray-600 dark:text-gray-300 bg-gradient-to-r from-secondary/80 to-primary/80 bg-clip-text text-transparent">
            Let's make things happen
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}