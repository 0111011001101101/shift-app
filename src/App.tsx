
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { BottomNav } from "./components/layout/BottomNav";
import { FloatingChat } from "./components/chat/FloatingChat";
import Home from "./pages/Home";
import Goals from "./pages/Goals";
import StandUp from "./pages/StandUp";
import Hurdles from "./pages/Hurdles";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Learn from "./pages/Learn";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import { DemoProvider } from "./context/DemoContext";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  
  // Routes that don't need the bottom navigation
  const isPublicRoute = location.pathname === "/" || 
                       location.pathname === "/auth" || 
                       location.pathname === "/onboarding";
                       
  // Routes that need the AI coach floating button
  const needsCoach = !isPublicRoute && location.pathname !== "/coach";

  return (
    <div className="min-h-screen bg-white text-secondary-800 antialiased">
      <div className="mx-auto max-w-lg min-h-screen relative">
        <Toaster />
        <Sonner />
        
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stand-up"
            element={
              <ProtectedRoute>
                <StandUp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hurdles"
            element={
              <ProtectedRoute>
                <Hurdles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn"
            element={
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach"
            element={
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
        
        {(!isPublicRoute) && <BottomNav />}
        {(needsCoach) && <FloatingChat />}
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DemoProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </DemoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
