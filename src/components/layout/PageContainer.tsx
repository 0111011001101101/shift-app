import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main 
      className={`max-w-lg mx-auto px-4 py-6 min-h-screen pb-24 space-y-6 animate-fadeIn ${className}`}
    >
      {children}
    </main>
  );
}