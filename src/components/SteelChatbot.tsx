import React from "react";
import { useChat } from "../context/ChatContext";
import { ChatWindow } from "./chat/ChatWindow";
import { ChatInput } from "./chat/ChatInput";
import { ApiKeyInput } from "./ApiKeyInput";
import { JoeAvatar } from "./chat/JoeAvatar";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

interface SteelChatbotProps {
  minimalSidebar?: boolean;
}

export function SteelChatbot({ minimalSidebar }: SteelChatbotProps = {}) {
  const { messages, isLoading, sendMessage, clearChat, isSpeaking } = useChat();

  return (
    <div className="flex h-[95vh] w-full overflow-hidden bg-white">
      {/* Avatar Left Side: 75% (Large phone display) */}
      <div className="w-[75%] flex flex-col items-center justify-center bg-white transition-colors duration-500">
        <div className="flex flex-col items-center justify-center h-full w-full">
          {/* GIANT Phone */}
          <div
            className="relative flex flex-col items-center justify-center bg-black shadow-xl rounded-[2rem] overflow-hidden"
            style={{
              width: "calc(100vw * 0.70)",
              maxWidth: "920px",
              height: "calc(100vh * 0.88)",
              minHeight: 0,
              background: "linear-gradient(140deg, #222 82%, #31323a 100%)",
              padding: "0px",
            }}
          >
            {/* Fake notch */}
            <div className="w-32 h-2 bg-[#222b] rounded-b-xl mx-auto mt-2 mb-2" />
            {/* JoeAvatar fills below notch */}
            <JoeAvatar isSpeaking={isSpeaking} />
          </div>
          <div className="flex items-center gap-3 mt-8">
            <ApiKeyInput />
            <Button
              variant="outline"
              size="icon"
              onClick={clearChat}
              className="h-10 w-10 hover:bg-black hover:text-white bg-white text-black border-black"
              title="Clear chat"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Clear chat</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Chat Right Side: 25% */}
      <div className="w-[25%] flex flex-col bg-white text-black border-l border-black min-h-0 h-full">
        <div className="flex-1 flex flex-col justify-end overflow-y-auto" style={{ minHeight: 0 }}>
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>
        <div className="p-5 border-t border-black bg-white" style={{ minHeight: "110px" }}>
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

