
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
        <DialogContent className="sm:max-w-[500px] bg-white rounded-xl">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Today's Stand-up
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Here's your daily summary:
          </DialogDescription>

          <div className="space-y-3 mt-2">
            <div className="p-4 rounded-lg bg-gray-50 space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-primary-600">
                <div className="p-1.5 rounded-full bg-primary-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                Mood Score: {standUpData.mental_health}/10
              </div>
              <p className="text-sm text-gray-600 pl-8">
                {standUpData.mental_health >= 7 ? "You're doing great!" : "Keep pushing forward!"}
              </p>
            </div>

            {standUpData.wins && (
              <div className="p-4 rounded-lg bg-gray-50 space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-secondary-600">
                  <div className="p-1.5 rounded-full bg-secondary-100">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  Yesterday's Wins
                </div>
                <p className="text-sm text-gray-600 pl-8">{standUpData.wins}</p>
              </div>
            )}

            {standUpData.focus && (
              <div className="p-4 rounded-lg bg-gray-50 space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-primary-600">
                  <div className="p-1.5 rounded-full bg-primary-100">
                    <Target className="w-4 h-4" />
                  </div>
                  Today's Focus
                </div>
                <p className="text-sm text-gray-600 pl-8">{standUpData.focus}</p>
              </div>
            )}

            {standUpData.hurdles && (
              <div className="p-4 rounded-lg bg-gray-50 space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-rose-600">
                  <div className="p-1.5 rounded-full bg-rose-100">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  Potential Hurdles
                </div>
                <p className="text-sm text-gray-600 pl-8">{standUpData.hurdles}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-2">
            <Button 
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogTitle className="text-xl font-semibold text-primary-600">
          Morning Stand-up
        </DialogTitle>
        <DialogDescription className="text-gray-600">
          Let's set you up for success today!
        </DialogDescription>

        <div className="space-y-4 my-2">
          {currentStep === 0 && (
            <div className="animate-fade-in">
              <MoodTracker value={mentalHealth} onChange={setMentalHealth} />
            </div>
          )}

          {currentStep === 1 && (
            <div className="animate-fade-in">
              <StandUpSection
                icon={<CheckCircle2 className="w-5 h-5 text-primary-500" />}
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
                icon={<Target className="w-5 h-5 text-secondary-500" />}
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

        <div className="flex gap-3 pt-2">
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
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
          >
            {currentStep === 3 ? "Complete" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
