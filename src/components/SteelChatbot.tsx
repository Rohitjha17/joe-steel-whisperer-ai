
import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatWindow } from "./chat/ChatWindow";
import { ChatInput } from "./chat/ChatInput";
import { JoeAvatar } from "./chat/JoeAvatar";
import { ExpertiseArea } from "./chat/ExpertiseArea";
import { expertiseAreas } from "@/data/expertiseData";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw, Database, MessageSquare } from "lucide-react";
import { ApiKeyInput } from "./ApiKeyInput";
import { KnowledgeUploader } from "./KnowledgeUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SteelChatbot() {
  const { state, sendMessage, clearChat } = useChat();
  const [activeTab, setActiveTab] = useState<"chat" | "knowledge">("chat");

  return (
    <div className="flex flex-col h-full lg:flex-row gap-10">
      {/* Main Chat Section */}
      <div className="flex flex-col flex-1 overflow-hidden rounded-[42px] border border-steel-200 shadow-2xl bg-gradient-to-br from-white/85 to-steel-100/90 glass-morphism" style={{ backdropFilter: "blur(16px)" }}>
        {/* Header */}
        <div className="flex items-center gap-7 border-b p-8 bg-steel-700 text-white rounded-t-[42px]">
          <JoeAvatar />
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold font-playfair truncate mb-1">Joe - Steel Industry Expert</h1>
            <p className="text-steel-100 text-lg md:text-xl truncate font-medium">40 years at the top of steel – at your service</p>
          </div>
          <div className="flex gap-3">
            <ApiKeyInput />
            <Button
              variant="outline"
              size="icon"
              onClick={clearChat}
              className="h-9 w-9 border-steel-500 bg-steel-600 text-white hover:bg-steel-500 hover:text-white transition-all"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Clear chat</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                sendMessage("Hi Joe, can you introduce yourself?");
              }}
              className="h-9 w-9 border-steel-500 bg-steel-600 text-white hover:bg-steel-500 hover:text-white transition-all"
            >
              <RefreshCw className="h-5 w-5" />
              <span className="sr-only">Start new conversation</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "chat" | "knowledge")}>
          <TabsList className="w-full grid grid-cols-2 bg-steel-100 rounded-none px-6 py-3 font-semibold">
            <TabsTrigger value="chat" className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              <span>Chat with Joe</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5" />
              <span>Knowledge Base</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex flex-col flex-1 overflow-hidden">
            {/* Chat Messages */}
            <ChatWindow messages={state.messages} isLoading={state.isLoading} />

            {/* Input Area */}
            <div className="pt-1 pb-5 px-3">
              <ChatInput onSendMessage={sendMessage} isLoading={state.isLoading} />
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="flex-1 overflow-y-auto">
            <KnowledgeUploader />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar with Expertise Areas */}
      <div className="w-full lg:w-80 xl:w-96 rounded-[42px] border border-steel-200 shadow-2xl bg-gradient-to-tr from-steel-100/90 to-white/85 overflow-hidden flex flex-col glass-morphism">
        <div className="bg-steel-700 p-7 text-white rounded-t-[42px]">
          <h2 className="text-2xl font-bold font-playfair">Areas of Expertise</h2>
          <p className="text-steel-200 text-lg">Joe can help with these key areas</p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
          {expertiseAreas.map((expertise) => (
            <ExpertiseArea key={expertise.title} expertise={expertise} />
          ))}
        </div>
        <div className="border-t p-6 bg-steel-50/80">
          <h3 className="text-base font-medium text-steel-700 mb-3">Quick Questions</h3>
          <div className="grid gap-3">
            <Button 
              variant="outline" 
              className="justify-start text-left text-base border-steel-200 hover:bg-steel-100 font-semibold hover-scale transition-transform"
              onClick={() => {
                setActiveTab("chat");
                sendMessage("What's the best way to manage steel inventory?");
              }}
            >
              How to manage steel inventory?
            </Button>
            <Button 
              variant="outline" 
              className="justify-start text-left text-base border-steel-200 hover:bg-steel-100 font-semibold hover-scale transition-transform"
              onClick={() => {
                setActiveTab("chat");
                sendMessage("What quality checks are critical for steel production?");
              }}
            >
              Critical quality checks?
            </Button>
            <Button 
              variant="outline" 
              className="justify-start text-left text-base border-steel-200 hover:bg-steel-100 font-semibold hover-scale transition-transform"
              onClick={() => {
                setActiveTab("chat");
                sendMessage("How can ERP systems help in steel production tracking?");
              }}
            >
              ERP for production tracking?
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
