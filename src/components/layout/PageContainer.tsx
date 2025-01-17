import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main className={`page-container pb-20 space-y-6 ${className}`}>
      {children}
    </main>
  );
}