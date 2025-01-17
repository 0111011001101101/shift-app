import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sun } from "lucide-react";

export default function Home() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <header className="space-y-1.5">
          <h1 className="text-base font-medium tracking-tight text-gray-900">Good Morning, User</h1>
          <p className="text-sm text-gray-500">Let's start your day with intention</p>
        </header>
        
        <Card className="bg-white/95 backdrop-blur-sm p-4 border border-gray-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-medium text-gray-900">Morning Stand-Up</h2>
            </div>
            <span className="text-xs text-gray-500">5 min</span>
          </div>
          <p className="text-sm mb-4 text-gray-600">Start your day with intention. Check in with yourself and set your focus.</p>
          <Button variant="secondary" className="w-full text-xs py-2 h-9 bg-blue-500 hover:bg-blue-600 text-white">
            Begin Check-in <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Card>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-gray-900">Today's Focus</h2>
          <Card className="space-y-2.5 p-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-sm text-gray-700">Complete project presentation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-sm text-gray-700">30 min meditation</span>
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-gray-900">Current Streak</h2>
          <Card className="text-center py-4 px-4">
            <div className="text-2xl font-semibold text-blue-500 mb-1">7</div>
            <p className="text-xs text-gray-500">days of consistent check-ins</p>
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}