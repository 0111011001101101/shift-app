import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export function ChatInput({ message, isLoading, onChange, onSend, onKeyPress }: ChatInputProps) {
  return (
    <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-800/50">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={isLoading ? "AI is thinking..." : "Type a message..."}
          disabled={isLoading}
          className="flex-1 bg-white/80 dark:bg-gray-800/80 border-gray-200/80 dark:border-gray-700/80 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        />
        <Button 
          onClick={onSend} 
          size="icon"
          className="bg-primary/90 hover:bg-primary/80 h-10 w-10 flex-shrink-0 transition-all duration-200"
          disabled={isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}