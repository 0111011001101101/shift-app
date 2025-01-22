import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Minimize2, Maximize2, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  isAi: boolean;
  timestamp: Date;
  options?: string[];
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your AI coach. How can I help you today?",
      isAi: true,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChoice, setLastChoice] = useState<string | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSuggestionRef = useRef<Date | null>(null);

  useEffect(() => {
    const checkForSuggestions = async () => {
      try {
        if (lastSuggestionRef.current) {
          const timeSinceLastSuggestion = Date.now() - lastSuggestionRef.current.getTime();
          if (timeSinceLastSuggestion < 3 * 60 * 60 * 1000) { // 3 hours
            return;
          }
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: completedGoals } = await supabase
          .from('goals')
          .select('title')
          .eq('user_id', user.id)
          .eq('completed', true)
          .gt('updated_at', new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString());

        if (completedGoals?.length) {
          const goalMessage: Message = {
            id: Date.now().toString(),
            content: `Congratulations on completing "${completedGoals[0].title}"! Would you like to:
1. Set a new goal to maintain momentum?
2. Break down your next goal into smaller steps?
3. Reflect on what helped you succeed?`,
            isAi: true,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, goalMessage]);
          lastSuggestionRef.current = new Date();
          
          if (!isOpen) {
            toast({
              title: "Achievement Unlocked! 🎯",
              description: "Let's build on this success.",
              action: (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setIsOpen(true)}
                  className="bg-gradient-to-r from-secondary to-primary hover:opacity-90"
                >
                  View
                </Button>
              ),
            });
          }
          return;
        }

        const { data: recentStandUps } = await supabase
          .from('stand_ups')
          .select('mental_health')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2);

        if (recentStandUps?.length >= 2 && 
            recentStandUps[0].mental_health < 5 && 
            recentStandUps[0].mental_health < recentStandUps[1].mental_health - 2) {
          const supportMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `I noticed a significant change in your mood. Would you like to:
1. Talk through what's on your mind?
2. Review some proven stress-management techniques?
3. Focus on small wins to build momentum?`,
            isAi: true,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, supportMessage]);
          lastSuggestionRef.current = new Date();
          
          if (!isOpen) {
            toast({
              title: "Check-in Time 💙",
              description: "Let's work through this together.",
              action: (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setIsOpen(true)}
                >
                  Chat Now
                </Button>
              ),
            });
          }
          return;
        }

        const { data, error } = await supabase.functions.invoke('ai-coach-suggest', {
          body: { 
            userId: user.id,
            lastSuggestionTime: lastSuggestionRef.current?.toISOString()
          }
        });

        if (error) throw error;

        if (data.suggestion) {
          const aiSuggestion: Message = {
            id: (Date.now() + 2).toString(),
            content: data.suggestion,
            isAi: true,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiSuggestion]);
          lastSuggestionRef.current = new Date();
          
          if (!isOpen) {
            toast({
              title: "Coaching Insight",
              description: "I have a suggestion that might help you progress.",
              action: (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setIsOpen(true)}
                >
                  View
                </Button>
              ),
            });
          }
        }

      } catch (error) {
        console.error('Error checking for AI suggestions:', error);
      }
    };

    const interval = setInterval(checkForSuggestions, 3 * 60 * 60 * 1000); // 3 hours
    checkForSuggestions();

    return () => clearInterval(interval);
  }, [isOpen, toast]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isAi: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Find the last AI message using filter and reverse
      const lastAiMessage = [...messages].reverse().find(m => m.isAi);
      const isNumericResponse = /^[1-9]\d*$/.test(message.trim());
      
      if (lastAiMessage?.options && isNumericResponse) {
        const choiceIndex = parseInt(message.trim()) - 1;
        if (choiceIndex >= 0 && choiceIndex < lastAiMessage.options.length) {
          setLastChoice(lastAiMessage.options[choiceIndex]);
        }
      }

      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { 
          message,
          userId: user.id,
          lastChoice: lastChoice
        }
      });

      if (error) throw error;

      // Parse potential options from AI response
      const response = data.reply;
      const hasNumberedList = response.match(/\d+\./);
      let options: string[] | undefined;
      
      if (hasNumberedList) {
        options = response.split('\n')
          .filter(line => /^\d+\./.test(line.trim()))
          .map(line => line.replace(/^\d+\.\s*/, '').trim());
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        isAi: true,
        timestamp: new Date(),
        options
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLastChoice(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 h-12 w-12 rounded-full shadow-lg bg-gradient-to-br from-primary/90 via-secondary/90 to-primary/90 hover:opacity-90 transition-all duration-300 z-50 md:bottom-24 md:h-14 md:w-14 group"
      >
        <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        "fixed right-2 left-2 mx-auto z-50 shadow-xl transition-all duration-300 bg-gradient-to-br from-white/95 via-gray-50/95 to-gray-100/95 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 md:left-auto md:right-4 md:mx-0",
        isMinimized 
          ? "bottom-20 h-14 max-w-[280px] md:bottom-24 md:w-72" 
          : "bottom-20 h-[500px] max-w-[400px] md:bottom-24 md:h-[600px] md:w-[380px]"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 bg-gradient-to-r from-gray-50/50 via-white/50 to-gray-50/50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-200">AI Coach</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col h-[calc(100%-3.5rem)]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full animate-fade-in",
                    msg.isAi ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 max-w-[85%] shadow-sm transition-all duration-300",
                      msg.isAi
                        ? "bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200"
                        : "bg-primary/90 text-primary-foreground"
                    )}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-800/50">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isLoading ? "AI is thinking..." : "Type a message..."}
                disabled={isLoading}
                className="flex-1 bg-white/80 dark:bg-gray-800/80 border-gray-200/80 dark:border-gray-700/80 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
              <Button 
                onClick={handleSend} 
                size="icon"
                className="bg-primary/90 hover:bg-primary/80 h-10 w-10 flex-shrink-0 transition-all duration-200"
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}