
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const INITIAL_MESSAGE = "Hi! How can I help you today?";

const responses = {
  greeting: ["Hello!", "Hi there!", "Hey! How can I help?"],
  about: [
    "Julian is an Application Developer at Swisscom. He's passionate about creating elegant solutions to complex problems.",
    "Julian specializes in building scalable web applications using modern technologies like React, TypeScript, and Node.js."
  ],
  skills: [
    "Julian is proficient in React, TypeScript, Node.js, Python, and various other technologies.",
    "He specializes in full-stack development with expertise in both frontend and backend technologies."
  ],
  contact: [
    "You can reach Julian via email at julian@example.com or by phone at +1 (555) 123-4567.",
    "Feel free to connect with Julian on LinkedIn or GitHub. Links are available in the contact section."
  ],
  experience: [
    "Julian has experience in web development, Python programming, and game development.",
    "He's been working on various projects involving modern web technologies and game engines."
  ],
  default: [
    "I'm not sure I understand. Could you rephrase your question?",
    "Interesting question! Julian might be able to answer that directly.",
    "Let me connect you with Julian for more specific information on that topic."
  ]
};

function getBotResponse(message: string): string {
  const lowercaseMsg = message.toLowerCase();
  
  if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi") || lowercaseMsg.includes("hey")) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  } else if (lowercaseMsg.includes("about") || lowercaseMsg.includes("who is")) {
    return responses.about[Math.floor(Math.random() * responses.about.length)];
  } else if (lowercaseMsg.includes("skill") || lowercaseMsg.includes("know") || lowercaseMsg.includes("tech")) {
    return responses.skills[Math.floor(Math.random() * responses.skills.length)];
  } else if (lowercaseMsg.includes("contact") || lowercaseMsg.includes("email") || lowercaseMsg.includes("reach")) {
    return responses.contact[Math.floor(Math.random() * responses.contact.length)];
  } else if (lowercaseMsg.includes("experience") || lowercaseMsg.includes("work") || lowercaseMsg.includes("project")) {
    return responses.experience[Math.floor(Math.random() * responses.experience.length)];
  } else {
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  }
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: INITIAL_MESSAGE, sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user" as const
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Simulate thinking time then respond
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: getBotResponse(input),
        sender: "bot" as const
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="glass-morphism rounded-2xl overflow-hidden flex flex-col h-[500px] max-w-2xl w-full mx-auto">
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
                    ? "bg-white/10 text-white"
                    : "bg-white/5 text-white"
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-white/10 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 py-2 px-4 rounded-full glass-morphism bg-white/5 focus:outline-none focus:ring-1 focus:ring-white/20"
          />
          <button
            type="submit"
            className="p-2 rounded-full glass-morphism hover:bg-white/10 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
