import React, { createContext, useContext, useReducer, useCallback, useEffect, useState } from "react";
import { VoiceResponse } from "../components/VoiceResponse";
import { Message } from "../types/chat";
import OpenAI from "openai";

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

interface ChatContextType extends ChatState {
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  isSpeaking: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

type ChatAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_CHAT" };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload, error: null };
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "CLEAR_CHAT":
      return { ...initialState };
    default:
      return state;
  }
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) {
      dispatch({
        type: "SET_ERROR",
        payload: "Please set your OpenAI API key first",
      });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    dispatch({ type: "ADD_MESSAGE", payload: userMessage });

    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are Joe, an expert in the steel industry. You have extensive knowledge about steel operations, procurement, quality control, and production processes. Provide detailed, accurate, and practical advice while maintaining a professional yet approachable tone."
          },
          ...state.messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const assistantMessage = response.choices[0]?.message?.content;
      if (!assistantMessage) throw new Error("No response from API");

      const fullAssistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantMessage,
        timestamp: new Date(),
      };

      dispatch({
        type: "ADD_MESSAGE",
        payload: fullAssistantMessage,
      });
      
      // Set the current response for voice synthesis
      setCurrentResponse(assistantMessage);

    } catch (error) {
      console.error('Chat error:', error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to get response from OpenAI. Please check your API key and try again.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.messages]);

  const clearChat = useCallback(() => {
    dispatch({ type: "CLEAR_CHAT" });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        ...state,
        sendMessage,
        clearChat,
        isSpeaking,
      }}
    >
      {children}
      {/* Voice response component */}
      {currentResponse && (
        <VoiceResponse
          text={currentResponse}
          onStart={() => setIsSpeaking(true)}
          onEnd={() => {
            setIsSpeaking(false);
            setCurrentResponse(null);
          }}
        />
      )}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
