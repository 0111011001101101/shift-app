import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "./components/layout/BottomNav";
import { FloatingChat } from "./components/chat/FloatingChat";
import Home from "./pages/Home";
import Goals from "./pages/Goals";
import StandUp from "./pages/StandUp";
import Hurdles from "./pages/Hurdles";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-foreground antialiased">
        <div className="mx-auto max-w-lg min-h-screen relative pb-20">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/stand-up" element={<StandUp />} />
              <Route path="/hurdles" element={<Hurdles />} />
              <Route path="/coach" element={
                <div className="page-container glass p-6 m-4 rounded-xl">
                  <h1 className="text-2xl font-semibold mb-4">AI Coach</h1>
                  <p className="text-muted-foreground">Coming Soon</p>
                </div>
              } />
              <Route path="/learn" element={
                <div className="page-container glass p-6 m-4 rounded-xl">
                  <h1 className="text-2xl font-semibold mb-4">Learn</h1>
                  <p className="text-muted-foreground">Coming Soon</p>
                </div>
              } />
              <Route path="/settings" element={
                <div className="page-container glass p-6 m-4 rounded-xl">
                  <h1 className="text-2xl font-semibold mb-4">Settings</h1>
                  <p className="text-muted-foreground">Coming Soon</p>
                </div>
              } />
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