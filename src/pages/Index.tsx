import React from "react";
import { SteelChatbot } from "@/components/SteelChatbot";
import { ChatProvider } from "@/context/ChatContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full h-[calc(100vh-2rem)]">
        <div className="w-[400px] h-[400px] mx-auto mb-8 rounded-lg overflow-hidden shadow-lg">
          <img
            src="/lovable-uploads/123.png"
            alt="Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Image failed to load");
              e.currentTarget.src = "/lovable-uploads/badd8c45-08b2-4c69-a3c3-8f33e10750e5.png";
            }}
          />
        </div>
        <ChatProvider>
          <SteelChatbot />
        </ChatProvider>
      </div>
    </div>
  );
};

export default Index;
