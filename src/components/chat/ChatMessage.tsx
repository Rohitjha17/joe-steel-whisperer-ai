
import React from "react";
import { Message } from "@/types/chat";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Clean, aligned, subtle message bubbles (ChatGPT vibe).
export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <Avatar className="h-11 w-11 bg-steel-100 border border-steel-300 shadow">
            <img
              className="h-full w-full object-cover rounded-full"
              src="/lovable-uploads/782b9ab1-c9c7-4b24-8b4a-afca4b92620b.png"
              alt="Joe"
            />
          </Avatar>
        </div>
      )}

      <div
        className={cn(
          "relative max-w-[80vw] md:max-w-[40vw] rounded-xl py-3 px-5 shadow-sm",
          isUser
            ? "bg-steel-800 text-white"
            : "bg-white text-steel-900 border border-steel-100"
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
          <Avatar className="h-11 w-11 bg-steel-300 text-white flex items-center justify-center font-bold text-lg">
            U
          </Avatar>
        </div>
      )}
    </div>
  );
}
