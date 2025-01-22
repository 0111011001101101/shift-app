import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Bell, Clock, LogOut, Moon, Palette, ChevronRight } from "lucide-react";

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

  const settingsGroups = [
    {
      title: "Preferences",
      items: [
        {
          icon: Clock,
          label: "Stand-up Time",
          description: "Set your daily stand-up reminder",
          comingSoon: true,
        },
        {
          icon: Bell,
          label: "Notifications",
          description: "Manage your notification preferences",
          comingSoon: true,
        },
      ],
    },
    {
      title: "Appearance",
      items: [
        {
          icon: Palette,
          label: "Theme",
          description: "Customize your app appearance",
          comingSoon: true,
        },
        {
          icon: Moon,
          label: "Dark Mode",
          description: "Toggle dark mode on/off",
          comingSoon: true,
        },
      ],
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your app preferences and account settings
          </p>
        </div>

        {settingsGroups.map((group, index) => (
          <div key={group.title} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{group.title}</h2>
              <Separator className="mt-2" />
            </div>
            
            <div className="space-y-2">
              {group.items.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-between px-4 py-6 h-auto"
                  disabled={item.comingSoon}
                >
                  <div className="flex items-center space-x-4">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {item.comingSoon ? (
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                      Coming soon
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4">
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