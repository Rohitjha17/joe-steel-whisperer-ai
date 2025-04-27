import React from "react";
import { Message } from "../../types/chat";
import { Loader2 } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex flex-col ${
            message.role === "assistant" ? "items-start" : "items-end"
          }`}
        >
          <div
            className={`max-w-[85%] rounded-lg p-3 ${
              message.role === "assistant"
                ? "bg-black text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}

