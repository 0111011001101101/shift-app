
import { createContext, useContext, ReactNode, useState } from "react";

interface DemoContextType {
  isDemoMode: boolean;
  demoUserId: string;
}

// Create a fixed demo user ID for consistent data in demo mode
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

const DemoContext = createContext<DemoContextType>({
  isDemoMode: false,
  demoUserId: "",
});

export const useDemoContext = () => useContext(DemoContext);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  // In a real app, you might want to check a query param or localStorage
  // For our purposes, we'll make demo mode always enabled
  const [isDemoMode] = useState(true);
  
  const value = {
    isDemoMode,
    demoUserId: DEMO_USER_ID,
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};
