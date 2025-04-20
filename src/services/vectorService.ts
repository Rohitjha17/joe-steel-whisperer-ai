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

// Constants for Pinecone configuration
const PINECONE_INDEX_NAME = "joe-knowledge";
const PINECONE_NAMESPACE = "steel-docs"; // Namespace for steel industry documents
const PINECONE_DIMENSION = 1536; // OpenAI ada-002 embedding dimension

// In-memory storage for vector database (fallback)
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
const initPinecone = (apiKey: string, environment: string): Pinecone => {
  try {
    return new Pinecone({
      apiKey,
      environment,
    });
  } catch (error) {
    console.error("Error initializing Pinecone:", error);
    throw new Error("Failed to initialize Pinecone client");
  }
};

// Create Pinecone index if it doesn't exist
const ensurePineconeIndex = async (pinecone: Pinecone): Promise<void> => {
  try {
    const indexes = await pinecone.listIndexes();
    
    if (!indexes.some(idx => idx.name === PINECONE_INDEX_NAME)) {
      console.log(`Creating new Pinecone index: ${PINECONE_INDEX_NAME}`);
      await pinecone.createIndex({
        name: PINECONE_INDEX_NAME,
        dimension: PINECONE_DIMENSION,
        metric: 'cosine',
      });
      
      // Wait for index to be ready
      let isReady = false;
      while (!isReady) {
        const description = await pinecone.describeIndex(PINECONE_INDEX_NAME);
        if (description.status?.ready) {
          isReady = true;
          console.log('Pinecone index is ready');
        } else {
          console.log('Waiting for Pinecone index to be ready...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    } else {
      console.log(`Pinecone index ${PINECONE_INDEX_NAME} already exists`);
    }
  } catch (error) {
    console.error("Error creating Pinecone index:", error);
    throw new Error("Failed to create Pinecone index");
  }
};

// Store documents in vector database
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

    if (pineconeApiKey && pineconeEnvironment) {
      try {
        console.log("Initializing Pinecone client...");
        const pinecone = initPinecone(pineconeApiKey, pineconeEnvironment);

        // Ensure index exists
        await ensurePineconeIndex(pinecone);
        
        const index = pinecone.index(PINECONE_INDEX_NAME);
        
        // Prepare vectors with namespace
        const vectors = chunks.map((chunk, i) => ({
          id: chunk.id,
          values: embeddings[i],
          metadata: { ...chunk.metadata, text: chunk.text }
        }));

        // Upload vectors in batches
        const batchSize = 100;
        for (let i = 0; i < vectors.length; i += batchSize) {
          const batch = vectors.slice(i, i + batchSize);
          await index.namespace(PINECONE_NAMESPACE).upsert(batch);
          console.log(`Upserted batch ${Math.floor(i / batchSize) + 1} to Pinecone namespace: ${PINECONE_NAMESPACE}`);
        }

        console.log(`Stored ${chunks.length} document chunks in Pinecone namespace: ${PINECONE_NAMESPACE}`);
      } catch (pineconeError) {
        console.error("Error using Pinecone, will store in memory. Pinecone error:", pineconeError);
        storeInMemory(chunks, embeddings);
      }
    } else {
      storeInMemory(chunks, embeddings);
      console.log(`Stored ${chunks.length} document chunks in in-memory vector database`);
    }
  } catch (error) {
    console.error("Error storing documents in vector DB:", error);
    throw new Error("Failed to store documents in vector database: " + (error instanceof Error ? error.message : "Unknown error"));
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
    if (!apiKey || apiKey.trim() === '') {
      console.log("No API key provided for search, returning empty results");
      return [];
    }
    
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
          
          // Check if index exists
          const indexes = await pinecone.listIndexes();
          if (!indexes.some(idx => idx.name === PINECONE_INDEX_NAME)) {
            console.log(`Index '${PINECONE_INDEX_NAME}' doesn't exist in Pinecone. Using in-memory search instead.`);
            return searchInMemory(queryEmbedding, topK);
          }
          
          const index = pinecone.index(PINECONE_INDEX_NAME);
          
          // Query Pinecone with namespace
          const queryResponse = await index.namespace(PINECONE_NAMESPACE).query({
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
        } catch (pineconeError) {
          console.error("Error searching Pinecone, falling back to in-memory search:", pineconeError);
          return searchInMemory(queryEmbedding, topK);
        }
      } else {
        // Search in-memory database
        return searchInMemory(queryEmbedding, topK);
      }
    } catch (openaiError) {
      console.error("Error with OpenAI API:", openaiError);
      return [];
    }
  } catch (error) {
    console.error("Error searching documents:", error);
    return [];
  }
};

// Helper function for in-memory search
const searchInMemory = (queryEmbedding: number[], topK: number): DocumentChunk[] => {
  if (inMemoryVectorDB.length === 0) return [];
  
  const similarities = inMemoryVectorDB.map(doc => ({
    document: {
      id: doc.id,
      text: doc.text,
      metadata: doc.metadata
    },
    score: cosineSimilarity(queryEmbedding, doc.embedding)
  }));
  
  similarities.sort((a, b) => b.score - a.score);
  const topResults = similarities.slice(0, topK);
  
  return topResults.map(result => result.document);
};

// Clear the vector database (for testing/reset purposes)
export const clearVectorDatabase = async (
  pineconeApiKey?: string,
  pineconeEnvironment?: string
): Promise<void> => {
  // Clear in-memory database
  inMemoryVectorDB = [];
  
  // Clear Pinecone namespace if credentials are provided
  if (pineconeApiKey && pineconeEnvironment) {
    try {
      const pinecone = initPinecone(pineconeApiKey, pineconeEnvironment);
      const index = pinecone.index(PINECONE_INDEX_NAME);
      await index.namespace(PINECONE_NAMESPACE).deleteAll();
      console.log(`Cleared Pinecone namespace: ${PINECONE_NAMESPACE}`);
    } catch (error) {
      console.error("Error clearing Pinecone namespace:", error);
    }
  }
  
  console.log("Vector database cleared");
};

// Get the count of documents in the database
export const getDocumentCount = async (
  pineconeApiKey?: string,
  pineconeEnvironment?: string
): Promise<number> => {
  if (pineconeApiKey && pineconeEnvironment) {
    try {
      const pinecone = initPinecone(pineconeApiKey, pineconeEnvironment);
      const index = pinecone.index(PINECONE_INDEX_NAME);
      const stats = await index.namespace(PINECONE_NAMESPACE).describeIndexStats();
      return stats.totalRecordCount || 0;
    } catch (error) {
      console.error("Error getting Pinecone document count:", error);
      return inMemoryVectorDB.length;
    }
  }
  return inMemoryVectorDB.length;
};
