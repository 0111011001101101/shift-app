import { Home, Target, AlertTriangle, MessageCircle, BookOpen, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Target, label: "Goals", path: "/goals" },
  { icon: AlertTriangle, label: "Hurdles", path: "/hurdles" },
  { icon: MessageCircle, label: "Coach", path: "/coach" },
  { icon: BookOpen, label: "Learn", path: "/learn" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass py-2 px-6 animate-slideUp z-50">
      <div className="max-w-lg mx-auto flex justify-between items-center">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center transition-all duration-200 ${
                isActive
                  ? "text-primary scale-105"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className={`w-[18px] h-[18px] mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}