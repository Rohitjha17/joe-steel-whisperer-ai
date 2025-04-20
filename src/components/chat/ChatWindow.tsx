
import React, { useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { Loader2 } from "lucide-react";

// Smooth, modern, beautifully scrollable chat, ChatGPT style.
export function ChatWindow({ messages, isLoading }: { messages: Message[], isLoading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Always scroll to bottom for new messages/loading
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const showWelcome = messages.length === 0;

  return (
    <div className="flex-1 relative">
      <div
        ref={scrollRef}
        className="overflow-y-auto px-3 py-6 h-full w-full max-h-[65vh] md:max-h-[640px] scrollbar-thin scrollbar-thumb-steel-200 scrollbar-track-white animate-fade-in"
        style={{ minHeight: "340px", height: "100%" }}
        tabIndex={0}
      >
        {showWelcome ? (
          <div className="flex h-full items-center justify-center px-2 py-4">
            <div className="max-w-xl mx-auto text-center p-8 rounded-xl bg-white/90 shadow-lg border border-steel-100">
              <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-2 text-steel-800">
                Welcome to Joe's Steel Chat
              </h2>
              <p className="text-steel-600 mb-2 text-lg">
                Powered by 40+ years of experience.<br />
                Ask me anything about operations, procurement, quality or production!
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-7">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {isLoading && (
              <div className="flex justify-center pt-2">
                <Loader2 className="h-7 w-7 animate-spin text-steel-300" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
