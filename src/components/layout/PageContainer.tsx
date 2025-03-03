
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "./BottomNav";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`relative px-4 py-5 pb-24 max-w-lg mx-auto ${className}`}
      >
        {children}
      </motion.main>
      <BottomNav />
    </div>
  );
}
