import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { use_theme } from "../context/ThemeContext";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  year: string;
  technologies: string[];
  demo_url: string | null;
  github_url: string | null;
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


// ProjectCard component to display project details
const ProjectCard = ({
  id,
  title,
  description,
  year,
  technologies,
  demo_url,
  github_url
}: ProjectCardProps) => {
  const { theme } = use_theme();
  const navigate = useNavigate();
  const { ref, transform, glareStyle, handleMouseMove, handleMouseLeave, isHovered } = use3DTilt();
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on GitHub link
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    navigate(`/projects/${id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="h-full"
      style={{ perspective: '1000px' }}
    >
      <div
        ref={ref}        className={`glass-morphism rounded-2xl overflow-hidden p-8 h-full flex flex-col justify-between cursor-pointer transform-gpu transition-all duration-200 ${
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
        onClick={handleCardClick}
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
        
        <div className="flex-1 relative z-20 transform-gpu" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex justify-between items-start mb-4">
            <span className={`text-lg transition-colors duration-200 ${
              isHovered ? 'text-gray-300' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>{year}</span>
            {demo_url && (
              <a
                href={demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-5 py-2 rounded-full transition-all duration-200 text-center ${
                  isHovered 
                    ? theme === 'light' 
                      ? 'bg-gray-200 text-gray-900 scale-105' 
                      : 'bg-white/25 text-white scale-105'
                    : theme === 'light' 
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Preview →
              </a>
            )}
          </div>

          <h3 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
            isHovered && theme === 'dark' ? 'text-white' : theme === 'light' ? 'text-gray-800' : 'text-gray-100'
          }`}>{title}</h3>
          <p className={`text-lg mb-6 transition-colors duration-200 ${
            isHovered ? 'text-gray-200' : theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>{description}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-4 relative z-20 transform-gpu" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex flex-wrap gap-2 max-w-full sm:max-w-[70%]">
            {technologies.map((tech, index) => (
              <span 
                key={index}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  isHovered 
                    ? theme === 'light'
                      ? 'scale-105 bg-gray-200 !text-gray-800'
                      : 'scale-105 bg-white/20 !text-gray-200' 
                    : theme === 'light' 
                      ? 'bg-gray-100 !text-gray-800' 
                      : 'bg-white/10 !text-gray-300'
                }`}
              >
                {tech}
              </span>
            ))}
          </div>

          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-5 py-2 mt-1 sm:mt-0 rounded-full transition-all duration-200 text-center shrink-0 ${
                isHovered 
                  ? theme === 'light' 
                    ? 'bg-gray-200 text-gray-900 scale-105' 
                    : 'bg-white/25 text-white scale-105'
                  : theme === 'light' 
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              GitHub →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
