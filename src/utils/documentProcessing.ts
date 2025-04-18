
import { OpenAI } from "openai";
import * as pdfjs from 'pdfjs-dist';

// Set worker source for PDF.js
const pdfWorkerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

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

// Process a PDF file and extract the text content using PDF.js (browser-compatible)
export const processPDF = async (pdfBuffer: ArrayBuffer): Promise<string[]> => {
  try {
    console.log("Starting PDF processing with PDF.js...");
    
    // Load the PDF document using PDF.js
    const loadingTask = pdfjs.getDocument({ data: pdfBuffer });
    const pdf = await loadingTask.promise;
    
    console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);
    let fullText = '';
    
    // Iterate through each page and extract text
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i}/${pdf.numPages}...`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => 'str' in item ? item.str : '')
        .join(' ');
        
      fullText += pageText + ' ';
    }
    
    console.log(`PDF text extraction complete. Text length: ${fullText.length}`);
    
    // Process the extracted text into chunks
    const chunks = processText(fullText);
    console.log(`Created ${chunks.length} text chunks from PDF`);
    return chunks;
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw new Error(`Failed to process PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    throw new Error("Failed to generate embeddings");
  }
};
