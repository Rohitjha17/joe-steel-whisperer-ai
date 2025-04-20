
import React, { useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { Loader2 } from "lucide-react";

// Modern style scrollable chat panel, smooth
export function ChatWindow({ messages, isLoading }: { messages: Message[], isLoading: boolean }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const showWelcomeMessage = messages.length === 0;

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={scrollableRef}
        className="h-full w-full overflow-y-auto bg-white/90 px-3 py-6 rounded-xl border border-steel-100 shadow-inner scrollbar-thin scrollbar-thumb-steel-300 scrollbar-track-steel-50"
        style={{
          minHeight: "340px",
          maxHeight: "380px",
          height: "100%"
        }}
      >
        {showWelcomeMessage ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-xl w-full mx-auto text-center p-8 rounded-lg bg-white/80 shadow-lg border border-steel-100">
              <h2 className="text-3xl font-bold font-playfair mb-2 text-steel-800">
                Welcome to Joe's Steel Chat
              </h2>
              <p className="text-steel-600 mb-1 text-base">
                Powered by 40+ years of experience.<br />
                Ask me anything about operations, procurement, quality or production!
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center pt-2">
                <Loader2 className="h-7 w-7 animate-spin text-steel-300" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
