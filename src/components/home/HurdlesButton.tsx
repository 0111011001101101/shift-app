import { Button } from "@/components/ui/button";
import { Lock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HurdlesButton() {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full group relative overflow-hidden"
      onClick={() => navigate("/hurdles")}
    >
      <div className="absolute inset-0 bg-destructive/5 group-hover:bg-destructive/10 transition-colors" />
      <div className="relative flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-destructive" />
          <span className="text-destructive font-medium">View Current Hurdles</span>
        </div>
        <ChevronRight className="w-4 h-4 text-destructive" />
      </div>
    </Button>
  );
}