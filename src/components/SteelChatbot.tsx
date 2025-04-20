
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

export function SteelChatbot() {
  const { state, sendMessage, clearChat } = useChat();

  return (
    <div className="flex flex-col-reverse md:flex-row h-[90vh] max-h-[900px] w-full max-w-6xl mx-auto rounded-xl md:rounded-3xl bg-white/95 overflow-hidden border border-steel-200 shadow-xl">

      {/* Chat Area (Left, Main Column) */}
      <div className="flex flex-col flex-1 bg-gradient-to-b from-white via-steel-50 to-steel-100 px-0 py-0">
        {/* Header With Avatar + Title */}
        <div className="flex items-center gap-4 px-6 pt-8 pb-4 border-b border-steel-100 bg-white/80 z-10">
          <JoeAvatar />
          <div className="flex-1 min-w-0 ml-6">
            <h1 className="text-2xl sm:text-3xl font-bold font-playfair text-steel-800 truncate">
              Joe - Steel Industry Expert
            </h1>
            <p className="text-steel-600 text-[1rem] truncate">Elite guidance for the steel industry</p>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <ApiKeyInput />
            <Button
              variant="outline"
              size="icon"
              onClick={clearChat}
              className="h-10 w-10 border-steel-200 bg-steel-100 hover:bg-steel-200 text-steel-800"
              title="Clear chat"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Clear chat</span>
            </Button>
          </div>
        </div>
        
        {/* Chat Body (Scrollable) */}
        <div className="flex-1 min-h-0 max-h-[66vh] md:max-h-none flex flex-col min-w-0 overflow-hidden">
          <ChatWindow messages={state.messages} isLoading={state.isLoading} />
        </div>

        {/* Chat Input */}
        <div className="px-4 pb-5 pt-3 bg-gradient-to-t from-white via-white/95 to-white/20 border-t border-steel-100">
          <ChatInput onSendMessage={sendMessage} isLoading={state.isLoading} />
        </div>
      </div>

      {/* Knowledge Base Sidebar (Right) */}
      <aside className="w-full md:w-[350px] max-w-full md:max-w-[430px] border-b md:border-b-0 md:border-l border-steel-100 bg-white/80 flex flex-col justify-between z-1 relative">
        {/* Areas of Expertise */}
        <section className="p-6 border-b border-steel-100">
          <h2 className="font-bold text-lg font-playfair text-steel-700 mb-1">Areas of Expertise</h2>
          <p className="text-steel-500 text-[.98rem] mb-4">
            Ask Joe about any of these topics!
          </p>
          <div className="space-y-3">
            {expertiseAreas.slice(0, 4).map((expertise) => (
              <ExpertiseArea key={expertise.title} expertise={expertise} />
            ))}
          </div>
        </section>

        {/* Quick Questions */}
        <section className="p-6 border-b border-steel-100">
          <h3 className="text-base font-semibold text-steel-700 mb-2">Quick Questions</h3>
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start text-left text-sm bg-white hover:bg-steel-100 font-medium"
              onClick={() => sendMessage("What's the best way to manage steel inventory?")}>
              How to manage steel inventory?
            </Button>
            <Button variant="outline" className="justify-start text-left text-sm bg-white hover:bg-steel-100 font-medium"
              onClick={() => sendMessage("What quality checks are critical for steel production?")}>
              Critical quality checks?
            </Button>
            <Button variant="outline" className="justify-start text-left text-sm bg-white hover:bg-steel-100 font-medium"
              onClick={() => sendMessage("How can ERP systems help in steel production tracking?")}>
              ERP for production tracking?
            </Button>
          </div>
        </section>

        {/* Knowledge Base Upload/Settings */}
        <section className="p-4 pt-5 bg-white">
          <KnowledgeUploader />
        </section>
      </aside>
    </div>
  );
}
