
import React from "react";
import { useChat } from "@/context/ChatContext";
import { ChatWindow } from "./chat/ChatWindow";
import { ChatInput } from "./chat/ChatInput";
import { JoeAvatar } from "./chat/JoeAvatar";
import { ExpertiseArea } from "./chat/ExpertiseArea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ApiKeyInput } from "./ApiKeyInput";
import { KnowledgeUploader } from "./KnowledgeUploader";
import { expertiseAreas } from "@/data/expertiseData";

// Modern ChatGPT-like layout: fixed sidebar, wide chat area, isolated scrolling.
export function SteelChatbot() {
  const { state, sendMessage, clearChat } = useChat();

  return (
    <div className="flex bg-stone-50 min-h-[100vh] w-full">
      {/* Sidebar: Expertise & Knowledge */}
      <aside className="flex flex-col h-[98vh] w-[385px] max-w-full bg-white/90 border-r border-steel-200 px-0 py-0 shadow-lg z-10">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Avatar + API & Clear */}
          <div className="flex flex-col items-center gap-5 py-7 px-3 border-b border-steel-100">
            <JoeAvatar />
            <ApiKeyInput />
            <Button
              variant="outline"
              size="icon"
              onClick={clearChat}
              className="h-9 w-9 border-steel-200 bg-steel-100 hover:bg-steel-200 text-steel-800 mt-2"
              title="Clear chat"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Clear chat</span>
            </Button>
          </div>
          
          {/* Areas of Expertise - Scrollable */}
          <section className="flex-1 min-h-[220px] overflow-y-auto px-4 py-6 border-b border-steel-100">
            <h2 className="font-bold text-lg font-playfair text-steel-700 mb-1">Areas of Expertise</h2>
            <div className="space-y-3 mt-4">
              {expertiseAreas.map((expertise) => (
                <ExpertiseArea key={expertise.title} expertise={expertise} />
              ))}
            </div>
          </section>
          
          {/* Knowledge Base uploads */}
          <section className="px-3 py-5">
            <KnowledgeUploader />
          </section>
        </div>
      </aside>

      {/* Main Chat Column */}
      <main className="flex flex-col flex-1 min-w-0 h-[98vh] bg-gradient-to-b from-white via-steel-50 to-steel-100">
        {/* Chat header */}
        <div className="w-full px-0 lg:px-8 py-7 border-b border-steel-200 bg-white/80 flex items-center justify-between z-10">
          <div>
            <h1 className="text-3xl font-bold font-playfair text-steel-800">Joe - Steel Industry Expert</h1>
            <p className="text-steel-600 text-base font-normal">Elite guidance for the steel industry. All knowledge sourced from your uploads or ChatGPT fallback.</p>
          </div>
          {/* Quick questions - moved to top right for clarity */}
          <div className="flex flex-col gap-2 ml-auto">
            <Button variant="outline"
              className="justify-start text-left text-sm bg-white hover:bg-steel-100 font-medium"
              onClick={() => sendMessage("What's the best way to manage steel inventory?")}>
              How to manage steel inventory?
            </Button>
            <Button variant="outline"
              className="justify-start text-left text-sm bg-white hover:bg-steel-100 font-medium"
              onClick={() => sendMessage("What quality checks are critical for steel production?")}>
              Critical quality checks?
            </Button>
            <Button variant="outline"
              className="justify-start text-left text-sm bg-white hover:bg-steel-100 font-medium"
              onClick={() => sendMessage("How can ERP systems help in steel production tracking?")}>
              ERP for production tracking?
            </Button>
          </div>
        </div>
        
        {/* Chat messages area: Large, smooth, scrollable only here */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2 md:px-6 py-6"
             style={{ maxHeight: "calc(98vh - 200px)" }}>
          <ChatWindow messages={state.messages} isLoading={state.isLoading} />
        </div>
        
        {/* Chat input (sticky bottom) */}
        <div className="px-2 md:px-8 pb-6 pt-1 bg-white/95 border-t border-steel-100">
          <ChatInput onSendMessage={sendMessage} isLoading={state.isLoading} />
        </div>
      </main>
    </div>
  );
}
