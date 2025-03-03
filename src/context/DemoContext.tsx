
import React, { createContext, useContext, useState } from "react";

interface DemoContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
}

const DemoContext = createContext<DemoContextType>({
  isDemoMode: true, // Default to true for testing
  toggleDemoMode: () => {},
});

export const useDemoMode = () => useContext(DemoContext);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  const toggleDemoMode = () => {
    setIsDemoMode(prev => !prev);
  };

  return (
    <DemoContext.Provider value={{ isDemoMode, toggleDemoMode }}>
      {children}
    </DemoContext.Provider>
  );
};
