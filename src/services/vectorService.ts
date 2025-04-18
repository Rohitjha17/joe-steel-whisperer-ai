
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

// Initialize Pinecone client
const initPinecone = (apiKey: string, environment: string) => {
  try {
    return new Pinecone({
      apiKey: apiKey,
      environment: environment,
    });
  } catch (error) {
    console.error("Error initializing Pinecone:", error);
    throw new Error("Failed to initialize Pinecone client");
  }
};

// Store document chunks in the vector database
export const storeDocuments = async (
  chunks: DocumentChunk[],
  apiKey: string,
  pineconeApiKey?: string,
  pineconeEnvironment?: string
): Promise<void> => {
  try {
    // Generate embeddings for all chunks
    const texts = chunks.map(chunk => chunk.text);
    const embeddings = await generateEmbeddings(texts, apiKey);
    
    // If Pinecone credentials are provided, store in Pinecone
    if (pineconeApiKey && pineconeEnvironment) {
      try {
        console.log("Initializing Pinecone client...");
        const pinecone = initPinecone(pineconeApiKey, pineconeEnvironment);
        
        // Use the default index or specify one
        const indexName = "joe-knowledge";
        
        try {
          const indexes = await pinecone.listIndexes();
          
          // Check if index exists
          if (!indexes.some(idx => idx.name === indexName)) {
            console.log(`Index '${indexName}' doesn't exist in Pinecone. Using in-memory storage instead.`);
            // Fall back to in-memory storage
            for (let i = 0; i < chunks.length; i++) {
              inMemoryVectorDB.push({
                id: chunks[i].id,
                text: chunks[i].text,
                embedding: embeddings[i],
                metadata: chunks[i].metadata
              });
            }
            return;
          }
          
          const index = pinecone.index(indexName);
          
          // Prepare vectors for upsert
          const vectors = chunks.map((chunk, i) => ({
            id: chunk.id,
            values: embeddings[i],
            metadata: {
              ...chunk.metadata,
              text: chunk.text // Store text in metadata for retrieval
            }
          }));
          
          // Upsert in batches of 100 (Pinecone limit)
          const batchSize = 100;
          for (let i = 0; i < vectors.length; i += batchSize) {
            const batch = vectors.slice(i, i + batchSize);
            await index.upsert(batch);
            console.log(`Upserted batch ${i / batchSize + 1} to Pinecone`);
          }
          
          console.log(`Stored ${chunks.length} document chunks in Pinecone`);
        } catch (indexError) {
          console.error("Error accessing Pinecone indexes:", indexError);
          // Fall back to in-memory storage
          storeInMemory(chunks, embeddings);
        }
      } catch (pineconeError) {
        console.error("Error using Pinecone, falling back to in-memory storage:", pineconeError);
        // Fall back to in-memory storage
        storeInMemory(chunks, embeddings);
      }
    } else {
      // Store documents in memory (default fallback)
      storeInMemory(chunks, embeddings);
      console.log(`Stored ${chunks.length} document chunks in in-memory vector database`);
    }
  } catch (error) {
    console.error("Error storing documents:", error);
    throw new Error("Failed to store documents in vector database");
  }
};

// Helper function to store documents in memory
const storeInMemory = (chunks: DocumentChunk[], embeddings: number[][]) => {
  for (let i = 0; i < chunks.length; i++) {
    inMemoryVectorDB.push({
      id: chunks[i].id,
      text: chunks[i].text,
      embedding: embeddings[i],
      metadata: chunks[i].metadata
    });
  }
};

// Search for relevant documents based on a query
export const searchDocuments = async (
  query: string,
  apiKey: string,
  topK: number = 3,
  pineconeApiKey?: string,
  pineconeEnvironment?: string
): Promise<DocumentChunk[]> => {
  try {
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
    
    // If Pinecone credentials are provided, search in Pinecone
    if (pineconeApiKey && pineconeEnvironment) {
      try {
        const pinecone = initPinecone(pineconeApiKey, pineconeEnvironment);
        const indexName = "joe-knowledge";
        
        // Check if index exists
        try {
          const indexes = await pinecone.listIndexes();
          if (!indexes.some(idx => idx.name === indexName)) {
            console.log(`Index '${indexName}' doesn't exist in Pinecone. Using in-memory search instead.`);
            // Fall back to in-memory search
            return searchInMemory(queryEmbedding, topK);
          }
          
          const index = pinecone.index(indexName);
          
          // Query Pinecone
          const queryResponse = await index.query({
            vector: queryEmbedding,
            topK,
            includeMetadata: true
          });
          
          // Transform results
          return queryResponse.matches.map(match => ({
            id: match.id,
            text: match.metadata?.text as string,
            metadata: {
              source: match.metadata?.source as string,
              section: match.metadata?.section as string,
              page: match.metadata?.page as number
            }
          }));
        } catch (indexError) {
          console.error("Error accessing Pinecone indexes:", indexError);
          return searchInMemory(queryEmbedding, topK);
        }
      } catch (pineconeError) {
        console.error("Error searching Pinecone, falling back to in-memory search:", pineconeError);
        // Fall back to in-memory search
        return searchInMemory(queryEmbedding, topK);
      }
    } else {
      // Search in-memory database
      return searchInMemory(queryEmbedding, topK);
    }
  } catch (error) {
    console.error("Error searching documents:", error);
    throw new Error("Failed to search documents in vector database");
  }
};

// Helper function for in-memory search
const searchInMemory = (queryEmbedding: number[], topK: number): DocumentChunk[] => {
  // If the vector database is empty, return empty results
  if (inMemoryVectorDB.length === 0) {
    return [];
  }
  
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
