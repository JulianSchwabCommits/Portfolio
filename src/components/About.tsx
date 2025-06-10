import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';
import { use_theme } from '../context/ThemeContext';

interface AboutData {
  id: number;
  text: string;
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

const About = () => {
  const [about_data, set_about_data] = useState<AboutData | null>(null);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);
  const { theme } = use_theme();
  const { ref, transform, glareStyle, handleMouseMove, handleMouseLeave, isHovered } = use3DTilt();

  useEffect(() => {
    const fetch_about = async () => {
      try {
        const { data, error } = await supabase
          .from('about')
          .select('*')
          .single();

        if (error) throw error;
        set_about_data(data);
      } catch (err) {
        set_error(err instanceof Error ? err.message : 'Failed to fetch about data');
      } finally {
        set_loading(false);
      }
    };

    fetch_about();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!about_data) return null;
  return (
    <div style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}        className={`glass-morphism p-8 rounded-2xl cursor-pointer transform-gpu transition-all duration-200 ${
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
        
        <div className="relative z-20 transform-gpu" style={{ transform: 'translateZ(20px)' }}>
          <p className={`text-lg leading-relaxed whitespace-pre-line transition-colors duration-200 ${
            isHovered ? 'text-gray-200' : theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>{about_data.text}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default About; 