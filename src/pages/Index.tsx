
import React from "react";
import { SteelChatbot } from "@/components/SteelChatbot";
import { ChatProvider } from "@/context/ChatContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-steel-100 to-steel-400 p-4 md:p-8 flex items-center justify-center">
      <div className="container mx-auto max-w-3xl h-[calc(100vh-4rem)]">
        <ChatProvider>
          <SteelChatbot />
        </ChatProvider>
      </div>
    </div>
  );
};

export default Index;
