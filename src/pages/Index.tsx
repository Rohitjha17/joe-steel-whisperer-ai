import React from "react";
import { SteelChatbot } from "@/components/SteelChatbot";
import { ChatProvider } from "@/context/ChatContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          {/* Large Square Avatar Container */}
          <div className="w-[400px] h-[400px] mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src="/lovable-uploads/123.png"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Chat Interface */}
          <div className="w-full max-w-2xl">
            <ChatProvider>
              <SteelChatbot />
            </ChatProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
