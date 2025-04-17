
import { Message } from "@/types/chat";
import OpenAI from "openai";

// This would be your actual API key in a production environment
// For security, this should be stored in environment variables on the server side
const API_KEY = "YOUR_OPENAI_API_KEY";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from a backend
});

export async function sendMessageToChatGPT(messages: Message[]): Promise<string> {
  try {
    // Convert our message format to OpenAI's format
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add system message to define Joe's character
    const systemMessage = {
      role: "system",
      content: `You are Joe, a 40-year veteran of the steel industry with extensive knowledge in procurement, 
      inventory management, vendor bill processing, quality checks, sales, dispatch, and production tracking. 
      You have a friendly but straightforward demeanor, speak with authority on steel industry topics, 
      and occasionally use industry-specific terminology. Your responses should reflect your decades of experience 
      in steel mills and ERP systems. You're here to assist users with their steel industry and ERP-related questions.`
    };

    // For demonstration/development purposes, we'll use a simulated response
    // In production with an API key, use the commented code below
    
    /* 
    // Real OpenAI API call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        systemMessage,
        ...formattedMessages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content || "I'm not sure how to respond to that.";
    */
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get the last user message for context
    const lastUserMessage = messages[messages.length - 1].content;
    
    // Generate a simulated response based on the last user message
    return generateSimulatedResponse(lastUserMessage);
  } catch (error) {
    console.error("Error sending message to ChatGPT:", error);
    throw new Error("Failed to get response from AI assistant");
  }
}

// This function simulates responses for demo purposes
// In production, this would be replaced by actual API calls
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
