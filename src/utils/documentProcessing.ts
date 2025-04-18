
import { OpenAI } from "openai";
import * as pdfParse from 'pdf-parse';

// Function to process and chunk text from a document
export const processText = (text: string, chunkSize = 1000, overlap = 200): string[] => {
  const chunks: string[] = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    // Calculate the end index for the current chunk
    let endIndex = startIndex + chunkSize;
    
    // If we're not at the end of the text, try to find a good break point
    if (endIndex < text.length) {
      // Look for a period, question mark, or exclamation point followed by a space or newline
      const breakPoint = text.substring(endIndex - 100, endIndex + 100).search(/[.!?]\s/);
      
      if (breakPoint > 0) {
        endIndex = endIndex - 100 + breakPoint + 2; // +2 to include the punctuation and space
      }
    }
    
    // Add the chunk to our list
    chunks.push(text.substring(startIndex, endIndex));
    
    // Move the start index for the next chunk, accounting for overlap
    startIndex = endIndex - overlap;
  }
  
  return chunks;
};

// Process a PDF file and extract the text content
export const processPDF = async (pdfBuffer: ArrayBuffer): Promise<string[]> => {
  try {
    const pdfData = await pdfParse(Buffer.from(pdfBuffer));
    return processText(pdfData.text);
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw new Error("Failed to process PDF file");
  }
};

// Generate embeddings for text chunks
export const generateEmbeddings = async (
  chunks: string[], 
  apiKey: string
): Promise<number[][]> => {
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    
    const embeddings: number[][] = [];
    
    // Process chunks in batches to avoid rate limits
    for (let i = 0; i < chunks.length; i++) {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: chunks[i],
      });
      
      embeddings.push(response.data[0].embedding);
      
      // Simple delay to avoid rate limits
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    return embeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Failed to generate embeddings");
  }
};
