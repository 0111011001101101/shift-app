
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "./BottomNav";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-white">
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`relative px-5 py-6 pb-24 max-w-lg mx-auto ${className}`}
      >
        {children}
      </motion.main>
      <BottomNav />
    </div>
  );
}
