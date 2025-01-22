import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isAi: boolean;
  timestamp: Date;
  options?: string[];
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full animate-fade-in",
        message.isAi ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "rounded-2xl px-4 py-2.5 max-w-[85%] shadow-sm transition-all duration-300",
          message.isAi
            ? "bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200"
            : "bg-primary/90 text-primary-foreground"
        )}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
}