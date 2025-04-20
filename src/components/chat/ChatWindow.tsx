
import React, { useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { Loader2 } from "lucide-react";

// ChatWindow with inner scroll and fixed height
export function ChatWindow({ messages, isLoading }: { messages: Message[], isLoading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const showWelcome = messages.length === 0;

  return (
    <div className="h-full w-full flex flex-col">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 md:px-4 custom-scrollbar"
        tabIndex={0}
        style={{
          scrollbarWidth: "thin",
          minHeight: "300px",
        }}
      >
        {showWelcome ? (
          <div className="flex h-full items-center justify-center px-2 py-4">
            <div className="max-w-xl mx-auto text-center p-8 rounded-xl bg-white/90 shadow-lg border border-steel-100">
              <h2 className="text-3xl font-bold font-playfair mb-2 text-steel-800">
                Welcome to Joe's Steel Chat
              </h2>
              <p className="text-steel-600 mb-2 text-lg">
                Ask anything about operations, procurement, quality, or production.
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
