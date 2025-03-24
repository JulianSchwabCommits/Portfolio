
import { motion, useScroll, useTransform } from "framer-motion";
import PageTransition from "../components/PageTransition";
import WorkExperience from "../components/WorkExperience";
import { useEffect, useRef, useState } from "react";

const Work = () => {
  const [scrollY, setScrollY] = useState(0);
  const titleRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate title position and scale based on scroll
  const titleTransform = {
    position: scrollY > 100 ? "fixed" : "relative",
    top: scrollY > 100 ? "1rem" : "auto",
    left: scrollY > 100 ? "1rem" : "auto",
    transform: scrollY > 100 ? "scale(0.5)" : "scale(1)",
    transformOrigin: "top left",
    zIndex: 40,
    transition: "all 0.4s ease-out",
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        {/* Title section with ref for tracking */}
        <div ref={titleRef} 
             style={titleTransform} 
             className="flex flex-col items-center justify-center text-center mb-16 mx-[5px] my-[19px]">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-serif"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Hi, I'm Julian.<br />A Coder.
          </motion.h1>
          
          <motion.p 
            className="text-gray-400 mt-4 text-lg md:text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            Application Developer at Swisscom.
          </motion.p>
        </div>

        {/* Space reserved when title becomes fixed */}
        {scrollY > 100 && (
          <div className="h-[150px] md:h-[180px] mb-16"></div>
        )}

        {/* Work Experience Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-serif mb-8 text-center">Experience</h2>
          <WorkExperience />
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Work;
