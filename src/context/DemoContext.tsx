
import { createContext, useContext, ReactNode, useState } from "react";

interface DemoContextType {
  isDemoMode: boolean;
  demoUserId: string;
}

// Create a fixed demo user ID for consistent data in demo mode
const DEMO_USER_ID = "demo-user-123";

const DemoContext = createContext<DemoContextType>({
  isDemoMode: false,
  demoUserId: "",
});

export const useDemoContext = () => useContext(DemoContext);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  // Always enable demo mode for easier testing
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
