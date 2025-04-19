import { OpenAI } from "openai";

// Function to process and chunk text from a document
export const processText = (text: string, chunkSize = 1000, overlap = 200): string[] => {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;

    if (endIndex < text.length) {
      // Try to avoid splitting in the middle of a word/sentence
      const nearby = text.substring(Math.max(0, endIndex - 100), Math.min(text.length, endIndex + 100));
      const breakPoint = nearby.search(/[.!?]\s/);
      if (breakPoint > 0) {
        endIndex = Math.max(0, endIndex - 100) + breakPoint + 2;
      }
    }

    chunks.push(text.substring(startIndex, endIndex));
    startIndex = endIndex - overlap;
  }

  return chunks;
};

// TXT ONLY: Process a TXT file and extract text chunks
export const processTXT = async (txt: string): Promise<string[]> => {
  return processText(txt);
};

// Generate embeddings for text chunks
export const generateEmbeddings = async (
  chunks: string[], 
  apiKey: string
): Promise<number[][]> => {
  try {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error("Valid API key is required for generating embeddings");
    }
    
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    
    const embeddings: number[][] = [];
    
    // Process chunks in batches to avoid rate limits
    for (let i = 0; i < chunks.length; i++) {
      try {
        const response = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: chunks[i],
        });
        
        embeddings.push(response.data[0].embedding);
        
        // Simple delay to avoid rate limits
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (embeddingError) {
        console.error(`Error generating embedding for chunk ${i}:`, embeddingError);
        // Push an empty embedding to maintain array index alignment
        embeddings.push(new Array(1536).fill(0));
      }
    }
    
    return embeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Failed to generate embeddings: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};
