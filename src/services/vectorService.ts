
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from "openai";
import { generateEmbeddings } from "@/utils/documentProcessing";

// Define the structure for a document in the vector database
export interface DocumentChunk {
  id: string;
  text: string;
  metadata: {
    source: string;
    section?: string;
    page?: number;
  };
}

// In-memory storage for vector database (for demo purposes)
// In production, use Pinecone, Supabase, or another vector DB
let inMemoryVectorDB: Array<{
  id: string;
  text: string;
  embedding: number[];
  metadata: any;
}> = [];

// Function to calculate cosine similarity between vectors
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Initialize Pinecone (if using)
// const initPinecone = (apiKey: string, environment: string) => {
//   return new Pinecone({
//     apiKey: apiKey,
//     environment: environment,
//   });
// };

// Store document chunks in the vector database
export const storeDocuments = async (
  chunks: DocumentChunk[],
  apiKey: string
): Promise<void> => {
  try {
    // Generate embeddings for all chunks
    const texts = chunks.map(chunk => chunk.text);
    const embeddings = await generateEmbeddings(texts, apiKey);
    
    // Store documents in memory
    for (let i = 0; i < chunks.length; i++) {
      inMemoryVectorDB.push({
        id: chunks[i].id,
        text: chunks[i].text,
        embedding: embeddings[i],
        metadata: chunks[i].metadata
      });
    }
    
    console.log(`Stored ${chunks.length} document chunks in vector database`);
  } catch (error) {
    console.error("Error storing documents:", error);
    throw new Error("Failed to store documents in vector database");
  }
};

// Search for relevant documents based on a query
export const searchDocuments = async (
  query: string,
  apiKey: string,
  topK: number = 3
): Promise<DocumentChunk[]> => {
  try {
    // If the vector database is empty, return empty results
    if (inMemoryVectorDB.length === 0) {
      return [];
    }
    
    // Generate embedding for the query
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });
    
    const queryEmbedding = response.data[0].embedding;
    
    // Calculate similarity scores
    const similarities = inMemoryVectorDB.map(doc => ({
      document: {
        id: doc.id,
        text: doc.text,
        metadata: doc.metadata
      },
      score: cosineSimilarity(queryEmbedding, doc.embedding)
    }));
    
    // Sort by similarity score and get top K results
    similarities.sort((a, b) => b.score - a.score);
    const topResults = similarities.slice(0, topK);
    
    return topResults.map(result => result.document);
  } catch (error) {
    console.error("Error searching documents:", error);
    throw new Error("Failed to search documents in vector database");
  }
};

// Clear the vector database (for testing/reset purposes)
export const clearVectorDatabase = (): void => {
  inMemoryVectorDB = [];
  console.log("Vector database cleared");
};

// Get the count of documents in the database
export const getDocumentCount = (): number => {
  return inMemoryVectorDB.length;
};
