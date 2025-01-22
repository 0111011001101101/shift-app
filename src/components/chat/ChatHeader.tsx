import { Button } from "@/components/ui/button";
import { Sparkles, Minimize2, Maximize2, X } from "lucide-react";

interface ChatHeaderProps {
  isMinimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

export function ChatHeader({ isMinimized, onMinimize, onClose }: ChatHeaderProps) {
  return (
    <div className="flex h-14 items-center justify-between px-4 bg-gradient-to-r from-gray-50/50 via-white/50 to-gray-50/50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50 border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <span className="font-medium text-gray-700 dark:text-gray-200">AI Coach</span>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMinimize}
          className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isMinimized ? (
            <Maximize2 className="h-4 w-4" />
          ) : (
            <Minimize2 className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}