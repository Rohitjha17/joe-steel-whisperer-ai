import React from "react";
import { SteelChatbot } from "@/components/SteelChatbot";
import { ChatProvider } from "@/context/ChatContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full h-[calc(100vh-2rem)]">
        <ChatProvider>
          <SteelChatbot />
        </ChatProvider>
      </div>
    </div>
  );
};

export default Index;
