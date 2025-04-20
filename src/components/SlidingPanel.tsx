
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { KnowledgeUploader } from "./KnowledgeUploader";
import { SteelChatbot } from "./SteelChatbot";
import { Book, MessageSquare } from "lucide-react";
/**
 * A simple sliding panel to switch between Chat and Knowledge Base
 */
export function SlidingPanel() {
  const [activePanel, setActivePanel] = useState<"chat" | "knowledge">("chat");

  return (
    <div className="h-screen flex flex-col w-full bg-stone-50 relative">
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
      <div className="flex-1 flex">
        {activePanel === "chat" && (
          <div className="flex-1 flex overflow-hidden h-full relative animate-fade-in">
            <FloatingAvatar />
            <SteelChatbot minimalSidebar />
          </div>
        )}
        {activePanel === "knowledge" && (
          <div className="flex-1 flex justify-center items-start p-0 overflow-auto animate-fade-in bg-gradient-to-b from-steel-50 to-steel-100">
            <div className="w-full max-w-xl mx-auto mt-6"><KnowledgeUploader /></div>
          </div>
        )}
      </div>
    </div>
  );
}

// Avatar floating for the chat area (hardcoded image, update here if needed)
function FloatingAvatar() {
  return (
    <img
      src="/lovable-uploads/782b9ab1-c9c7-4b24-8b4a-afca4b92620b.png"
      alt="Joe Avatar"
      className="absolute left-8 top-0 rounded-full border-4 border-white shadow-md w-16 h-16 z-30 bg-white animate-fade-in"
      style={{ transform: "translateY(-55%)" }}
    />
  );
}
