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
    <nav className="fixed bottom-4 left-4 right-4 glass rounded-2xl py-3 px-6 animate-slideUp z-50">
      <div className="max-w-lg mx-auto flex justify-between items-center">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`nav-item transition-all duration-200 ${
              location.pathname === path
                ? "text-secondary scale-110"
                : "text-white/60 hover:text-white/90"
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}