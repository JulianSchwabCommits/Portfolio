import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { use_theme } from "../context/ThemeContext";
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

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const generate_system_prompt = (experiences: Experience[], projects: Project[]) => {
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
${experiences.map((exp, index) => `${index + 1}. ${exp.title} (${exp.period})
   - At ${exp.company}
   - ${exp.description}
   - Skills: ${exp.skills.join(", ")}`).join("\n\n")}

Projects:
${projects.map((proj, index) => `${index + 1}. ${proj.title} (${proj.year})
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

  return prompt;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm Max, Julian's AI assistant. How can I help you learn more about Julian?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = use_theme();

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const [projects_res, experiences_res] = await Promise.all([
          supabase.from('projects').select('*').order('year', { ascending: false }),
          supabase.from('experiences').select('*').order('period', { ascending: false })
        ]);

        if (projects_res.error) throw projects_res.error;
        if (experiences_res.error) throw experiences_res.error;

        const prompt = generate_system_prompt(
          experiences_res.data || [],
          projects_res.data || []
        );
        setSystemPrompt(prompt);
      } catch (error) {
        console.error('Error fetching data for system prompt:', error);
      }
    };

    fetch_data();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading || !systemPrompt) return;
    
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user" as const
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
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
          model: "deepseek/deepseek-r1-distill-llama-70b:free",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(msg => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text
            })),
            { role: "user", content: input }
          ]
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
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting to my AI brain right now. Please try again in a moment.",
        sender: "bot" as const
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`glass-morphism rounded-2xl overflow-hidden flex flex-col h-[500px] max-w-2xl w-full mx-auto ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
      <div className="flex-1 p-4 overflow-y-auto scrollbar-none">
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
              >
                {message.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/10'} p-4`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading) handleSendMessage();
          }}
          className="flex"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask me anything about Julian..."
            className={`w-full py-2 px-4 rounded-full glass-morphism ${
              theme === 'light' 
                ? 'bg-gray-100 text-gray-800 placeholder-gray-500'
                : 'bg-white/5 text-white placeholder-gray-400'
            } focus:outline-none focus:ring-1 focus:ring-white/20`}
          />
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
