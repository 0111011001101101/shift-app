
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Target, AlertTriangle, BookOpen, Settings } from "lucide-react";

const navItems = [
  {
    label: "Home",
    icon: Home,
    href: "/home",
    gradient: "from-primary-500 to-primary-600"
  },
  {
    label: "Goals",
    icon: Target,
    href: "/goals",
    gradient: "from-accent to-orange-500"
  },
  {
    label: "Hurdles",
    icon: AlertTriangle,
    href: "/hurdles",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    label: "Learn",
    icon: BookOpen,
    href: "/learn",
    gradient: "from-emerald-500 to-emerald-600"
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    gradient: "from-gray-500 to-gray-600"
  },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-md pb-safe-area-inset-bottom">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ label, icon: Icon, href, gradient }) => {
            const isActive = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-300",
                  isActive 
                    ? `bg-gradient-to-br ${gradient} text-white` 
                    : "text-gray-400 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isActive ? "text-white" : "text-inherit"
                )} />
                <span className={cn(
                  "text-xs font-medium transition-all",
                  isActive ? "font-semibold" : ""
                )}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
