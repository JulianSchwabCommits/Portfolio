import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Github, Linkedin } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Chatbot from "../components/Chatbot";
import ChatbotPopup from '../components/ChatbotPopup';
import { use_theme } from '../context/ThemeContext';

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email",
    value: "me@julianschwab.dev",
    href: "mailto:me@julianschwab.dev"
  },
  {
    icon: <Github className="w-5 h-5" />,
    label: "GitHub",
    value: "JulianSchwabCommits",
    href: "https://github.com/JulianSchwabCommits"
  },
  {
    icon: <Linkedin className="w-5 h-5" />,
    label: "LinkedIn",
    value: "julian-schwab",
    href: "https://www.linkedin.com/in/julian-schwab-680349263"
  }
];

// Custom hook for 3D tilt effect
const use3DTilt = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glareStyle, setGlareStyle] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
      // Calculate rotation based on mouse position relative to center
    const rotateY = ((x - centerX) / centerX) * 4; // Left/Right tilt (reduced from 15)
    const rotateX = ((y - centerY) / centerY) * -4; // Up/Down tilt (reduced from 15)
    
    // Calculate glare position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    
    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`);
    setGlareStyle({
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`,
      opacity: 1
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTransform('rotateX(0deg) rotateY(0deg) scale(1)');
    setGlareStyle({ opacity: 0 });
    setIsHovered(false);
  };

  return { ref, transform, glareStyle, handleMouseMove, handleMouseLeave, isHovered };
};

// Tilt Card Component
const TiltCard = ({ item, index, theme }: { item: typeof contactInfo[0], index: number, theme: string }) => {
  const { ref, transform, glareStyle, handleMouseMove, handleMouseLeave, isHovered } = use3DTilt();

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      className="perspective-1000"
      style={{ perspective: '1000px' }}
    >
      <div
        ref={ref}        className={`relative glass-morphism rounded-2xl overflow-hidden cursor-pointer transform-gpu transition-all duration-200 ${
          isHovered 
            ? theme === 'light' 
              ? 'shadow-2xl shadow-gray-900/30' 
              : 'shadow-2xl shadow-white/10'
            : theme === 'light' 
              ? 'shadow-lg shadow-gray-900/20' 
              : 'shadow-lg shadow-black/20'
        }`}
        style={{
          transform: transform,
          transition: 'transform 0.15s ease-out, box-shadow 0.2s ease-out',
          transformStyle: 'preserve-3d'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Enhanced background on hover */}        <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-10"
          style={{
            ...glareStyle,
            transition: 'opacity 0.3s ease-out'
          }}
        />
        
        {/* Reflection gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-2xl pointer-events-none" />
        
        <a 
          href={item.href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-4 p-4 relative z-20 transform-gpu"
          style={{ transform: 'translateZ(20px)' }}
        >
          <div className={`p-2 rounded-full transition-all duration-200 ${
            isHovered ? 'bg-white/20 scale-110' : 'bg-white/10'
          }`}>
            {item.icon}
          </div>
          <div>
            <p className={`text-sm transition-colors duration-200 ${
              isHovered ? 'text-gray-300' : 'text-gray-400'
            }`}>{item.label}</p>
            <p className={`transition-colors duration-200 ${
              isHovered ? 'text-white' : 'text-white'
            }`}>{item.value}</p>
          </div>
        </a>
      </div>
    </motion.li>
  );
};

const Contact = () => {
  const { theme } = use_theme();
  const [show_chatbot, set_show_chatbot] = useState(false);
  const [is_mobile, set_is_mobile] = useState(false);
  const [is_scrolled, set_is_scrolled] = useState(false);

  useEffect(() => {
    const check_mobile = () => {
      set_is_mobile(window.innerWidth < 768);
    };
    
    check_mobile();
    window.addEventListener('resize', check_mobile);
    
    return () => window.removeEventListener('resize', check_mobile);
  }, []);
  useEffect(() => {
    const handle_scroll = () => {
      // Check if we've scrolled past the very top (around 50px)
      set_is_scrolled(window.scrollY > 50);
    };

    if (is_mobile) {
      window.addEventListener('scroll', handle_scroll);
    }

    return () => {
      window.removeEventListener('scroll', handle_scroll);
    };
  }, [is_mobile]);

  return (
    <div className="min-h-screen p-8">
      {/* Sticky title that appears when scrolled */}
      <AnimatePresence>
        {is_scrolled && is_mobile && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10"
          >
            <h2 className="text-lg font-serif text-white">Let's Chat</h2>
          </motion.div>
        )}
      </AnimatePresence>
      
      <PageTransition>
        <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24 pt-24 pb-20">
          <motion.div 
            className="flex flex-col items-center justify-center text-center mb-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-serif mb-4"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.7, ease: "easeOut" }
                }
              }}
            >
              Let's Chat
            </motion.h1>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-serif mb-8">Contact Information</h2>
              
              <ul className="space-y-6">
                {contactInfo.map((item, index) => (
                  <TiltCard key={index} item={item} index={index} theme={theme} />
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <h2 className="text-2xl md:text-3xl font-serif mb-8">Ask me anything</h2>
              <Chatbot onExpand={() => set_show_chatbot(true)} />
            </motion.div>
          </div>
        </div>
      </PageTransition>

      {show_chatbot && (
        <ChatbotPopup 
          onClose={() => set_show_chatbot(false)} 
        />
      )}
    </div>
  );
};

export default Contact;
