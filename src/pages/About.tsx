import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import PageTransition from "../components/PageTransition";
import { supabase } from "../utils/supabase";
import { use_theme } from "../context/ThemeContext";

interface AboutData {
  id: number;
  text: string;
}

// Fallback about data
const fallbackAboutData: AboutData[] = [
  {
    id: 1,
    text: `Hello! I'm Julian, a passionate developer with a deep love for creating innovative solutions and exploring the endless possibilities of technology.

My journey began with web development, where I discovered my fascination with building responsive and modern web experiences using React, TypeScript, and TailwindCSS. From there, I've expanded into the exciting world of artificial intelligence and machine learning, working on projects that leverage Python, TensorFlow, and PyTorch to solve real-world problems.

Currently, I'm working at Swisscom on the Apps Team, where I design and implement AI-powered features that enhance business automation and decision-making. I'm also continuously learning from 'Hands-On Machine Learning' while applying these concepts to personal projects.

When I'm not coding, you can find me kiteboarding on the water, exploring the great outdoors, or diving into the latest tech trends. I believe in the power of continuous learning and am always excited to take on new challenges that push the boundaries of what's possible.`
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

// 3D Tilt Image Component
const TiltImage = ({ src, alt }: { src: string; alt: string }) => {
  const { theme } = use_theme();
  const { ref, transform, glareStyle, handleMouseMove, handleMouseLeave, isHovered } = use3DTilt();

  return (
    <div style={{ perspective: '1000px' }} className="aspect-[3/4]">
      <div
        ref={ref}
        className={`glass-morphism rounded-2xl overflow-hidden w-full h-full cursor-pointer transform-gpu transition-all duration-200 ${
          isHovered ? 'shadow-2xl shadow-white/10' : 'shadow-lg shadow-black/20'
        }`}
        style={{
          transform: transform,
          transition: 'transform 0.15s ease-out, box-shadow 0.2s ease-out',
          transformStyle: 'preserve-3d'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Enhanced background on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl transition-opacity duration-200 z-10 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-20"
          style={{
            ...glareStyle,
            transition: 'opacity 0.3s ease-out'
          }}
        />
        
        {/* Reflection gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-2xl pointer-events-none z-10" />
        
        <div className="relative z-30 w-full h-full transform-gpu" style={{ transform: 'translateZ(20px)' }}>
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover rounded-2xl" 
          />
        </div>
      </div>
    </div>
  );
};

const About = () => {
  const [about_data, set_about_data] = useState<AboutData[]>([]);
  const [loading, set_loading] = useState(true);
  useEffect(() => {
    const fetch_about = async () => {
      try {
        const { data, error } = await supabase
          .from('about')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        set_about_data(data && data.length > 0 ? data : fallbackAboutData);
      } catch (err) {
        console.warn('Failed to fetch about data from Supabase, using fallback data:', err);
        set_about_data(fallbackAboutData);
      } finally {
        set_loading(false);
      }
    };

    fetch_about();
  }, []);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : about_data.length > 0 ? (
              <>
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="space-y-6"
                >
                  {about_data.map((item) => (
                    <p key={item.id} className="text-lg text-gray-300 whitespace-pre-line">
                      {item.text}
                    </p>
                  ))}
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <TiltImage src="/julian.jpg" alt="Julian Schwab" />
                  <TiltImage src="/kiting.jpg" alt="Julian kiteboarding" />
                </motion.div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
