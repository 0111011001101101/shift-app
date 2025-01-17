import { Home, Target, Barrier, MessageCircle, BookOpen, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Target, label: "Goals", path: "/goals" },
  { icon: Barrier, label: "Hurdles", path: "/hurdles" },
  { icon: MessageCircle, label: "Coach", path: "/coach" },
  { icon: BookOpen, label: "Learn", path: "/learn" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
      <div className="max-w-lg mx-auto flex justify-between items-center">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`nav-item ${location.pathname === path ? "active" : "text-gray-500"}`}
          >
            <Icon className="w-6 h-6" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}