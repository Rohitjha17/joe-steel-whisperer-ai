
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { ChatState, Message } from "@/types/chat";
import { sendMessageToChatGPT } from "@/services/chatService";
import { toast } from "@/components/ui/sonner";

// Initial state
const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  apiKey: localStorage.getItem("chatgpt_api_key") || null,
};

// Action types
type ChatAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_CHAT" }
  | { type: "SET_API_KEY"; payload: string | null };

// Reducer function
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "CLEAR_CHAT":
      return {
        ...state,
        messages: [],
      };
    case "SET_API_KEY":
      return {
        ...state,
        apiKey: action.payload,
      };
    default:
      return state;
  }
}

// Context
interface ChatContextType {
  state: ChatState;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  setApiKey: (key: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (state.apiKey) {
      localStorage.setItem("chatgpt_api_key", state.apiKey);
    } else {
      localStorage.removeItem("chatgpt_api_key");
    }
  }, [state.apiKey]);

  // Send a message
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    // Add user message to state
    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    
    // Set loading state
    dispatch({ type: "SET_LOADING", payload: true });
    
    try {
      // Get response from AI
      const messages = [...state.messages, userMessage];
      const response = await sendMessageToChatGPT(messages, state.apiKey);
      
      // Add AI response to state
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      dispatch({ type: "ADD_MESSAGE", payload: assistantMessage });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error("AI Response Error", {
        description: errorMessage
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Clear chat
  const clearChat = () => {
    dispatch({ type: "CLEAR_CHAT" });
  };

  // Set API key
  const setApiKey = (key: string) => {
    dispatch({ type: "SET_API_KEY", payload: key });
    toast.success(key ? "API Key Set" : "API Key Cleared", {
      description: key ? "Using OpenAI API for responses" : "Using simulated responses"
    });
  };

  return (
    <ChatContext.Provider value={{ state, sendMessage, clearChat, setApiKey }}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook to use the chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
