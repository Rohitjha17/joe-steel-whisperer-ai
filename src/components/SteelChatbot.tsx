
import React from "react";
import { useChat } from "@/context/ChatContext";
import { ChatWindow } from "./chat/ChatWindow";
import { ChatInput } from "./chat/ChatInput";
import { JoeAvatar } from "./chat/JoeAvatar";
import { ExpertiseArea } from "./chat/ExpertiseArea";
import { expertiseAreas } from "@/data/expertiseData";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";

export function SteelChatbot() {
  const { state, sendMessage, clearChat } = useChat();
  
  return (
    <div className="flex flex-col h-full lg:flex-row gap-6">
      {/* Main Chat Section */}
      <div className="flex flex-col flex-1 overflow-hidden rounded-xl border shadow-lg bg-white">
        {/* Header */}
        <div className="flex items-center gap-4 border-b p-4 bg-steel-700 text-white">
          <JoeAvatar />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Joe - Steel Industry Expert</h1>
            <p className="text-steel-200">40 years of steel industry experience at your service</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={clearChat}
              className="h-8 w-8 border-steel-500 bg-steel-600 text-white hover:bg-steel-500 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear chat</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                sendMessage("Hi Joe, can you introduce yourself?");
              }}
              className="h-8 w-8 border-steel-500 bg-steel-600 text-white hover:bg-steel-500 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Start new conversation</span>
            </Button>
          </div>
        </div>
        
        {/* Chat Messages */}
        <ChatWindow messages={state.messages} isLoading={state.isLoading} />
        
        {/* Input Area */}
        <ChatInput onSendMessage={sendMessage} isLoading={state.isLoading} />
      </div>
      
      {/* Sidebar with Expertise Areas */}
      <div className="w-full lg:w-80 xl:w-96 rounded-xl border shadow-lg bg-white overflow-hidden">
        <div className="bg-steel-700 p-4 text-white">
          <h2 className="text-xl font-bold">Areas of Expertise</h2>
          <p className="text-steel-200">Joe can help with these key areas</p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 max-h-[calc(100vh-250px)] overflow-y-auto">
          {expertiseAreas.map((expertise) => (
            <ExpertiseArea key={expertise.title} expertise={expertise} />
          ))}
        </div>
        <div className="border-t p-4 bg-steel-50">
          <h3 className="text-sm font-medium text-steel-700 mb-2">Quick Questions</h3>
          <div className="grid gap-2">
            <Button 
              variant="outline" 
              className="justify-start text-left text-sm border-steel-200 hover:bg-steel-100" 
              onClick={() => sendMessage("What's the best way to manage steel inventory?")}
            >
              How to manage steel inventory?
            </Button>
            <Button 
              variant="outline" 
              className="justify-start text-left text-sm border-steel-200 hover:bg-steel-100" 
              onClick={() => sendMessage("What quality checks are critical for steel production?")}
            >
              Critical quality checks?
            </Button>
            <Button 
              variant="outline" 
              className="justify-start text-left text-sm border-steel-200 hover:bg-steel-100" 
              onClick={() => sendMessage("How can ERP systems help in steel production tracking?")}
            >
              ERP for production tracking?
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
