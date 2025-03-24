import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Hero = () => {
  const [show_arrow, set_show_arrow] = useState(true);
  
  useEffect(() => {
    const handle_scroll = () => {
      if (window.scrollY > 100) {
        set_show_arrow(false);
      }
    };
    
    window.addEventListener('scroll', handle_scroll);
    return () => window.removeEventListener('scroll', handle_scroll);
  }, []);

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-0"
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
        className="text-6xl md:text-8xl font-serif mb-6 text-center mx-auto"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
          }
        }}
      >
        Hi, I'm Julian.
      </motion.h1>
      
      <motion.h2 
        className="text-5xl md:text-7xl font-serif mb-8 text-center mx-auto"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
          }
        }}
      >
        A Coder.
      </motion.h2>
      
      <motion.p 
        className="text-xl md:text-2xl text-gray-400 max-w-xl text-center mx-auto"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut", delay: 0.4 }
          }
        }}
      >
        Application Developer at Swisscom.
      </motion.p>
      
      {/* Scroll Down Arrow */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: [0, 10, 0],
          opacity: show_arrow ? 1 : 0
        }}
        transition={{ 
          y: { repeat: Infinity, duration: 1.5 },
          opacity: { duration: 0.3 }
        }}
        onClick={() => {
          window.scrollBy({
            top: window.innerHeight,
            behavior: 'smooth'
          });
          set_show_arrow(false);
        }}
      >
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-white opacity-80 hover:opacity-100 transition-opacity"
        >
          <path 
            d="M7 10L12 15L17 10" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
