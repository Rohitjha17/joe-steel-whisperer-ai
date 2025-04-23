
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
    <div className="flex items-end gap-2 border-t bg-background px-0 pt-0 pb-0">
      <Textarea
        placeholder="Type a message for Joe…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[48px] resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 shadow focus-visible:ring-black focus-visible:ring-1"
        rows={1}
      />
      <Button 
        onClick={handleSendMessage}
        disabled={!message.trim() || isLoading}
        size="icon"
        className="h-10 w-10 shrink-0 rounded-full bg-black hover:bg-gray-800 text-white"
      >
        <Send className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}

