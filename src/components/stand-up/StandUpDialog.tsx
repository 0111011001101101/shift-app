import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StandUpSection } from "./StandUpSection";
import { MoodTracker } from "./MoodTracker";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Target, AlertCircle } from "lucide-react";

interface StandUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completed?: boolean;
  standUpData?: any;
}

export function StandUpDialog({ open, onOpenChange, completed, standUpData }: StandUpDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [mentalHealth, setMentalHealth] = useState<number[]>([7]);
  const [wins, setWins] = useState("");
  const [focus, setFocus] = useState("");
  const [hurdles, setHurdles] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  if (completed && standUpData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 backdrop-blur-xl">
          <div className="space-y-6 p-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Today's Stand-up Complete!
              </h2>
              <p className="text-muted-foreground">Here's your daily summary:</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                  <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  Mood Score: {standUpData.mental_health}/10
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 pl-8">
                  {standUpData.mental_health >= 7 ? "You're doing great!" : "Keep pushing forward!"}
                </p>
              </div>

              {standUpData.wins && (
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400">
                    <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    Yesterday's Wins
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 pl-8">{standUpData.wins}</p>
                </div>
              )}

              {standUpData.focus && (
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    <div className="p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900">
                      <Target className="w-4 h-4" />
                    </div>
                    Today's Focus
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 pl-8">{standUpData.focus}</p>
                </div>
              )}

              {standUpData.hurdles && (
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400">
                    <div className="p-1.5 rounded-full bg-rose-100 dark:bg-rose-900">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    Potential Hurdles
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 pl-8">{standUpData.hurdles}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button 
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 backdrop-blur-xl">
        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Morning Stand-up
            </h2>
            <p className="text-muted-foreground">Let's set you up for success today!</p>
          </div>

          <div className="space-y-4">
            {currentStep === 0 && (
              <div className="animate-fade-in">
                <MoodTracker value={mentalHealth} onChange={setMentalHealth} />
              </div>
            )}

            {currentStep === 1 && (
              <div className="animate-fade-in">
                <StandUpSection
                  icon={<CheckCircle2 className="w-5 h-5 text-blue-500" />}
                  title="Yesterday's Wins"
                  value={wins}
                  onChange={setWins}
                  placeholder="What went well yesterday?"
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-fade-in">
                <StandUpSection
                  icon={<Target className="w-5 h-5 text-purple-500" />}
                  title="Today's Focus"
                  value={focus}
                  onChange={setFocus}
                  placeholder="What are your goals for today?"
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-fade-in">
                <StandUpSection
                  icon={<AlertCircle className="w-5 h-5 text-rose-500" />}
                  title="Potential Hurdles"
                  value={hurdles}
                  onChange={setHurdles}
                  placeholder="Any challenges you might face?"
                  required={false}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            
            <Button
              onClick={async () => {
                if (currentStep < 3) {
                  setCurrentStep(currentStep + 1);
                } else {
                  try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error("No user found");

                    const { error } = await supabase
                      .from('stand_ups')
                      .insert({
                        user_id: user.id,
                        mental_health: Math.round(mentalHealth[0]),
                        wins,
                        focus,
                        hurdles,
                        completed: true
                      });

                    if (error) throw error;

                    toast({
                      title: "Stand-up completed!",
                      description: "Your morning check-in has been saved.",
                    });

                    onOpenChange(false);
                    navigate("/home");
                  } catch (error) {
                    console.error('Error submitting stand-up:', error);
                    toast({
                      title: "Error",
                      description: "Failed to save your stand-up. Please try again.",
                      variant: "destructive",
                    });
                  }
                }
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {currentStep === 3 ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}