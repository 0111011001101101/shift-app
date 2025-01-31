import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#2A2F3C] to-[#1A1F2C]">
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`px-6 py-12 max-w-lg mx-auto space-y-8 ${className}`}
      >
        {children}
      </motion.main>
    </div>
  );
}