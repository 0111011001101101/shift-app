import { Button } from "@/components/ui/button";
import { Lock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HurdlesButton() {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full group relative overflow-hidden hover:scale-[1.02] transition-all duration-300"
      onClick={() => navigate("/hurdles")}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 via-destructive/10 to-destructive/5 group-hover:from-destructive/10 group-hover:via-destructive/15 group-hover:to-destructive/10 transition-colors" />
      <div className="relative flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-destructive/10 rounded-lg">
            <Lock className="w-4 h-4 text-destructive" />
          </div>
          <span className="text-destructive font-medium">View Current Hurdles</span>
        </div>
        <ChevronRight className="w-4 h-4 text-destructive group-hover:translate-x-1 transition-transform" />
      </div>
    </Button>
  );
}