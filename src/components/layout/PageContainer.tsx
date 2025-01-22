import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main className={`container px-4 py-6 min-h-[calc(100vh-5rem)] ${className}`}>
      {children}
    </main>
  );
}