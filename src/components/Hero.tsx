
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center text-center"
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
        className="text-6xl md:text-8xl font-serif mb-6"
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
        className="text-5xl md:text-7xl font-serif mb-8"
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
        className="text-xl md:text-2xl text-gray-400 max-w-xl"
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
    </motion.div>
  );
};

export default Hero;
