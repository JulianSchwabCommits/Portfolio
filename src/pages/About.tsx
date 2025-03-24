
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

const About = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        <motion.div 
          className="flex flex-col items-center justify-center text-center mb-16"
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
            className="text-4xl md:text-5xl font-serif mb-8"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.7, ease: "easeOut" }
              }
            }}
          >
            About Me
          </motion.h1>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-300">
                Hi, I'm Julian Schwab, an Application Developer at Swisscom. I'm passionate about 
                creating elegant solutions to complex problems and bringing innovative ideas to life 
                through code.
              </p>
              
              <p className="text-lg text-gray-300">
                With expertise in full-stack development, I specialize in building scalable web applications 
                using modern technologies like React, TypeScript, and Node.js.
              </p>
              
              <p className="text-lg text-gray-300">
                When I'm not coding, you can find me exploring new technologies, contributing to open-source 
                projects, or sharing my knowledge with the developer community.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="glass-morphism rounded-2xl overflow-hidden aspect-[3/4] hover-scale">
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                  <p className="text-sm text-gray-400">Image 1</p>
                </div>
              </div>
              
              <div className="glass-morphism rounded-2xl overflow-hidden aspect-[3/4] hover-scale">
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                  <p className="text-sm text-gray-400">Image 2</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
