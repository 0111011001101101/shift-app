import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50/50">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative px-4 sm:px-6 py-6 pb-24 max-w-lg mx-auto space-y-6 ${className}`}
      >
        {children}
      </motion.main>
    </div>
  );
}