
import React, { useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { Loader2 } from "lucide-react";

// Stunning high-class glass panel, perfectly scrollable, immersive experience
export function ChatWindow({ messages, isLoading }: { messages: Message[], isLoading: boolean }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  // Always scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && scrollableRef.current) {
      // Scroll to bottom smoothly
      scrollableRef.current.scrollTo({
        top: scrollableRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const showWelcomeMessage = messages.length === 0;

  return (
    <div className="flex-1 relative overflow-hidden">
      <div
        ref={scrollableRef}
        className="
          h-full w-full overflow-y-auto
          scrollbar-thin scrollbar-thumb-steel-400 scrollbar-track-steel-100
          glass-morphism-strong
          bg-gradient-to-br from-white/75 via-steel-100/70 to-steel-300/50
          px-3 md:px-8 py-8
          rounded-[32px]
          border border-steel-200
          shadow-2xl
          animate-fade-in
          transition-all duration-300
          "
        style={{
          maxHeight: "60vh",
          minHeight: "340px",
          backdropFilter: "blur(24px) brightness(0.98)",
        }}
      >
        {showWelcomeMessage ? (
          <div className="flex h-full items-center justify-center animate-fade-in">
            <div className="max-w-xl w-full mx-auto text-center p-10 rounded-3xl bg-white/95 shadow-2xl ring-2 ring-steel-200 glass-morphism-strong border border-steel-200">
              <h2 className="text-4xl md:text-5xl font-extrabold font-playfair mb-3 text-steel-800 tracking-wide drop-shadow">
                Hello, I'm Joe
              </h2>
              <p className="text-steel-600 mb-4 text-lg md:text-xl">
                With <b>40 years</b> of steel industry experience,<br />
                I'm here for procurement, inventory, quality checks,<br />
                sales, and production questions.<br />
                <span className="text-steel-500">How can I amaze you today?</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-7 pb-8">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-steel-400 opacity-80" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
