import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { KnowledgeUploader } from "./KnowledgeUploader";
import { SteelChatbot } from "./SteelChatbot";
import { Book, MessageSquare } from "lucide-react";

/**
 * A sliding panel that smoothly transitions between Chat and Knowledge views
 */
export function SlidingPanel() {
  const [activePanel, setActivePanel] = useState<"chat" | "knowledge">("chat");

  return (
    <div className="h-screen relative flex flex-col w-full bg-stone-50">
      {/* Header Tabs */}
      <div className="flex items-center gap-2 w-full bg-white px-4 py-3 shadow-md border-b border-steel-200 z-20">
        <Button
          variant={activePanel === "chat" ? "default" : "outline"}
          onClick={() => setActivePanel("chat")}
          className="flex-1 flex items-center gap-2 justify-center rounded-md text-base"
        >
          <MessageSquare className="h-5 w-5" />
          Chat
        </Button>
        <Button
          variant={activePanel === "knowledge" ? "default" : "outline"}
          onClick={() => setActivePanel("knowledge")}
          className="flex-1 flex items-center gap-2 justify-center rounded-md text-base"
        >
          <Book className="h-5 w-5" />
          Knowledge Base
        </Button>
      </div>

      {/* Sliding Container */}
      <div className="relative flex-1 overflow-hidden">
        {/* Chat Panel */}
        <div
          className={`
            absolute inset-0
            transition-transform duration-300 ease-in-out
            ${activePanel === "chat" ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-full flex overflow-hidden relative">
            <FloatingAvatar />
            <SteelChatbot minimalSidebar />
          </div>
        </div>

        {/* Knowledge Panel */}
        <div
          className={`
            absolute inset-0
            transition-transform duration-300 ease-in-out
            ${activePanel === "knowledge" ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="h-full flex justify-center items-start overflow-auto bg-gradient-to-b from-steel-50 to-steel-100">
            <div className="w-full max-w-xl mx-auto mt-6">
              <KnowledgeUploader />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating Joe avatar in the chat panel
function FloatingAvatar() {
  return (
    <img
      src="/lovable-uploads/123.png"
      alt="Joe Avatar"
      className="absolute left-8 top-0 rounded-full border-4 border-white shadow-md w-16 h-16 z-30 bg-white"
      style={{ transform: "translateY(-55%)" }}
    />
  );
}
