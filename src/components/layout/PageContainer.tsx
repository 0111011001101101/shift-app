import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main 
      className={`mx-auto px-4 py-6 min-h-[calc(100vh-5rem)] space-y-6 animate-fadeIn ${className}`}
    >
      <div className="glass p-6 rounded-xl shadow-sm">
        {children}
      </div>
    </main>
  );
}