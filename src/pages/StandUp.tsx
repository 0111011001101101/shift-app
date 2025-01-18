import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Target, ArrowRight, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StandUpData {
  mentalHealth: number[];
  wins: string;
  focus: string;
  hurdles: string;
  date: string;
  completed: boolean;
}

const STORAGE_KEY = 'standUpData';

export default function StandUp() {
  const [mentalHealth, setMentalHealth] = useState<number[]>([7]);
  const [wins, setWins] = useState("");
  const [focus, setFocus] = useState("");
  const [hurdles, setHurdles] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData) as StandUpData;
      // Only load if it's from today and not completed
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
    const saveTimeout = setTimeout(() => {
      if (wins || focus || hurdles || mentalHealth[0] !== 7) {
        const data: StandUpData = {
          mentalHealth,
          wins,
          focus,
          hurdles,
          date: new Date().toISOString(),
          completed: false
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
    
    // Save completed stand-up
    const data: StandUpData = {
      mentalHealth,
      wins,
      focus,
      hurdles,
      date: new Date().toISOString(),
      completed: true
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // Check mental health score
    if (mentalHealth[0] < 5) {
      toast({
        title: "We noticed you're not feeling great",
        description: "Would you like to talk to your AI coach about it?",
        action: (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => {
              // This would trigger the AI chat to open
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

  const handleMentalHealthChange = (value: number[]) => {
    setMentalHealth(value);
  };

  const toggleVoiceRecording = (field: 'wins' | 'focus' | 'hurdles') => {
    if (!isRecording) {
      setIsRecording(true);
      // Here you would implement actual voice recording logic
      toast({
        title: "Voice recording",
        description: "Voice recording feature coming soon!",
      });
    } else {
      setIsRecording(false);
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

          {['wins', 'focus', 'hurdles'].map((field) => (
            <Card key={field} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {field === 'wins' && <CheckCircle className="w-5 h-5 text-secondary" />}
                  {field === 'focus' && <Target className="w-5 h-5 text-secondary" />}
                  {field === 'hurdles' && <AlertCircle className="w-5 h-5 text-secondary" />}
                  <h2 className="font-medium">
                    {field === 'wins' && "Yesterday's Wins"}
                    {field === 'focus' && "Today's Focus"}
                    {field === 'hurdles' && "Potential Hurdles & Solutions"}
                  </h2>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleVoiceRecording(field as any)}
                  className={isRecording ? 'text-destructive' : ''}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                value={
                  field === 'wins' ? wins :
                  field === 'focus' ? focus :
                  hurdles
                }
                onChange={(e) => {
                  if (field === 'wins') setWins(e.target.value);
                  if (field === 'focus') setFocus(e.target.value);
                  if (field === 'hurdles') setHurdles(e.target.value);
                }}
                placeholder={
                  field === 'wins' ? "What went well yesterday?" :
                  field === 'focus' ? "What do you want to accomplish today?" :
                  "What challenges might you face? How will you handle them?"
                }
                className="min-h-[100px]"
              />
            </Card>
          ))}

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