import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Minimize2, Maximize2, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isAi: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to help! What's on your mind?",
        isAi: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
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
        className="fixed bottom-24 right-4 h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        "fixed right-4 shadow-lg transition-all duration-200 bg-gradient-to-br from-white/95 via-gray-50/90 to-gray-100/95 dark:from-gray-800/95 dark:via-gray-900/90 dark:to-gray-950/95 backdrop-blur-lg border border-gray-100/50 dark:border-gray-700/50",
        isMinimized ? "bottom-24 h-14 w-72" : "bottom-24 h-[500px] w-72"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-gray-100/50 dark:border-gray-700/50 px-4">
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
                      "rounded-2xl px-4 py-2 max-w-[80%]",
                      msg.isAi
                        ? "bg-secondary/10 text-gray-900 dark:text-gray-100"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t border-gray-100/50 dark:border-gray-700/50 p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
              <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}