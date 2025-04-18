
import { Message } from "@/types/chat";
import OpenAI from "openai";
import { searchDocuments } from "./vectorService";

export async function sendMessageToChatGPT(messages: Message[], apiKey: string | null): Promise<string> {
  try {
    // If no API key is provided, use simulated responses
    if (!apiKey) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the last user message for context
      const lastUserMessage = messages[messages.length - 1].content;
      
      // Generate a simulated response based on the last user message
      return generateSimulatedResponse(lastUserMessage);
    }

    try {
      // Initialize OpenAI client with the provided API key
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: In production, API calls should be made from a backend
      });

      // Get the last user message for searching the knowledge base
      const lastUserMessage = messages[messages.length - 1].content;
      
      // Get Pinecone config from localStorage if available
      const pineconeApiKey = localStorage.getItem("pinecone_api_key");
      const pineconeEnvironment = localStorage.getItem("pinecone_environment");
      const usePinecone = localStorage.getItem("use_pinecone") === "true";
      
      // Search the vector database for relevant documents - handle empty results gracefully
      let relevantDocuments = [];
      try {
        if (usePinecone && pineconeApiKey && pineconeEnvironment) {
          relevantDocuments = await searchDocuments(
            lastUserMessage, 
            apiKey, 
            3, 
            pineconeApiKey, 
            pineconeEnvironment
          );
        } else {
          relevantDocuments = await searchDocuments(lastUserMessage, apiKey, 3);
        }
      } catch (searchError) {
        console.log("Error searching documents, proceeding without relevant documents", searchError);
        relevantDocuments = [];
      }
      
      // Convert our message format to OpenAI's expected format
      const formattedMessages = messages.map(msg => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content
      }));
      
      // Create the system message with Joe's persona
      const baseSystemMessage = 
        "You are Joe, a 40-year veteran of the steel industry with extensive knowledge in procurement, " +
        "inventory management, vendor bill processing, quality checks, sales, dispatch, and production tracking. " +
        "You have a friendly but straightforward demeanor, speak with authority on steel industry topics, and " +
        "occasionally use industry-specific terminology. Your responses should reflect your decades of " +
        "experience in steel mills and ERP systems. You're here to assist users with their steel industry and ERP-related questions.";
      
      let systemMessage;
      
      // If we have relevant documents, include them in the system message
      if (relevantDocuments.length > 0) {
        const contextText = relevantDocuments.map(doc => {
          return `Document: ${doc.metadata.source}, Section: ${doc.metadata.section || 'N/A'}\n${doc.text}\n\n`;
        }).join('');
        
        systemMessage = {
          role: "system" as const,
          content: `${baseSystemMessage}\n\nUse the following information from internal documents to answer the user's questions. If the information doesn't fully answer the question, use your general knowledge but prioritize this information:\n\n${contextText}`
        };
        
        console.log("Using RAG with relevant documents:", relevantDocuments.map(doc => doc.metadata.source));
      } else {
        systemMessage = {
          role: "system" as const,
          content: baseSystemMessage
        };
        
        console.log("No relevant documents found, using standard ChatGPT response");
      }

      console.log("Sending request to OpenAI with:", {
        model: "gpt-4o-mini",
        messages: [systemMessage, ...formattedMessages],
        apiKey: apiKey ? "Valid API key provided" : "No API key"
      });

      // Real OpenAI API call
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          systemMessage,
          ...formattedMessages
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      console.log("OpenAI API response:", completion);

      // Check if response is valid
      if (!completion.choices || completion.choices.length === 0) {
        throw new Error("No response received from OpenAI");
      }

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error("Empty response content from OpenAI");
      }

      // If we used relevant documents, append source information
      if (relevantDocuments.length > 0) {
        const uniqueSources = [...new Set(relevantDocuments.map(doc => doc.metadata.source))];
        const sourceInfo = `\n\n(Information sourced from: ${uniqueSources.join(', ')})`;
        return content + sourceInfo;
      }

      return content;
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      // Fall back to simulated responses on API error
      const lastUserMessage = messages[messages.length - 1].content;
      return generateSimulatedResponse(lastUserMessage) + " (Note: Using simulated response due to API error)";
    }
  } catch (error) {
    console.error("Error sending message to ChatGPT:", error);
    
    // Extract more detailed error information
    const errorMessage = error instanceof Error 
      ? `${error.name}: ${error.message}` 
      : "Unknown error occurred";
      
    console.error("Detailed error:", errorMessage);
    
    // Return a helpful message instead of throwing
    return "I apologize, but I'm having trouble processing your request right now. Please check your API key or try again later.";
  }
}

// This function simulates responses for demo purposes when no API key is provided
function generateSimulatedResponse(userMessage: string): string {
  const userMessageLower = userMessage.toLowerCase();
  
  if (userMessageLower.includes("hello") || userMessageLower.includes("hi")) {
    return "Hello there! I'm Joe, with over 40 years in the steel industry. How can I help you today with your steel operations or ERP questions?";
  }
  
  if (userMessageLower.includes("procurement") || userMessageLower.includes("buy") || userMessageLower.includes("purchase")) {
    return "Procurement in the steel industry requires careful consideration of quality, lead times, and price fluctuations. I've overseen purchasing for mills handling thousands of tons monthly. What specific procurement challenge are you facing?";
  }
  
  if (userMessageLower.includes("inventory") || userMessageLower.includes("stock")) {
    return "Inventory management in steel is a balancing act. Too much ties up capital, too little risks production delays. In my experience, a good ERP system with real-time tracking has been essential. Are you having specific inventory challenges?";
  }
  
  if (userMessageLower.includes("quality") || userMessageLower.includes("testing")) {
    return "Quality control is non-negotiable in our industry. From tensile strength to chemical composition, every batch needs rigorous testing. Modern mills use both automated inline testing and lab verification. What quality parameters are you concerned about?";
  }
  
  if (userMessageLower.includes("sales") || userMessageLower.includes("customer") || userMessageLower.includes("order")) {
    return "Sales in the steel business is relationship-driven. Most of my major customers stayed with us for decades. Good ERP integration helps with accurate delivery promises and specialized pricing structures. How can I help with your sales process?";
  }
  
  if (userMessageLower.includes("production") || userMessageLower.includes("manufacturing")) {
    return "Production tracking needs to account for every step - from melting to casting to rolling and finishing. Real-time data collection at each workstation lets you identify bottlenecks quickly. What aspect of production are you looking to optimize?";
  }
  
  if (userMessageLower.includes("erp") || userMessageLower.includes("system") || userMessageLower.includes("software")) {
    return "A good ERP system is the backbone of modern steel operations. It should integrate seamlessly across departments - from order entry to shipping. EOXS ERP specializes in the unique workflows of steel businesses. What functionality are you most interested in?";
  }
  
  // Default response
  return "That's an interesting question about the steel industry. Throughout my 40 years working in mills and with ERP systems, I've seen many changes in how we approach operations. Could you provide more details about your specific situation so I can share the most relevant experiences?";
}
