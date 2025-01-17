import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Target, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StandUp() {
  const [mentalHealth, setMentalHealth] = useState<number[]>([7]);
  const [wins, setWins] = useState("");
  const [focus, setFocus] = useState("");
  const [hurdles, setHurdles] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auto-save functionality
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (wins || focus || hurdles || mentalHealth[0] !== 7) {
        toast({
          title: "Progress saved!",
          description: "Your stand-up has been auto-saved as a draft.",
        });
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [wins, focus, hurdles, mentalHealth, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Stand-up completed!",
      description: "Your morning check-in has been saved.",
    });
    setShowPrompt(true);
    if (mentalHealth[0] < 5) {
      toast({
        title: "We noticed you're not feeling great",
        description: "Would you like to talk to your AI coach about it?",
        action: <Button variant="secondary" size="sm">Talk to Coach</Button>,
      });
    }
    navigate("/");
  };

  const handleMentalHealthChange = (value: number[]) => {
    setMentalHealth(value);
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="space-y-4">
              <h2 className="font-medium">How are you feeling today?</h2>
              <div className="px-2">
                <Slider
                  value={mentalHealth}
                  onValueChange={handleMentalHealthChange}
                  max={10}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Not great</span>
                  <span>Amazing</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <h2 className="font-medium">Yesterday's Wins</h2>
            </div>
            <Textarea
              value={wins}
              onChange={(e) => setWins(e.target.value)}
              placeholder="What went well yesterday?"
              className="min-h-[100px]"
            />
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary" />
              <h2 className="font-medium">Today's Focus</h2>
            </div>
            <Textarea
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="What do you want to accomplish today?"
              className="min-h-[100px]"
            />
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-secondary" />
              <h2 className="font-medium">Potential Hurdles and Solutions</h2>
            </div>
            <Textarea
              value={hurdles}
              onChange={(e) => setHurdles(e.target.value)}
              placeholder="What challenges might you face? How will you handle them?"
              className="min-h-[100px]"
            />
          </Card>

          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/goals")}
              className="w-full"
            >
              View Goals
            </Button>
            <Button type="submit" className="w-full">
              Submit
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
