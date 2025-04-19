
import React, { useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { Loader2 } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

// A stunning scrollable chat area with glass effect, padding, shadow, and smooth scrolling
export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Always scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showWelcomeMessage = messages.length === 0;

  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-steel-300 scrollbar-track-steel-100 bg-white/80 dark:bg-steel-900/75 px-3 md:px-8 py-6 rounded-2xl border border-steel-200 shadow-xl glass-morphism animate-fade-in transition-all duration-300"
        style={{ maxHeight: "calc(64vh)", minHeight: "320px", backdropFilter: "blur(18px)" }}
      >
        {showWelcomeMessage ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-md text-center p-8 rounded-2xl bg-white/80 shadow-lg ring-1 ring-steel-200 glass-morphism">
              <h2 className="text-3xl font-extrabold font-playfair mb-3 text-steel-800 drop-shadow">Hello, I'm Joe</h2>
              <p className="text-steel-600 mb-4 text-lg">
                With 40 years of steel industry experience, I'm here to help with procurement, inventory, quality checks, sales, and production questions. How can I assist you today?
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
                <Loader2 className="h-7 w-7 animate-spin text-steel-500" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
