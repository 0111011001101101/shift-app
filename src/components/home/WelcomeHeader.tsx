
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatGreeting } from "@/lib/utils";

interface WelcomeHeaderProps {
  username?: string;
}

export function WelcomeHeader({ username }: WelcomeHeaderProps) {
  const navigate = useNavigate();
  const greeting = formatGreeting();
  const [showTip, setShowTip] = useState(false);
  
  // Demo mode is enabled
  const isDemoMode = true;

  // Initials for avatar
  const initials = username
    ? username.charAt(0).toUpperCase()
    : "D"; // "D" for Demo if no username

  // Demo name for display
  const displayName = username || "Explorer";

  return (
    <motion.div 
      className="flex justify-between items-center mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h2 className="font-medium text-slate-500 mb-1 flex items-center">
          {greeting}
          {isDemoMode && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                    Demo
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">You're in demo mode. All features are available without login.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h2>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
          Hey, {displayName}
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        {!showTip && (
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full relative"
            onClick={() => setShowTip(true)}
          >
            <Bell className="h-5 w-5 text-slate-500" />
            <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-violet-500" />
          </Button>
        )}
        
        {showTip && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-violet-100 text-violet-800 cursor-pointer"
            onClick={() => setShowTip(false)}
          >
            <Info className="h-3 w-3" />
            <span>Stand-up reminder</span>
            <ChevronRight className="h-3 w-3" />
          </motion.div>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer bg-primary-100 hover:bg-primary-200 transition-colors border-2 border-white">
              <AvatarFallback className="bg-gradient-to-r from-primary-500 to-accent text-white font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            {isDemoMode && (
              <DropdownMenuItem onClick={() => navigate("/")}>
                Exit Demo
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
