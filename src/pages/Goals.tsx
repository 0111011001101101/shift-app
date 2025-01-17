import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Target } from "lucide-react";

export default function Goals() {
  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Goals</h1>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add Goal
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <h3 className="font-medium mb-1">Improve Work-Life Balance</h3>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full w-3/4 bg-primary rounded-full" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">3 of 4 sub-goals completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <h3 className="font-medium mb-1">Daily Meditation Practice</h3>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-full w-1/2 bg-primary rounded-full" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">15 day streak</p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}