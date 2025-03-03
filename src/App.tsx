
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { BottomNav } from "./components/layout/BottomNav";
import { FloatingChat } from "./components/chat/FloatingChat";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Goals from "./pages/Goals";
import StandUp from "./pages/StandUp";
import Hurdles from "./pages/Hurdles";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Learn from "./pages/Learn";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

// Demo mode banner
const DemoBanner = () => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary-500 to-accent text-white text-xs text-center py-1 font-medium">
    Demo Mode - Explore all features without login
  </div>
);

function AppContent() {
  const location = useLocation();
  const isPublicRoute = location.pathname === "/" || 
                       location.pathname === "/auth" || 
                       location.pathname === "/onboarding";
  
  // Demo mode is enabled
  const isDemoMode = true;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50/80 text-secondary-800 antialiased">
      {isDemoMode && <DemoBanner />}
      <div className={`mx-auto max-w-lg min-h-screen relative pb-20 ${isDemoMode ? 'pt-6' : ''}`}>
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
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
        {(!isPublicRoute || isDemoMode) && (
          <>
            <FloatingChat />
            <BottomNav />
          </>
        )}
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
