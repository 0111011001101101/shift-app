import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Target, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MoodTracker } from "@/components/stand-up/MoodTracker";
import { StandUpSection } from "@/components/stand-up/StandUpSection";
import { ProgressIndicator } from "@/components/stand-up/ProgressIndicator";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = 'standUpData';
const STEPS = ["Mood", "Yesterday", "Today", "Hurdles"];

const TEMPLATES = {
  wins: [
    "Completed project milestone",
    "Had productive meetings",
    "Solved key problem",
    "Made progress on goals",
  ],
  focus: [
    "Complete key deliverable",
    "Strategic planning",
    "Team alignment",
    "Client meetings",
  ],
  hurdles: [
    "Time management",
    "Resource constraints",
    "Technical challenges",
    "Team coordination",
  ],
};

export default function StandUp() {
  const [currentStep, setCurrentStep] = useState(0);
  const [mentalHealth, setMentalHealth] = useState<number[]>([7]);
  const [wins, setWins] = useState("");
  const [focus, setFocus] = useState("");
  const [hurdles, setHurdles] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const isToday = new Date(parsed.date).toDateString() === new Date().toDateString();
      if (isToday && !parsed.completed) {
        setMentalHealth(parsed.mentalHealth);
        setWins(parsed.wins);
        setFocus(parsed.focus);
        setHurdles(parsed.hurdles);
      }
    }
  }, []);

  // Autosave functionality
  useEffect(() => {
    const saveTimeout = setTimeout(async () => {
      if (wins || focus || hurdles || mentalHealth[0] !== 7) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No user found');
          return;
        }

        const data = {
          mentalHealth,
          wins,
          focus,
          hurdles,
          date: new Date().toISOString(),
          completed: false
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

        // Save draft to Supabase with user_id
        const { error } = await supabase
          .from('stand_ups')
          .upsert({
            user_id: user.id,
            mental_health: mentalHealth[0],
            draft_wins: wins,
            draft_focus: focus,
            draft_hurdles: hurdles,
            last_edited_at: new Date().toISOString(),
          });

        if (!error) {
          toast({
            title: "Progress saved!",
            description: "Your stand-up has been auto-saved as a draft.",
          });
        } else {
          console.error('Error saving draft:', error);
        }
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [wins, focus, hurdles, mentalHealth, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a stand-up.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('stand_ups')
      .insert({
        user_id: user.id,
        mental_health: mentalHealth[0],
        wins,
        focus,
        hurdles,
        completed: true
      });

    if (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: "Failed to save your stand-up. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (mentalHealth[0] < 5) {
      toast({
        title: "We noticed you're not feeling great",
        description: "Would you like to talk to your AI coach about it?",
        action: (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => {
              document.dispatchEvent(new CustomEvent('openAIChat', {
                detail: {
                  context: 'low_mood',
                  score: mentalHealth[0]
                }
              }));
            }}
          >
            Talk to Coach
          </Button>
        ),
      });
    }

    toast({
      title: "Stand-up completed!",
      description: "Your morning check-in has been saved.",
    });
    
    navigate("/");
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6 animate-fadeIn pb-24">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Morning Stand-Up
          </h1>
          <p className="text-sm text-muted-foreground">
            Let's start your day with intention and clarity
          </p>
        </header>

        <ProgressIndicator steps={STEPS} currentStep={currentStep} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 0 && (
            <MoodTracker value={mentalHealth} onChange={setMentalHealth} />
          )}

          {currentStep === 1 && (
            <StandUpSection
              icon={<CheckCircle className="w-5 h-5 text-secondary" />}
              title="Yesterday's Wins"
              value={wins}
              onChange={setWins}
              placeholder="What went well yesterday?"
              templates={TEMPLATES.wins}
            />
          )}

          {currentStep === 2 && (
            <StandUpSection
              icon={<Target className="w-5 h-5 text-secondary" />}
              title="Today's Focus"
              value={focus}
              onChange={setFocus}
              placeholder="What do you want to accomplish today?"
              templates={TEMPLATES.focus}
            />
          )}

          {currentStep === 3 && (
            <StandUpSection
              icon={<AlertCircle className="w-5 h-5 text-secondary" />}
              title="Potential Hurdles & Solutions"
              value={hurdles}
              onChange={setHurdles}
              placeholder="What challenges might you face? How will you handle them?"
              templates={TEMPLATES.hurdles}
            />
          )}

          <div className="flex gap-4">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            
            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={handleNext} className="flex-1">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" className="flex-1">
                Complete
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/goals")}
            className="w-full"
          >
            View Goals
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}