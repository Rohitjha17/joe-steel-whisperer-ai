
import React, { useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { Loader2 } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // If no messages, show welcome message
  const showWelcomeMessage = messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-steel-50">
      {showWelcomeMessage ? (
        <div className="flex h-full items-center justify-center">
          <div className="max-w-md text-center p-6 rounded-lg bg-white shadow-sm">
            <h2 className="text-2xl font-bold text-steel-800 mb-2">Hello, I'm Joe</h2>
            <p className="text-steel-600 mb-4">
              With 40 years of steel industry experience, I'm here to help with procurement, inventory, 
              quality checks, sales, and production questions. How can I assist you today?
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-steel-500" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
