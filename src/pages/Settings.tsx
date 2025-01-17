import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Clock, MessageSquare, Moon, Palette, Shield, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [standupTime, setStandupTime] = useState("09:00");
  const [aiTone, setAiTone] = useState("professional");

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const SettingItem = ({ icon: Icon, title, children }: { 
    icon: any, 
    title: string, 
    children: React.ReactNode 
  }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <Icon className="w-5 h-5 mt-1 text-muted-foreground" />
      <div className="flex-1 space-y-1">
        <h3 className="font-medium text-sm">{title}</h3>
        {children}
      </div>
    </div>
  );

  return (
    <PageContainer>
      <div className="space-y-6">
        <h1>Settings</h1>
        <div className="space-y-4">
          <SettingItem icon={Clock} title="Stand-up Time">
            <Input
              type="time"
              value={standupTime}
              onChange={(e) => setStandupTime(e.target.value)}
              className="max-w-[120px]"
            />
          </SettingItem>

          <SettingItem icon={MessageSquare} title="AI Coach Tone">
            <Select value={aiTone} onValueChange={setAiTone}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="motivational">Motivational</SelectItem>
              </SelectContent>
            </Select>
          </SettingItem>

          <SettingItem icon={Bell} title="Notifications">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Receive reminders and updates
              </p>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </SettingItem>

          <SettingItem icon={Moon} title="Dark Mode">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Toggle dark mode
              </p>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </SettingItem>

          <SettingItem icon={User} title="Profile">
            <p className="text-sm text-muted-foreground mb-2">
              Manage your personal information
            </p>
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </SettingItem>

          <SettingItem icon={Shield} title="Privacy">
            <p className="text-sm text-muted-foreground mb-2">
              Control your data and privacy settings
            </p>
            <Button variant="outline" size="sm">
              Privacy Settings
            </Button>
          </SettingItem>

          <SettingItem icon={Palette} title="Appearance">
            <p className="text-sm text-muted-foreground mb-2">
              Customize your app experience
            </p>
            <Button variant="outline" size="sm">
              Customize
            </Button>
          </SettingItem>
        </div>

        <div className="flex justify-end pt-6">
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Settings;