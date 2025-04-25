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
              onError={(e) => {
                console.error("Image failed to load");
                e.currentTarget.src = "/lovable-uploads/badd8c45-08b2-4c69-a3c3-8f33e10750e5.png"; // Fallback image
              }}
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
