export const containerVariants = {
  hidden: { 
    opacity: 0,
    y: 20 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.15
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { 
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

export const itemVariants = {
  hidden: { 
    opacity: 0,
    y: 15
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};