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
import Onboarding from "./pages

Let's clean up the signup flow by removing the standalone `/signup` page and keeping only the signup functionality within the Auth component. This will make the flow more consistent.

<lov-code>
First, let's update App.tsx to remove the /signup route and update the navigation in Welcome.tsx to point to /auth:

<lov-write file_path="src/App.tsx">
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

function AppContent() {
  const location = useLocation();
  const isPublicRoute = location.pathname === "/" || 
                       location.pathname === "/auth" || 
                       location.pathname === "/onboarding";

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50/80 text-secondary-800 antialiased">
      <div className="mx-auto max-w-lg min-h-screen relative pb-20">
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
        {!isPublicRoute && (
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