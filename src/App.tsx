import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "./components/layout/BottomNav";
import Home from "./pages/Home";
import Goals from "./pages/Goals";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/hurdles" element={<div className="page-container">Hurdles Page (Coming Soon)</div>} />
          <Route path="/coach" element={<div className="page-container">Coach Page (Coming Soon)</div>} />
          <Route path="/learn" element={<div className="page-container">Learn Page (Coming Soon)</div>} />
          <Route path="/settings" element={<div className="page-container">Settings Page (Coming Soon)</div>} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;