
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Upload, FileText, AlertTriangle, CheckCircle2, Database } from "lucide-react";
import { processPDF, processText } from "@/utils/documentProcessing";
import { storeDocuments, DocumentChunk, getDocumentCount, clearVectorDatabase } from "@/services/vectorService";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/components/ui/sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function KnowledgeUploader() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [documentCount, setDocumentCount] = useState(getDocumentCount());
  const [currentFileProgress, setCurrentFileProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state } = useChat();
  
  // Pinecone configuration
  const [pineconeApiKey, setPineconeApiKey] = useState<string>(localStorage.getItem("pinecone_api_key") || "");
  const [pineconeEnvironment, setPineconeEnvironment] = useState<string>(localStorage.getItem("pinecone_environment") || "");
  const [usePinecone, setUsePinecone] = useState<boolean>(Boolean(localStorage.getItem("use_pinecone") === "true"));

  // Save Pinecone config to localStorage
  const savePineconeConfig = () => {
    if (pineconeApiKey && pineconeEnvironment) {
      localStorage.setItem("pinecone_api_key", pineconeApiKey);
      localStorage.setItem("pinecone_environment", pineconeEnvironment);
      localStorage.setItem("use_pinecone", "true");
      setUsePinecone(true);
      toast.success("Pinecone Configuration Saved", {
        description: "Your documents will now be stored in Pinecone"
      });
    } else {
      localStorage.removeItem("use_pinecone");
      setUsePinecone(false);
      toast.error("Incomplete Configuration", {
        description: "Both API Key and Environment are required for Pinecone"
      });
    }
  };

  // Clear Pinecone config
  const clearPineconeConfig = () => {
    localStorage.removeItem("pinecone_api_key");
    localStorage.removeItem("pinecone_environment");
    localStorage.removeItem("use_pinecone");
    setPineconeApiKey("");
    setPineconeEnvironment("");
    setUsePinecone(false);
    toast.info("Pinecone Configuration Cleared", {
      description: "Your documents will be stored in memory"
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    if (!state.apiKey) {
      toast.error("API Key Required", {
        description: "Please set your OpenAI API key first to process documents"
      });
      return;
    }
    
    setIsProcessing(true);
    setUploadStatus("idle");
    
    try {
      const documentChunks: DocumentChunk[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        setCurrentFileProgress(`Processing ${fileName} (${i + 1}/${files.length})`);
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        
        // Generate a unique ID for each file
        const fileId = `doc-${Date.now()}-${i}`;
        
        console.log(`Processing file: ${fileName}, type: ${fileExtension}`);
        
        if (fileExtension === 'pdf') {
          try {
            const fileBuffer = await file.arrayBuffer();
            console.log(`PDF file size: ${fileBuffer.byteLength} bytes`);
            const chunks = await processPDF(fileBuffer);
            
            // Add each chunk to documentChunks
            chunks.forEach((chunk, index) => {
              documentChunks.push({
                id: `${fileId}-chunk-${index}`,
                text: chunk,
                metadata: {
                  source: fileName,
                  section: `Chunk ${index + 1}`
                }
              });
            });
            
            console.log(`Successfully processed PDF: ${fileName}, generated ${chunks.length} chunks`);
          } catch (pdfError) {
            console.error(`Error processing PDF file ${fileName}:`, pdfError);
            toast.error(`Error Processing PDF: ${fileName}`, {
              description: pdfError instanceof Error ? pdfError.message : "Failed to process PDF file"
            });
          }
        } else if (fileExtension === 'txt') {
          try {
            const text = await file.text();
            console.log(`TXT file length: ${text.length} characters`);
            const chunks = processText(text);
            
            // Add each chunk to documentChunks
            chunks.forEach((chunk, index) => {
              documentChunks.push({
                id: `${fileId}-chunk-${index}`,
                text: chunk,
                metadata: {
                  source: fileName,
                  section: `Chunk ${index + 1}`
                }
              });
            });
            
            console.log(`Successfully processed TXT: ${fileName}, generated ${chunks.length} chunks`);
          } catch (txtError) {
            console.error(`Error processing TXT file ${fileName}:`, txtError);
            toast.error(`Error Processing TXT: ${fileName}`, {
              description: txtError instanceof Error ? txtError.message : "Failed to process text file"
            });
          }
        } else {
          toast.error("Unsupported File Type", {
            description: `The file ${fileName} is not supported. Please upload PDF or TXT files only.`
          });
          continue;
        }
      }
      
      if (documentChunks.length > 0) {
        console.log(`Storing ${documentChunks.length} document chunks in vector database...`);
        
        // Pass Pinecone config if enabled
        if (usePinecone && pineconeApiKey && pineconeEnvironment) {
          await storeDocuments(documentChunks, state.apiKey, pineconeApiKey, pineconeEnvironment);
        } else {
          await storeDocuments(documentChunks, state.apiKey);
        }
        
        setDocumentCount(getDocumentCount());
        setUploadStatus("success");
        toast.success("Documents Processed", {
          description: `${documentChunks.length} chunks were successfully added to Joe's knowledge base`
        });
      } else {
        setUploadStatus("error");
        toast.error("No Content Processed", {
          description: "No valid content could be extracted from the uploaded files."
        });
      }
    } catch (error) {
      console.error("Error processing files:", error);
      setUploadStatus("error");
      toast.error("Processing Error", {
        description: error instanceof Error ? error.message : "Failed to process documents"
      });
    } finally {
      setIsProcessing(false);
      setCurrentFileProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReset = () => {
    clearVectorDatabase();
    setDocumentCount(0);
    toast.info("Knowledge Base Reset", {
      description: "All documents have been removed from Joe's knowledge base"
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <Label htmlFor="file-upload" className="text-sm font-medium text-steel-700">
          Upload Knowledge Documents (PDF, TXT)
        </Label>
        <div className="mt-1">
          <Input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt"
            multiple
            className="w-full"
            disabled={isProcessing}
          />
        </div>
        <p className="mt-1 text-xs text-steel-500">
          Upload PDFs or text files to enhance Joe's knowledge base
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="database-config">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Vector Database Configuration
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div>
                <Label htmlFor="pinecone-api-key" className="text-sm">
                  Pinecone API Key
                </Label>
                <Input
                  id="pinecone-api-key"
                  type="password"
                  value={pineconeApiKey}
                  onChange={(e) => setPineconeApiKey(e.target.value)}
                  placeholder="Enter your Pinecone API key"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="pinecone-environment" className="text-sm">
                  Pinecone Environment
                </Label>
                <Input
                  id="pinecone-environment"
                  type="text"
                  value={pineconeEnvironment}
                  onChange={(e) => setPineconeEnvironment(e.target.value)}
                  placeholder="e.g., us-west1-gcp"
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={savePineconeConfig}
                  disabled={!pineconeApiKey || !pineconeEnvironment}
                >
                  Save Configuration
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={clearPineconeConfig}
                >
                  Use In-Memory Storage
                </Button>
              </div>
              
              <div className={`text-xs p-2 rounded-md ${usePinecone ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {usePinecone ? (
                  <p>Using Pinecone for vector storage. Your documents will persist between sessions.</p>
                ) : (
                  <p>Using in-memory storage. Documents will be lost when you close the browser.</p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="font-medium">Current Knowledge Base:</span>{" "}
          <span className="text-steel-600">{documentCount} chunks indexed</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={documentCount === 0 || isProcessing}
          className="text-xs border-destructive text-destructive hover:bg-destructive/10"
        >
          Reset Knowledge Base
        </Button>
      </div>
      
      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-steel-50">
          <div className="flex items-center mb-2">
            <Loader2 className="h-5 w-5 animate-spin text-steel-500 mr-2" />
            <span className="text-sm text-steel-700">Processing documents...</span>
          </div>
          {currentFileProgress && (
            <span className="text-xs text-steel-600">{currentFileProgress}</span>
          )}
        </div>
      )}
      
      {uploadStatus === "success" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Documents Processed</AlertTitle>
          <AlertDescription className="text-green-700">
            Your documents have been successfully added to Joe's knowledge base.
          </AlertDescription>
        </Alert>
      )}
      
      {uploadStatus === "error" && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Processing Error</AlertTitle>
          <AlertDescription className="text-red-700">
            There was an error processing your documents. Please check the console for details and try again.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="border rounded-md p-3 bg-steel-50">
        <div className="flex items-start">
          <FileText className="h-5 w-5 text-steel-600 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-steel-700">Recommended Document Format</h3>
            <p className="text-xs text-steel-600 mt-1">
              For best results, organize documents with clear headings and separate sections. Each document
              should focus on specific steel industry topics or processes for better retrieval accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
