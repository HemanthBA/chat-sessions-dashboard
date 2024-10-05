// src/types.ts
export interface Message {
  id: number;
  action: 'USER' | 'AI';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: number;
  name: string;
  message_count: number;
  messages: Message[];
}