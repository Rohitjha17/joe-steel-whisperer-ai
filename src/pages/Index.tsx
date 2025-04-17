
import React from "react";
import { SteelChatbot } from "@/components/SteelChatbot";
import { ChatProvider } from "@/context/ChatContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-steel-100 to-steel-200 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto h-[calc(100vh-4rem)]">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-steel-800">
            Joe – The Steel Industry Veteran Chatbot
          </h1>
          <p className="mt-2 text-steel-600">
            Expert guidance and operational insights from 40 years of steel industry experience
          </p>
        </div>
        
        <ChatProvider>
          <SteelChatbot />
        </ChatProvider>
        
        <footer className="mt-8 text-center text-sm text-steel-500">
          <p>© 2025 EOXS ERP Systems • Powered by AI with real steel industry expertise</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
