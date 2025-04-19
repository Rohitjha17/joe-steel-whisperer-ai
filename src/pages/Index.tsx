
import React from "react";
import { SteelChatbot } from "@/components/SteelChatbot";
import { ChatProvider } from "@/context/ChatContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-steel-100 to-steel-400 p-4 md:p-10 flex items-center justify-center">
      <div className="container mx-auto max-w-6xl h-[calc(100vh-4rem)] flex flex-col justify-between">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-steel-900 drop-shadow-lg tracking-wide font-playfair">
            Joe – The Steel Industry Veteran Chatbot
          </h1>
          <p className="mt-3 text-xl text-steel-700">
            Elite guidance and operational insights inspired by 40+ years of steel industry excellence
          </p>
        </div>
        
        <ChatProvider>
          <SteelChatbot />
        </ChatProvider>
        
        <footer className="mt-8 text-center text-base text-steel-600 font-semibold">
          <p>© 2025 EOXS ERP Systems • Powered by AI and genuine steel industry expertise</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
