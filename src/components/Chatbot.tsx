import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { use_theme } from "../context/ThemeContext";
import { useChatContext } from "../context/ChatContext";
import { supabase } from "../utils/supabase";

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  year: string;
  tags: string[];
}

interface ChatbotProps {
  onExpand?: () => void;
  initialMessage?: string;
}

const generate_system_prompt = (experiences: Experience[], projects: Project[], age: number) => {
  return `You are Max, Julian Shwab's personal AI assistant on his portfolio website. You're here to entertain users and share info about Julian, a passionate developer who loves endurance sports, running, and the outdoors.

Your personality is cheeky, nerdy, and helpful throw in the occasional nerd joke or reference, but always aim to assist the user with friendly professionalism.

Julian's Age: ${age} years old (born on May 21, 2008)

Julian's Experiences:
${experiences.map((exp, index) => `${index + 1}. ${exp.title} (${exp.period})
   - At ${exp.company}
   - ${exp.description}
   - Skills: ${exp.skills.join(", ")}`).join("\n\n")}

Projects:
${projects.map((proj, index) => `${index + 1}. ${proj.title} (${proj.year})
   - ${proj.description}
   - Built with: ${proj.tags.join(", ")}`).join("\n\n")}

1. Be friendly, professional, and approachable.
2. Keep responses short and snappy max 3 sentences per reply, no long paragraphs.
3. Use your knowledge to give accurate, relevant info about Julian and his work.
4. If you're unsure about something, say so** and suggest the user visit the [Contact](https://julianschwab.dev/contact) page to reach Julian directly. Never guess.
5. Mention Julian's love for **running, endurance sports, and the outdoors** where relevant.
6. If users want to clear the conversation history, they can type "/clear" to start fresh.`;
};

const Chatbot = ({ onExpand, initialMessage }: ChatbotProps) => {
  const { messages, setMessages, isLoading, setIsLoading, systemPrompt, setSystemPrompt } = useChatContext();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = use_theme();

  useEffect(() => {
    // Only fetch data if system prompt hasn't been set yet
    if (systemPrompt) return;

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

        const prompt = generate_system_prompt(
          experiences_res.data || [],
          projects_res.data || [],
          age
        );
        setSystemPrompt(prompt);
        console.log('System Prompt:', prompt);
      } catch (error) {
        console.error('Error fetching data for system prompt:', error);
      }
    };

    fetch_data();
  }, [systemPrompt, setSystemPrompt]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle initial message from search popup
  useEffect(() => {
    if (initialMessage && initialMessage.trim()) {
      setInput(initialMessage);
    }
  }, [initialMessage]);

  const resetChat = () => {
    setMessages([
      { id: 1, text: "Hi! I'm Max, Julian's AI assistant. How can I help you learn more about Julian?", sender: "bot" },
      { id: 2, text: "Chat history cleared! 🧹 Fresh start, what would you like to know?", sender: "bot" }
    ]);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading || !systemPrompt) return;

    // Check for /clear command
    if (input.trim() === "/clear") {
      resetChat();
      setInput("");
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user" as const
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Use the secure Cloudflare function instead of calling Gemini API directly
      const conversationHistory = messages.filter(msg => msg.id !== userMessage.id);
      const fullMessages = [...conversationHistory, { sender: "user", text: input }];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: fullMessages,
          systemPrompt: systemPrompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Chat API Error:', errorData);
        throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Chat API Response:', data);

      if (!data.text) {
        throw new Error('Invalid response format');
      }

      const botMessage = {
        id: messages.length + 2,
        text: data.text,
        sender: "bot" as const
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot" as const
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className={`glass-morphism rounded-2xl flex flex-col h-[400px] transform-gpu transition-all duration-200 ${theme === 'light'
          ? 'text-gray-800 shadow-lg shadow-gray-900/20'
          : 'text-white shadow-lg shadow-black/20'
        }`}
      whileHover={{
        scale: 1.02,
        boxShadow: theme === 'light'
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
          : '0 25px 50px -12px rgba(255, 255, 255, 0.1)'
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-end items-center p-4 relative z-10">
        {onExpand && (
          <motion.button
            onClick={onExpand}
            className={`p-2 rounded-full transition-all duration-200 absolute top-2 right-2 ${theme === 'light'
                ? 'hover:bg-gray-200 text-gray-800'
                : 'hover:bg-white/10 text-white'
              }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Maximize2 className={`w-5 h-5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`} />
          </motion.button>
        )}
      </div>
      <div className="flex-1 p-4 overflow-y-auto scrollbar-none -mt-8 pb-16">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                } mb-4`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl transition-all duration-200 ${message.sender === "user"
                  ? theme === 'light'
                    ? 'bg-gray-100 text-gray-800 shadow-sm shadow-gray-900/10'
                    : 'bg-white/10 text-white shadow-sm shadow-black/20'
                  : theme === 'light'
                    ? 'bg-gray-50 text-gray-800 shadow-sm shadow-gray-900/10'
                    : 'bg-white/5 text-white shadow-sm shadow-black/20'
                  } markdown-content`}
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {message.sender === "bot" ? (
                  <div dangerouslySetInnerHTML={{
                    __html: message.text
                      // Render markdown links first
                      .replace(
                        /\[([^\]]+)\]\(([^)]+)\)/g,
                        (_, text, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
                      )
                      // Then render plain URLs that are not already inside an anchor tag
                      .replace(
                        /(?<![">])((https?:\/\/)[^\s<]+)/g,
                        (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
                      )
                      // Convert markdown bold
                      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                      // Convert markdown italic
                      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                  }} />
                ) : (
                  message.text
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 absolute bottom-0 left-0 right-0 z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading) handleSendMessage();
          }}
          className="flex"
        >
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
                  handleSendMessage();
                  // Reset height and border radius after sending
                  const textarea = e.target as HTMLTextAreaElement;
                  textarea.style.height = '40px';
                  textarea.style.borderRadius = '9999px';
                }
              }}
              placeholder="Ask me anything (type /clear to reset)"
              className={`w-full py-2 px-4 resize-none overflow-y-auto scrollbar-none transition-all duration-200 ${theme === 'light'
                ? 'bg-gray-100 text-gray-800 placeholder-gray-500 focus:bg-gray-50 shadow-sm shadow-gray-900/10'
                : 'bg-white/5 text-white placeholder-gray-400 focus:bg-white/10 shadow-sm shadow-black/20'
                } focus:outline-none focus:ring-1 ${theme === 'light' ? 'focus:ring-gray-300' : 'focus:ring-white/20'}`}
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
  );
};

export default Chatbot;
