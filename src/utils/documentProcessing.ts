
import { OpenAI } from "openai";
import * as pdfjs from 'pdfjs-dist';
// Import the worker entry directly for Vite compatibility:
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

// Set worker source for PDF.js using the locally bundled worker.
// @ts-ignore
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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

// Process a PDF file and extract the text content using PDF.js (browser-compatible)
export const processPDF = async (pdfBuffer: ArrayBuffer): Promise<string[]> => {
  try {
    console.log("Starting PDF processing with PDF.js, loading worker from local bundle...");
    const loadingTask = pdfjs.getDocument({ data: pdfBuffer });
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded. Pages: ${pdf.numPages}`);
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
        fullText += pageText + ' ';
      } catch (e) {
        console.error(`Error processing page ${i}:`, e);
      }
    }
    const chunks = processText(fullText);
    console.log(`Extracted ${chunks.length} chunks from PDF`);
    return chunks;
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw new Error(`Failed to process PDF file: ${error instanceof Error ? error.message : 'Unknown error'}. If this error refers to loading a worker, make sure your build system supports importing 'pdfjs-dist/build/pdf.worker.entry'.`);
  }
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
