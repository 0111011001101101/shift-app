import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Bell, Clock, LogOut, Moon, Palette } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/auth");
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        
        <div className="space-y-4">
          {/* Stand-up Time */}
          <Button 
            variant="outline" 
            className="w-full justify-start"
            disabled
          >
            <Clock className="mr-2 h-4 w-4" />
            Stand-up Time
            <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>
          </Button>

          {/* Notifications */}
          <Button 
            variant="outline" 
            className="w-full justify-start"
            disabled
          >
            <Bell className="mr-2 h-4 w-4" />
            Notifications
            <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>
          </Button>

          {/* Appearance */}
          <Button 
            variant="outline" 
            className="w-full justify-start"
            disabled
          >
            <Palette className="mr-2 h-4 w-4" />
            Appearance
            <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>
          </Button>

          {/* Dark Mode */}
          <Button 
            variant="outline" 
            className="w-full justify-start"
            disabled
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark Mode
            <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>
          </Button>

          {/* Logout Button */}
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}