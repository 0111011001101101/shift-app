
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Target, AlertTriangle, BookOpen, MessageSquare } from "lucide-react";

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
    icon: MessageSquare,
    href: "/coach",
  },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe-area-inset-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="mx-auto max-w-lg">
        <div className="grid grid-cols-5 h-14">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className="flex flex-col items-center justify-center"
              >
                <div className={cn(
                  "flex items-center justify-center mb-1",
                  isActive ? "text-primary-600" : "text-gray-400"
                )}>
                  <Icon className="w-[20px] h-[20px]" />
                </div>
                <span className={cn(
                  "text-[10px]",
                  isActive ? "text-primary-600 font-medium" : "text-gray-500"
                )}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
