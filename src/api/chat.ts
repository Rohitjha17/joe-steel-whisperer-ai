// Mock response for development
export async function sendChatMessage(message: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    response: `This is a mock response to: "${message}". The actual API integration will be implemented later.`
  };
} 