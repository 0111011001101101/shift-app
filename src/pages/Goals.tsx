import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Target } from "lucide-react";

export default function Goals() {
  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-base font-medium text-gray-900">Goals</h1>
        <Button size="sm" className="text-[10px] h-7 px-2.5 bg-pink-500 hover:bg-pink-600">
          <Plus className="w-3 h-3 mr-1" /> Add Goal
        </Button>
      </div>

      <div className="space-y-2.5">
        <Card className="p-3">
          <div className="flex items-start gap-2.5">
            <Target className="w-3.5 h-3.5 text-pink-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-xs font-medium text-gray-900 mb-2">Improve Work-Life Balance</h3>
              <div className="h-1 bg-gray-100 rounded-full">
                <div className="h-full w-3/4 bg-pink-500 rounded-full" />
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5">3 of 4 sub-goals completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-start gap-2.5">
            <Target className="w-3.5 h-3.5 text-pink-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-xs font-medium text-gray-900 mb-2">Daily Meditation Practice</h3>
              <div className="h-1 bg-gray-100 rounded-full">
                <div className="h-full w-1/2 bg-pink-500 rounded-full" />
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5">15 day streak</p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}