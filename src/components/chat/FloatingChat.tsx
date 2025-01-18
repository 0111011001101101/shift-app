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
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for AI suggestions every 5 minutes
  useEffect(() => {
    const checkForSuggestions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase.functions.invoke('ai-coach-suggest', {
          body: { userId: user.id }
        });

        if (error) throw error;

        if (data.suggestion) {
          const aiSuggestion: Message = {
            id: Date.now().toString(),
            content: data.suggestion,
            isAi: true,
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, aiSuggestion]);
          
          if (!isOpen) {
            toast({
              title: "New message from AI Coach",
              description: "Your coach has some suggestions for you!",
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

    const interval = setInterval(checkForSuggestions, 5 * 60 * 1000);
    checkForSuggestions();

    return () => clearInterval(interval);
  }, [isOpen, toast]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isAi: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { message, userId: user.id }
      });

      if (error) throw error;

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        isAi: true,
        timestamp: new Date(),
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
        className="fixed bottom-24 right-4 h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
      >
        <MessageCircle className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        "fixed right-4 z-50 shadow-xl transition-all duration-200 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50",
        isMinimized ? "bottom-24 h-14 w-80" : "bottom-24 h-[600px] w-[400px]"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-secondary/20 to-transparent">
            <Sparkles className="h-4 w-4 text-secondary" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-gray-100">AI Coach</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
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
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    msg.isAi ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-[85%] shadow-sm",
                      msg.isAi
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isLoading ? "AI is thinking..." : "Type a message..."}
                disabled={isLoading}
                className="flex-1 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
              />
              <Button 
                onClick={handleSend} 
                size="icon"
                className="bg-primary hover:bg-primary/90 h-10 w-10"
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}