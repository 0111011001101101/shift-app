import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-white">
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`px-6 pt-12 pb-12 max-w-md mx-auto space-y-12 ${className}`}
      >
        {/* Content */}
        <div className="relative">
          {children}
        </div>
      </motion.main>
    </div>
  );
}