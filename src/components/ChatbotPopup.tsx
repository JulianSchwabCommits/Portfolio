import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Chatbot from "./Chatbot";
import { use_theme } from "../context/ThemeContext";

interface ChatbotPopupProps {
  onClose: () => void;
  initialMessage?: string;
}

const ChatbotPopup = ({ onClose, initialMessage }: ChatbotPopupProps) => {
  const { theme } = use_theme();

  return (
    <AnimatePresence>      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-2xl w-full"
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}          <button
            onClick={onClose}
            className={`absolute -top-12 -right-2 z-60 p-2 rounded-full transition-all duration-200 ${
              theme === 'light' 
                ? 'bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30' 
                : 'bg-black/90 hover:bg-black text-white hover:text-gray-100 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>          {/* Chatbot component with increased height for popup */}
          <div className="p-6">
            <div className={`h-[600px] ${
              theme === 'light' 
                ? 'shadow-2xl shadow-gray-900/30' 
                : 'shadow-2xl shadow-black/40'
            } rounded-2xl`}>
              <Chatbot initialMessage={initialMessage} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatbotPopup;
