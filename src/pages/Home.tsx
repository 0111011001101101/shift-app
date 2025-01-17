import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sun } from "lucide-react";

export default function Home() {
  return (
    <PageContainer>
      <div className="space-y-5">
        <h1 className="text-xl font-semibold tracking-tight">Good Morning, User</h1>
        
        <Card className="bg-primary/20 backdrop-blur-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <Sun className="w-5 h-5" />
              <h2 className="text-base font-medium">Morning Stand-Up</h2>
            </div>
            <span className="text-xs opacity-75">5 min</span>
          </div>
          <p className="text-sm mb-4 text-white/80">Start your day with intention. Check in with yourself and set your focus.</p>
          <Button variant="secondary" className="w-full text-sm py-2 h-auto">
            Begin Check-in <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>

        <section className="space-y-3">
          <h2 className="text-base font-medium">Today's Focus</h2>
          <Card className="space-y-2.5 p-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <span className="text-sm font-medium">Complete project presentation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-warning" />
              <span className="text-sm font-medium">30 min meditation</span>
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium">Current Streak</h2>
          <Card className="text-center py-4 px-5">
            <div className="text-3xl font-bold text-secondary mb-1">7</div>
            <p className="text-xs text-white/70">days of consistent check-ins</p>
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}