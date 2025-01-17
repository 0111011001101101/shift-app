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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-4 backdrop-blur-lg bg-white/80 animate-slideUp">
      <div className="max-w-lg mx-auto flex justify-between items-center">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`nav-item transition-all duration-200 ${
              location.pathname === path
                ? "text-primary scale-110"
                : "text-muted-foreground hover:text-primary/80"
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