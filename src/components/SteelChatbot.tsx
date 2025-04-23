
import React from "react";
import { useChat } from "@/context/ChatContext";
import { ChatWindow } from "./chat/ChatWindow";
import { ChatInput } from "./chat/ChatInput";
import { ApiKeyInput } from "./ApiKeyInput";
import { JoeAvatar } from "./chat/JoeAvatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SteelChatbotProps {
  minimalSidebar?: boolean;
}

export function SteelChatbot({ minimalSidebar }: SteelChatbotProps = {}) {
  const { state, sendMessage, clearChat } = useChat();

  return (
    <div className="flex h-[95vh] w-full overflow-hidden bg-white">
      {/* Avatar Left Side: 75% (Phone Simulation) */}
      <div className="w-[75%] flex flex-col items-center justify-center bg-[#18191C] transition-colors duration-500">
        <div className="flex flex-col items-center justify-center h-full">
          {/* Simulated Phone */}
          <div
            className="relative flex flex-col items-center bg-black shadow-2xl border-4 border-[#222] rounded-[2.5rem] p-1"
            style={{
              width: "370px",
              height: "760px",
              maxWidth: "90vw",
              maxHeight: "88vh",
              boxShadow:
                "0 8px 40px 4px rgba(0,0,0,0.45), 0 2px 8px 0 rgba(0,0,0,0.15)",
              background:
                "linear-gradient(140deg, #222 82%, #31323a 100%)",
            }}
          >
            {/* Simulated Notch */}
            <div className="w-24 h-2.5 bg-[#222b] rounded-b-xl mx-auto mt-2 mb-3" />
            {/* Full Rectangular JoeAvatar inside phone */}
            <JoeAvatar />
          </div>
          <div className="flex items-center gap-3 mt-8">
            <ApiKeyInput />
            <Button
              variant="outline"
              size="icon"
              onClick={clearChat}
              className="h-9 w-9 hover:bg-black hover:text-white bg-white text-black border-black"
              title="Clear chat"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Clear chat</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Chat Right Side: 25% */}
      <div className="w-[25%] flex flex-col bg-white text-black border-l border-black">
        <div className="flex-1 overflow-y-auto">
          <ChatWindow messages={state.messages} isLoading={state.isLoading} />
        </div>
        <div className="p-4 border-t border-black bg-white">
          <ChatInput onSendMessage={sendMessage} isLoading={state.isLoading} />
        </div>
      </div>
    </div>
  );
}
