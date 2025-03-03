
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Target, AlertTriangle, BookOpen, Settings } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  {
    label: "Home",
    icon: Home,
    href: "/home",
  },
  {
    label: "Goals",
    icon: Target,
    href: "/goals",
  },
  {
    label: "Hurdles",
    icon: AlertTriangle,
    href: "/hurdles",
  },
  {
    label: "Learn",
    icon: BookOpen,
    href: "/learn",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-100 pb-safe-area-inset-bottom shadow-lg shadow-black/[0.03]"
    >
      <div className="mx-auto max-w-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className="flex flex-col items-center justify-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex items-center justify-center mb-1 rounded-full p-1.5 transition-all duration-200",
                    isActive 
                      ? "text-primary-500 bg-primary-50" 
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive && "stroke-[2.5px]"
                  )} />
                </motion.div>
                <span className={cn(
                  "text-[10px]",
                  isActive 
                    ? "text-primary-500 font-medium" 
                    : "text-gray-500"
                )}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
