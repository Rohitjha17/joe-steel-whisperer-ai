
import React from "react";
import { Message } from "@/types/chat";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex w-full gap-3 px-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <Avatar className="h-10 w-10 bg-gray-100 shadow">
            <img
              className="h-full w-full object-cover rounded-full"
              src="/lovable-uploads/badd8c45-08b2-4c69-a3c3-8f33e10750e5.png"
              alt="Joe"
            />
          </Avatar>
        </div>
      )}

      <div
        className={cn(
          "relative max-w-[80%] rounded-xl py-3 px-4 shadow-sm",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900"
        )}
      >
        <div className="break-words font-medium text-base">
          {message.content.split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < message.content.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        <div
          className={cn(
            "mt-2 text-xs opacity-60 tracking-wide",
            isUser ? "text-right" : "text-left"
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      {isUser && (
        <div className="flex-shrink-0">
          <Avatar className="h-10 w-10 bg-gray-300 text-white flex items-center justify-center font-bold text-lg">
            U
          </Avatar>
        </div>
      )}
    </div>
  );
}
