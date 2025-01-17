import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Target } from "lucide-react";

export default function Goals() {
  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold tracking-tight">Goals</h1>
        <Button size="sm" className="text-xs h-8 px-3">
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Goal
        </Button>
      </div>

      <div className="space-y-3">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Target className="w-4 h-4 text-secondary mt-1" />
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2">Improve Work-Life Balance</h3>
              <div className="h-1.5 bg-white/10 rounded-full">
                <div className="h-full w-3/4 bg-secondary rounded-full" />
              </div>
              <p className="text-xs text-white/70 mt-2">3 of 4 sub-goals completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Target className="w-4 h-4 text-secondary mt-1" />
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2">Daily Meditation Practice</h3>
              <div className="h-1.5 bg-white/10 rounded-full">
                <div className="h-full w-1/2 bg-secondary rounded-full" />
              </div>
              <p className="text-xs text-white/70 mt-2">15 day streak</p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}