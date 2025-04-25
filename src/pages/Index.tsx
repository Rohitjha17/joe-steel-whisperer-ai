import React from "react";
import { SteelChatbot } from "@/components/SteelChatbot";
import { ChatProvider } from "@/context/ChatContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full h-[calc(100vh-2rem)] flex">
        {/* Avatar on the left */}
        <div className="w-[400px] h-[400px] mr-8 rounded-lg overflow-hidden shadow-lg self-center">
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
        {/* Chat area on the right */}
        <div className="flex-1">
          <ChatProvider>
            <SteelChatbot />
          </ChatProvider>
        </div>
      </div>
    </div>
  );
};

export default Index;
