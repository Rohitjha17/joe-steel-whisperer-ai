
import React from "react";
import { Message } from "@/types/chat";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "flex w-full gap-3 p-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <Avatar className="h-10 w-10 bg-steel-700 text-white">
            <div className="text-lg font-semibold">J</div>
          </Avatar>
        </div>
      )}
      
      <div
        className={cn(
          "relative max-w-[80%] rounded-lg px-4 py-3 shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground dark:bg-steel-800 dark:text-steel-100"
        )}
      >
        <div className="prose prose-sm dark:prose-invert break-words">
          {message.content.split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < message.content.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        <div className={cn(
          "mt-1 text-xs opacity-70",
          isUser ? "text-right" : "text-left"
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0">
          <Avatar className="h-10 w-10 bg-steel-500 text-white">
            <div className="text-lg font-semibold">U</div>
          </Avatar>
        </div>
      )}
    </div>
  );
}
