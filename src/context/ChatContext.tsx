import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  systemPrompt: string;
  setSystemPrompt: React.Dispatch<React.SetStateAction<string>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm Max, Julian's AI assistant. How can I help you learn more about Julian?", sender: "bot" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");

  return (
    <ChatContext.Provider value={{
      messages,
      setMessages,
      isLoading,
      setIsLoading,
      systemPrompt,
      setSystemPrompt
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
