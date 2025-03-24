import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

const About = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24 pt-24 pb-20">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{
            hidden: {
              opacity: 0
            },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }} 
          className="flex flex-col items-center justify-center text-center mb-16 mx-[5px] my-[19px]"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-serif mb-8" 
            variants={{
              hidden: {
                opacity: 0,
                y: 50
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                  ease: "easeOut"
                }
              }
            }}
          >
            About Me
          </motion.h1>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.7,
            delay: 0.2
          }} className="space-y-6">
              <p className="text-lg text-gray-300">
                Hi, I'm Julian Schwab, an Application Developer at Swisscom. I'm passionate about 
                creating elegant solutions to complex problems and bringing innovative ideas to life 
                through code.
              </p>
              
              <p className="text-lg text-gray-300">
                With expertise in both front end and AI development, I specialize in building engaging user interfaces with React, TypeScript, and TailwindCSS, as well as AI-powered solutions with Python.
              </p>
              
              <p className="text-lg text-gray-300">
              When I'm not coding, I'm exploring new technologies, kitesurfing or hiking in nature, and staying active at the gym.
              </p>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            x: 50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.7,
            delay: 0.4
          }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-morphism rounded-2xl overflow-hidden aspect-[3/4] hover-scale">
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                  <img src="/julian.jpg" alt="Julian Schwab" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="glass-morphism rounded-2xl overflow-hidden aspect-[3/4] hover-scale">
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                  <img src="/kiting.jpg" alt="Julian kiteboarding" className="w-full h-full object-cover" />
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
