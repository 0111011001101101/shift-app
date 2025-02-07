
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Target, AlertTriangle, BookOpen, Settings } from "lucide-react";

const navItems = [
  {
    label: "Home",
    icon: Home,
    href: "/home",
    gradient: "from-violet-600 to-violet-500"
  },
  {
    label: "Goals",
    icon: Target,
    href: "/goals",
    gradient: "from-violet-500 to-violet-400"
  },
  {
    label: "Hurdles",
    icon: AlertTriangle,
    href: "/hurdles",
    gradient: "from-violet-600 to-violet-500"
  },
  {
    label: "Learn",
    icon: BookOpen,
    href: "/learn",
    gradient: "from-violet-500 to-violet-400"
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    gradient: "from-violet-400 to-violet-300"
  },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-t border-violet-100/20 pb-safe-area-inset-bottom shadow-lg">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map(({ label, icon: Icon, href, gradient }) => {
            const isActive = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl transition-all duration-300",
                  isActive 
                    ? `bg-gradient-to-br ${gradient} text-white shadow-lg scale-110` 
                    : "text-violet-600/50 hover:text-violet-600/70 hover:bg-violet-50/50"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isActive ? "text-white" : "text-inherit"
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
