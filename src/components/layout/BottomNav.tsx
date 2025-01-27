import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Target, AlertTriangle, BookOpen, Settings } from "lucide-react";

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-200/20 pb-safe-area-inset-bottom">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-around px-2">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 py-2 px-3 transition-all duration-200",
                  isActive 
                    ? "text-primary-600" 
                    : "text-gray-400 hover:text-gray-600 active:text-gray-800"
                )}
              >
                <Icon className={cn(
                  "h-6 w-6 transition-transform duration-200",
                  isActive && "scale-110"
                )} />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}