import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Bell, Clock, LogOut, Moon, Palette, ChevronRight, Shield, User } from "lucide-react";

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
      description: "Customize your daily experience",
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
      description: "Customize how SHIFT looks",
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
    {
      title: "Account",
      description: "Manage your account settings",
      items: [
        {
          icon: User,
          label: "Profile",
          description: "Update your personal information",
          comingSoon: true,
        },
        {
          icon: Shield,
          label: "Privacy",
          description: "Control your data and privacy settings",
          comingSoon: true,
        },
      ],
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-8 animate-fadeIn pb-safe-area-inset-bottom">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your app preferences and account settings
          </p>
        </div>

        {settingsGroups.map((group, index) => (
          <div key={group.title} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold tracking-tight">{group.title}</h2>
              <p className="text-sm text-muted-foreground">{group.description}</p>
              <Separator className="mt-2" />
            </div>
            
            <div className="space-y-2">
              {group.items.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-between px-4 py-6 h-auto group hover:bg-secondary-50 active:bg-secondary-100 transition-all duration-200"
                  disabled={item.comingSoon}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors duration-200">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-secondary-800">{item.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {item.comingSoon ? (
                    <span className="text-xs bg-secondary-50 text-secondary-600 px-2 py-1 rounded-lg font-medium">
                      Coming soon
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-secondary-600 transition-colors duration-200" />
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
            className="w-full h-12 text-base font-medium rounded-xl"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Log out
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}