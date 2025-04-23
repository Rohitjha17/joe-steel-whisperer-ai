
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
    <div className="flex h-[95vh] overflow-hidden">
      {/* Joe Avatar Section - Left (75%) */}
      <div className="w-[75%] flex flex-col items-center justify-center py-8 bg-white border-r border-black">
        <JoeAvatar />
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

      {/* Chat Display and Input - Right (25%) */}
      <div className="w-[25%] flex flex-col bg-black text-white border-l border-black">
        {/* Chat Display */}
        <div className="flex-1 overflow-y-auto">
          <ChatWindow messages={state.messages} isLoading={state.isLoading} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-black bg-black">
          <ChatInput onSendMessage={sendMessage} isLoading={state.isLoading} />
        </div>
      </div>
    </div>
  );
}
