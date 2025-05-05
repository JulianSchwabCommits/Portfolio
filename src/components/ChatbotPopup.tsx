import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { use_theme } from "../context/ThemeContext";
import { supabase } from "../utils/supabase";
import { createChatConversation, saveChatMessage } from "../lib/chat_storage";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ChatbotPopupProps {
  initialMessage?: string;
  onClose: () => void;
}

const ChatbotPopup = ({ initialMessage, onClose }: ChatbotPopupProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm Max, Julian's AI assistant. How can I help you learn more about Julian?", sender: "bot" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = use_theme();
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const [projects_res, experiences_res] = await Promise.all([
          supabase.from('projects').select('*').order('year', { ascending: false }),
          supabase.from('experiences').select('*').order('period', { ascending: false })
        ]);

        if (projects_res.error) throw projects_res.error;
        if (experiences_res.error) throw experiences_res.error;

        const birth_date = new Date('2008-05-21');
        const today = new Date();
        let age = today.getFullYear() - birth_date.getFullYear();
        const month_diff = today.getMonth() - birth_date.getMonth();
        
        if (month_diff < 0 || (month_diff === 0 && today.getDate() < birth_date.getDate())) {
          age--;
        }

        const prompt = `You are Max, Julian's personal AI assistant. You should only answer questions about Julian and his projects and experiences.

Julian's Age: ${age} years old (born on May 21, 2008)

Julian's Experiences:
${experiences_res.data?.map((exp, index) => `${index + 1}. ${exp.title} (${exp.period})
   - At ${exp.company}
   - ${exp.description}
   - Skills: ${exp.skills.join(", ")}`).join("\n\n")}

Projects:
${projects_res.data?.map((proj, index) => `${index + 1}. ${proj.title} (${proj.year})
   - ${proj.description}
   - Built with: ${proj.tags.join(", ")}`).join("\n\n")}

Instructions:
1. Only answer questions about Julian, his experiences, or his projects
2. If asked about anything else, politely redirect the conversation back to Julian
3. Be friendly and professional
4. Use your knowledge to provide detailed, accurate responses
5. If you're not sure about something, say so rather than making assumptions
6. Keep responses concise but informative
7. When asked about Julian's age, use the calculated age of ${age} years`;

        setSystemPrompt(prompt);

        // Create a new conversation for this chat session
        const newConversationId = await createChatConversation();
        if (!newConversationId) {
          console.error('Failed to create new conversation');
          return;
        }
        
        setConversationId(newConversationId);
      } catch (error) {
        console.error('Error fetching data for system prompt:', error);
      }
    };

    fetch_data();
  }, []);

  useEffect(() => {
    if (initialMessage && !isLoading && systemPrompt) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, systemPrompt]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading || !systemPrompt) return;
    
    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user" as const
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Save user message to database
    if (conversationId) {
      try {
        const saved = await saveChatMessage(conversationId, {
          text: userMessage.text,
          sender: userMessage.sender
        });
        
        if (!saved) {
          console.error('Failed to save user message');
        }
      } catch (error) {
        console.error('Error saving user message:', error);
      }
    }
    
    try {
      const api_key = import.meta.env.VITE_OPENROUTER_API_KEY;
      console.log('OpenRouter API Key:', api_key ? 'Present' : 'Missing');
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${api_key}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Julian's Portfolio"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(msg => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text
            })),
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenRouter API Error:', errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('OpenRouter API Response:', data);
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format');
      }

      const botMessage = {
        id: messages.length + 2,
        text: data.choices[0].message.content,
        sender: "bot" as const
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Save bot message to database
      if (conversationId) {
        try {
          const saved = await saveChatMessage(conversationId, {
            text: botMessage.text,
            sender: botMessage.sender
          });
          
          if (!saved) {
            console.error('Failed to save bot message');
          }
        } catch (error) {
          console.error('Error saving bot message:', error);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting to my AI brain right now. Please try again in a moment.",
        sender: "bot" as const
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Save error message to database
      if (conversationId) {
        try {
          const saved = await saveChatMessage(conversationId, {
            text: errorMessage.text,
            sender: errorMessage.sender
          });
          
          if (!saved) {
            console.error('Failed to save error message');
          }
        } catch (error) {
          console.error('Error saving error message:', error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      handleSendMessage(input);
      setInput("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`glass-morphism rounded-2xl overflow-hidden flex flex-col h-[500px] max-w-2xl w-full mx-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-1 p-4 overflow-y-auto scrollbar-none pb-20">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    message.sender === "user"
                      ? theme === 'light' 
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-white/10 text-white'
                      : theme === 'light'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-white/5 text-white'
                  }`}
                  style={{ 
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 absolute bottom-0 left-0 right-0 z-10">
          <form onSubmit={handleSubmit} className="flex">
            <div className="relative flex-1">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize the textarea
                  const textarea = e.target as HTMLTextAreaElement;
                  textarea.style.height = '40px';
                  const newHeight = Math.min(textarea.scrollHeight, 120);
                  textarea.style.height = `${newHeight}px`;
                  // Update border radius based on height
                  textarea.style.borderRadius = newHeight > 40 ? '1rem' : '9999px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                    e.preventDefault();
                    handleSendMessage(input);
                    setInput("");
                    // Reset height and border radius after sending
                    const textarea = e.target as HTMLTextAreaElement;
                    textarea.style.height = '40px';
                    textarea.style.borderRadius = '9999px';
                  }
                }}
                placeholder="Ask me anything about Julian..."
                className={`w-full py-2 px-4 resize-none overflow-y-auto scrollbar-none ${
                  theme === 'light' 
                    ? 'bg-gray-200 text-gray-800 placeholder-gray-500'
                    : 'bg-[#27272a] text-white placeholder-gray-400'
                } focus:outline-none focus:ring-1 focus:ring-white/20`}
                style={{ 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-word',
                  height: '40px',
                  maxHeight: '120px',
                  borderRadius: '9999px'
                }}
              />
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatbotPopup; 