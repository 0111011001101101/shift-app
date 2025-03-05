
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  withPadding?: boolean;
}

export function PageContainer({ 
  children, 
  className = "", 
  withPadding = true 
}: PageContainerProps) {
  return (
    <motion.main 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] // Custom easing for smoother animation
      }}
      className={`
        min-h-screen bg-gradient-to-br from-white to-gray-50/80
        ${withPadding ? 'px-5 py-6 pb-24' : 'pb-20'} 
        max-w-lg mx-auto 
        ${className}
      `}
    >
      {children}
    </motion.main>
  );
}
