import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Target, AlertTriangle, BookOpen, Settings } from "lucide-react";

const navItems = [
  {
    label: "Home",
    icon: Home,
    href: "/home",
    gradient: "from-[#007BFF] to-[#00C6FF]"
  },
  {
    label: "Goals",
    icon: Target,
    href: "/goals",
    gradient: "from-[#FF8C42] to-[#F97316]"
  },
  {
    label: "Hurdles",
    icon: AlertTriangle,
    href: "/hurdles",
    gradient: "from-[#9B51E0] to-[#7928CA]"
  },
  {
    label: "Learn",
    icon: BookOpen,
    href: "/learn",
    gradient: "from-[#3DDC97] to-[#2ECC71]"
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    gradient: "from-gray-600 to-gray-500"
  },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-black/[0.02] pb-safe-area-inset-bottom">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map(({ label, icon: Icon, href, gradient }) => {
            const isActive = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-300",
                  isActive 
                    ? `bg-gradient-to-br ${gradient} text-white shadow-lg scale-110` 
                    : "text-black/60 hover:text-black/80 hover:bg-black/[0.02]"
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