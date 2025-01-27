import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50/80 text-secondary-800 antialiased">
        <div className="mx-auto max-w-lg min-h-screen relative pb-20">
          <div className="fixed inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white to-transparent pointer-events-none z-10" />
          <div className="fixed inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white to-transparent pointer-events-none z-10" />
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
            <FloatingChat />
            <BottomNav />
          </BrowserRouter>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;