
import React from "react";
import { Message } from "@/types/chat";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Premium chat message with glass effect; user and Joe stylized
export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex w-full gap-5 md:gap-8 px-1",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <Avatar className="h-14 w-14 bg-steel-700 border-2 border-steel-300 shadow-md overflow-hidden">
            <img
              className="h-full w-full object-cover rounded-full"
              src="/lovable-uploads/b211768e-5f5f-4d1f-a689-9503b674638a.png"
              alt="Joe"
            />
          </Avatar>
        </div>
      )}

      <div
        className={cn(
          "relative max-w-[82vw] md:max-w-[58vw] rounded-xl py-4 px-6 shadow-lg",
          "glass-morphism-strong border border-steel-200/70",
          isUser
            ? "bg-primary/95 text-primary-foreground"
            : "bg-white/90 text-steel-900 dark:bg-steel-900/90 dark:text-steel-100"
        )}
      >
        <div className="prose prose-base dark:prose-invert break-words font-medium tracking-wide">
          {message.content.split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < message.content.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        <div
          className={cn(
            "mt-2 text-xs select-none opacity-55 tracking-wider",
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
          <Avatar className="h-14 w-14 bg-steel-500 text-white border-2 border-steel-300 shadow-md flex items-center justify-center">
            <div className="text-xl font-extrabold">U</div>
          </Avatar>
        </div>
      )}
    </div>
  );
}
