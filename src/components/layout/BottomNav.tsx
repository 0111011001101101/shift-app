
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Target, AlertTriangle, BookOpen, MessageCircle } from "lucide-react";
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
    label: "Coach",
    icon: MessageCircle,
    href: "/coach",
  },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-safe-area-inset-bottom shadow-lg"
    >
      <div className="mx-auto max-w-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className="flex flex-col items-center justify-center relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute top-0 left-[50%] w-12 h-1 bg-primary rounded-b-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ translateX: "-50%" }}
                  />
                )}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full w-10 h-10 transition-all duration-300",
                    isActive 
                      ? "text-primary bg-primary-50 scale-110" 
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive && "stroke-[2.5px]"
                  )} />
                </div>
                <span className={cn(
                  "text-[10px] mt-0.5 font-medium transition-colors duration-300",
                  isActive 
                    ? "text-primary" 
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
