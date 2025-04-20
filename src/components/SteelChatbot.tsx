import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatWindow } from "./chat/ChatWindow";
import { ChatInput } from "./chat/ChatInput";
import { JoeAvatar } from "./chat/JoeAvatar";
import { ExpertiseArea } from "./chat/ExpertiseArea";
import { expertiseAreas } from "@/data/expertiseData";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ApiKeyInput } from "./ApiKeyInput";
import { KnowledgeUploader } from "./KnowledgeUploader";

// Simple & clean, ChatGPT-style: chat left, sidebar right, max vertical space, all structure clear, nothing overlapping.

export function SteelChatbot() {
  const { state, sendMessage, clearChat } = useChat();
  const [activeTab, setActiveTab] = useState<"chat" | "knowledge">("chat");

  return (
    <div className="flex w-full max-w-6xl h-[700px] mx-auto rounded-3xl shadow-xl bg-white/95 overflow-hidden border border-steel-200">
      {/* Chat Section (Left) */}
      <div className="flex flex-col flex-1 min-w-0 bg-gradient-to-b from-white via-steel-50 to-steel-100 py-8 px-6">
        {/* Header */}
        <div className="flex items-center gap-5 border-b border-steel-100 pb-6 mb-4">
          <JoeAvatar />
          <div className="flex-1 min-w-0 ml-6">
            <h1 className="text-3xl font-bold font-playfair text-steel-800 truncate">
              Joe - Steel Industry Expert
            </h1>
            <p className="text-steel-600 text-lg truncate">Elite guidance for the steel industry</p>
          </div>
          <div className="flex gap-2 items-center">
            <ApiKeyInput />
            <Button
              variant="outline"
              size="icon"
              onClick={clearChat}
              className="h-10 w-10 border-steel-200 bg-steel-100 hover:bg-steel-200 text-steel-800"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Clear chat</span>
            </Button>
          </div>
        </div>
        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatWindow messages={state.messages} isLoading={state.isLoading} />
        </div>
        {/* Input Area */}
        <div className="pt-3 pb-2">
          <ChatInput onSendMessage={sendMessage} isLoading={state.isLoading} />
        </div>
      </div>
      {/* Sidebar (Right) */}
      <div className="w-[340px] min-w-[300px] max-w-[400px] border-l border-steel-200 bg-steel-50/70 flex flex-col justify-between">
        <div className="p-6 border-b border-steel-100">
          <h2 className="font-bold text-xl font-playfair text-steel-700 mb-1">Areas of Expertise</h2>
          <p className="text-steel-500 text-base mb-4">
            Ask Joe about any of these topics!
          </p>
          <div className="space-y-3">
            {expertiseAreas.slice(0, 4).map((expertise) => (
              <ExpertiseArea key={expertise.title} expertise={expertise} />
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-steel-100">
          <h3 className="text-base font-semibold text-steel-700 mb-2">Quick Questions</h3>
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start text-left text-sm bg-white hover:bg-steel-100 font-medium"
              onClick={() => {
                setActiveTab("chat");
                sendMessage("What's the best way to manage steel inventory?");
              }}>
              How to manage steel inventory?
            </Button>
            <Button variant="outline" className="justify-start text-left text-sm bg-white hover:bg-steel-100 font-medium"
              onClick={() => {
                setActiveTab("chat");
                sendMessage("What quality checks are critical for steel production?");
              }}>
              Critical quality checks?
            </Button>
            <Button variant="outline" className="justify-start text-left text-sm bg-white hover:bg-steel-100 font-medium"
              onClick={() => {
                setActiveTab("chat");
                sendMessage("How can ERP systems help in steel production tracking?");
              }}>
              ERP for production tracking?
            </Button>
          </div>
        </div>
        <div className="p-4 border-t border-steel-100">
          <KnowledgeUploader />
        </div>
      </div>
    </div>
  );
}
