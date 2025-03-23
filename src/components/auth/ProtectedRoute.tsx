
import { ReactNode } from "react";
import { useDemoMode } from "@/context/DemoContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  // Enable demo mode by default to bypass authentication
  const { isDemoMode } = useDemoMode();
  
  // Always render children, bypassing authentication
  return <>{children}</>;
};
