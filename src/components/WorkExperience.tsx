import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { use_theme } from "../context/ThemeContext";

interface ExperienceProps {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies?: string[];
}

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
    const rotateY = ((x - centerX) / centerX) * 15; // Left/Right tilt
    const rotateX = ((y - centerY) / centerY) * -15; // Up/Down tilt (inverted for natural feel)
    
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

const WorkExperience = ({
  title,
  company,
  period,
  description,
  technologies,
}: ExperienceProps) => {
  const { theme } = use_theme();
  const { ref, transform, glareStyle, handleMouseMove, handleMouseLeave, isHovered } = use3DTilt();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="mb-6"
      style={{ perspective: '1000px' }}
    >
      <div
        ref={ref}
        className={`glass-morphism p-6 md:p-8 rounded-2xl cursor-pointer transform-gpu transition-all duration-200 ${
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
        {/* Enhanced background on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl transition-opacity duration-200 ${
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
        
        <div className="relative z-20 transform-gpu" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex flex-col md:flex-row md:justify-between mb-4">
            <div>
              <h3 className={`text-2xl font-semibold mb-1 transition-colors duration-200 ${
                isHovered && theme === 'dark' ? 'text-white' : theme === 'light' ? 'text-gray-800' : 'text-gray-100'
              }`}>{title}</h3>
              <p className={`mb-2 transition-colors duration-200 ${
                isHovered ? 'text-gray-300' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>@{company}</p>
            </div>
            <div className={`md:text-right transition-colors duration-200 ${
              isHovered ? 'text-gray-300' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>{period}</div>
          </div>
          
          <p className={`mb-4 transition-colors duration-200 ${
            isHovered ? 'text-gray-200' : theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>{description}</p>
          
          {technologies && technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {technologies.map((tech) => (
                <span 
                  key={tech} 
                  className={`technologie-pill transition-all duration-200 ${
                    isHovered ? 'scale-105 bg-white/20' : ''
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WorkExperience;
