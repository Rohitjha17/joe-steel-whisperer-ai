
import React, { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t bg-background p-4">
      <Textarea
        placeholder="Ask Joe about steel industry operations..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[60px] resize-none rounded-lg border-steel-200 bg-white px-3 py-2 shadow-sm focus-visible:ring-steel-500"
        rows={1}
      />
      <Button 
        onClick={handleSendMessage}
        disabled={!message.trim() || isLoading}
        size="icon"
        className="h-10 w-10 shrink-0 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        <Send className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}
