"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useChat } from 'ai/react';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

interface ChatbotContextType {
  messages: Message[];
  isLoading: boolean;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  askQuestion: (question: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
}

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  // Use the Vercel AI SDK useChat hook to handle the chat
  const { messages: aiMessages, append, isLoading: aiLoading, setMessages: setAiMessages } = useChat({
    api: '/api/openai/chat',
    onError: (error) => {
      console.error('Chat API error:', error);
    }
  });

  // Convert AI SDK messages to our format
  const messages: Message[] = aiMessages.map(msg => ({
    id: msg.id,
    content: msg.content,
    role: msg.role as 'user' | 'assistant',
    timestamp: new Date() // We don't have timestamps from the AI SDK, so we use current time
  }));

  const isLoading = aiLoading;

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    // This won't be needed as the useChat hook handles message state
    console.log('Manual message add attempted:', { content, role });
  };

  const askQuestion = async (question: string) => {
    if (!question.trim()) return;
    
    try {
      // This uses the Vercel AI SDK to send the message and handle the streaming response
      await append({
        role: 'user',
        content: question,
      });
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  const clearMessages = () => {
    setAiMessages([]);
  };

  const value = {
    messages,
    isLoading,
    addMessage,
    askQuestion,
    clearMessages,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
} 