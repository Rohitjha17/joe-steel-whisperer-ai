
import React from "react";
import { useChat } from "@/context/ChatContext";
import { ChatWindow } from "./chat/ChatWindow";
import { ChatInput } from "./chat/ChatInput";
import { ApiKeyInput } from "./ApiKeyInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function SteelChatbot() {
  const { state, sendMessage, clearChat } = useChat();

  return (
    <div className="flex flex-col h-[95vh] bg-white rounded-xl shadow-xl mx-auto overflow-hidden">
      {/* Main Chat Column */}
      <main className="flex-1 flex flex-col relative">
        {/* Top Section with Avatar */}
        <div className="w-full flex flex-col items-center justify-center py-8 bg-gradient-to-b from-steel-100 to-white">
          {/* Large Avatar */}
          <div className="relative mb-4">
            <Avatar className="h-40 w-40 border-4 border-steel-300 shadow-xl bg-white animate-pulse">
              <AvatarImage
                src="/lovable-uploads/badd8c45-08b2-4c69-a3c3-8f33e10750e5.png"
                alt="Joe - Steel Industry Expert"
                className="aspect-square object-cover h-full w-full"
              />
              <AvatarFallback className="bg-steel-700 text-white text-6xl font-extrabold flex items-center justify-center">
                J
              </AvatarFallback>
            </Avatar>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-steel-800 mb-2">Joe - Steel Industry Expert</h1>
          
          <div className="flex items-center gap-3 mt-2">
            <ApiKeyInput />
            <Button
              variant="outline"
              size="icon"
              onClick={clearChat}
              className="h-9 w-9 border-steel-200 bg-steel-100 hover:bg-steel-200 text-steel-800"
              title="Clear chat"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Clear chat</span>
            </Button>
          </div>
        </div>

        {/* Chat Display - Scrollable Area */}
        <div className="flex-1 overflow-y-auto">
          <ChatWindow messages={state.messages} isLoading={state.isLoading} />
        </div>

        {/* Chat Input - Fixed at Bottom */}
        <div className="p-4 bg-white border-t border-steel-100">
          <ChatInput onSendMessage={sendMessage} isLoading={state.isLoading} />
        </div>
      </main>
    </div>
  );
}
