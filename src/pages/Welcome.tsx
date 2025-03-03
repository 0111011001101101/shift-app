
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gradient-to-b from-primary-50 via-white to-primary-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-12"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-6"
        >
          <div className="flex justify-center">
            <div className="h-12 flex items-center justify-center font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent">
              SHIFT
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900">
            Welcome to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent">
              SHIFT
            </span>
          </h1>
          <p className="text-secondary-600">
            Your pocket psychologist and motivator designed to help ambitious individuals keep moving forward—healthier and stronger.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-4"
        >
          <Button
            onClick={() => navigate("/auth")}
            className="w-full py-6 text-base font-medium bg-gradient-to-r from-primary-500 to-accent hover:from-primary-600 hover:to-accent/90 text-white shadow-md transition-all"
          >
            Get Started
          </Button>
          
          <Button
            onClick={() => navigate("/home")}
            variant="outline"
            className="w-full py-6 text-base font-medium bg-white hover:bg-primary-50 text-primary-600 border-primary-200 shadow-md transition-all"
          >
            Explore Demo
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
