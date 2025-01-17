import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sun } from "lucide-react";

export default function Home() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Good Morning, User</h1>
        
        <Card className="bg-primary text-primary-foreground p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sun className="w-6 h-6" />
              <h2 className="text-lg font-medium">Morning Stand-Up</h2>
            </div>
            <span className="text-sm opacity-75">5 min</span>
          </div>
          <p className="mb-4 opacity-90">Start your day with intention. Check in with yourself and set your focus.</p>
          <Button variant="secondary" className="w-full">
            Begin Check-in <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Today's Focus</h2>
          <Card className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="font-medium">Complete project presentation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span className="font-medium">30 min meditation</span>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Current Streak</h2>
          <Card className="text-center p-6">
            <div className="text-4xl font-bold text-primary mb-2">7</div>
            <p className="text-sm text-muted-foreground">days of consistent check-ins</p>
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}