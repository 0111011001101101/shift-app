import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main className={`mx-auto px-4 py-6 min-h-[calc(100vh-5rem)] animate-fadeIn ${className}`}>
      <div className="relative">
        {/* Decorative background elements */}
        <div className="fixed inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-primary-600/5 pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-500/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative">
          {children}
        </div>
      </div>
    </main>
  );
}