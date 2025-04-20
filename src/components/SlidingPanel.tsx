
import React, { useState } from "react";
import { SteelChatbot } from "@/components/SteelChatbot";
import { KnowledgeUploader } from "@/components/KnowledgeUploader";
import { Button } from "@/components/ui/button";
import { Book, MessageSquare } from "lucide-react";

// Responsive sliding panel layout
export function SlidingPanel() {
  const [activePanel, setActivePanel] = useState<"chat" | "knowledge">("chat");

  // Responsive: Stack on mobile, side-by-side on desktop
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-steel-100 to-steel-400 p-0">
      <div className="w-full md:w-[1100px] max-w-full h-full md:h-[94vh] bg-white/80 rounded-lg shadow-2xl flex flex-col md:flex-row relative overflow-hidden border border-steel-200">

        {/* Slide toggle buttons at top */}
        <div className="w-full md:hidden flex px-1 pt-4 bg-white/80 z-20 gap-2">
          <Button
            variant={activePanel === "chat" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setActivePanel("chat")}
          >
            <MessageSquare className="inline mr-1 h-4 w-4" /> Chat
          </Button>
          <Button
            variant={activePanel === "knowledge" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setActivePanel("knowledge")}
          >
            <Book className="inline mr-1 h-4 w-4" /> Knowledge Base
          </Button>
        </div>

        {/* Desktop slide toggler—vertical buttons at the top */}
        <div className="hidden md:flex flex-col absolute z-30 left-[50%] top-3 -translate-x-1/2 gap-2 pointer-events-none">
          <div className="flex gap-2 pointer-events-auto bg-white/90 p-1 rounded-full shadow border border-steel-100">
            <Button
              size="sm"
              variant={activePanel === "chat" ? "default" : "outline"}
              className="font-semibold"
              onClick={() => setActivePanel("chat")}
            >
              <MessageSquare className="inline h-4 w-4 mr-1" /> Chat
            </Button>
            <Button
              size="sm"
              variant={activePanel === "knowledge" ? "default" : "outline"}
              className="font-semibold"
              onClick={() => setActivePanel("knowledge")}
            >
              <Book className="inline h-4 w-4 mr-1" /> Knowledge Base
            </Button>
          </div>
        </div>

        {/* The actual panels */}
        <div className="flex flex-1 flex-col md:flex-row w-full h-full overflow-hidden">
          {/* Chat pane */}
          {(activePanel === "chat" || (window.innerWidth >= 768)) && (
            <section
              className={`
                ${activePanel === "chat" ? "" : "hidden md:flex"}
                flex flex-col w-full md:w-[68%] h-full bg-gradient-to-b from-white via-steel-50 to-steel-100 relative
                border-r border-steel-100
              `}
            >
              <FloatingAvatar />
              <SteelChatbot minimalSidebar />
            </section>
          )}
          {/* Knowledge pane */}
          {(activePanel === "knowledge" || (window.innerWidth >= 768)) && (
            <section
              className={`
                ${activePanel === "knowledge" ? "" : "hidden md:flex"}
                flex flex-col w-full md:w-[32%] max-w-full h-full bg-gradient-to-b from-steel-50 to-steel-100 relative
              `}
              style={{ minWidth: 0 }}
            >
              <div className="overflow-y-auto h-full p-3">
                {/* Knowledge Base Uploader and its warnings are handled inside */}
                <KnowledgeUploader />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// FloatingAvatar shown at top of chat panel, absolutely positioned
function FloatingAvatar() {
  return (
    <img
      src="/lovable-uploads/782b9ab1-c9c7-4b24-8b4a-afca4b92620b.png"
      alt="Joe Avatar"
      className="absolute left-5 top-5 rounded-full border-4 border-white shadow-md w-16 h-16 z-40 bg-white animate-fade-in"
      style={{ transform: "translateY(-40%)" }}
      aria-hidden="true"
    />
  );
}
