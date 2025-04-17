
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export type ExpertiseArea = 
  | "Procurement" 
  | "Inventory Management" 
  | "Vendor Bill Processing" 
  | "Quality Checks" 
  | "Sales and Dispatch" 
  | "Production Tracking";

export interface ExpertiseInfo {
  title: ExpertiseArea;
  description: string;
  icon: string;
}
