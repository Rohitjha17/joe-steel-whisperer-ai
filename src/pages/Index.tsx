
import React from "react";
import { SlidingPanel } from "@/components/SlidingPanel";
import { ChatProvider } from "@/context/ChatContext";

const Index = () => {
  return (
    <ChatProvider>
      <SlidingPanel />
    </ChatProvider>
  );
};

export default Index;
