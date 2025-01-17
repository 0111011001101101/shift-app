import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sun, Target, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <header className="space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Good Morning, User
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">Let's start your day with intention</p>
        </header>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-background/95 via-background/90 to-muted/95 backdrop-blur-lg border-muted/50 hover:shadow-xl transition-all duration-300 animate-slideUp group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl shadow-inner">
                  <Sun className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-base font-semibold">Morning Stand-Up</h2>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-muted/80 backdrop-blur-sm px-3 py-1 rounded-full">5 min</span>
            </div>
            <p className="text-sm mb-4 text-muted-foreground">Start your day with intention. Check in with yourself and set your focus.</p>
            <Button variant="default" className="w-full text-sm py-2 h-10 bg-gradient-to-r from-primary via-primary/90 to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
              Begin Check-in <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>

        <section className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-transparent">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-sm font-semibold">Today's Focus</h2>
          </div>
          <Card className="space-y-3 p-5 bg-gradient-to-br from-background via-background/95 to-muted/90 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-foreground/80">Complete project presentation</span>
            </div>
            <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
              <span className="text-sm text-foreground/80">30 min meditation</span>
            </div>
          </Card>
        </section>

        <section className="space-y-4 animate-fadeIn">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            Current Streak
          </h2>
          <Card className="text-center py-8 px-4 bg-gradient-to-br from-background via-background/95 to-muted/90 hover:shadow-lg transition-all duration-300 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse mb-2">7</div>
              <p className="text-xs text-muted-foreground">days of consistent check-ins</p>
            </div>
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}