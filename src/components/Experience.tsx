import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api_client';
import { use_theme } from '../context/ThemeContext';

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
  link?: string;
  link_name?: string;
}

// Custom hook to detect mobile devices
const use_device_detection = () => {
  const [is_mobile, set_is_mobile] = useState(false);

  useEffect(() => {
    const check_mobile = () => {
      const mobile_regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return mobile_regex.test(navigator.userAgent) || window.innerWidth < 768;
    };

    set_is_mobile(check_mobile());

    // Listen for resize events to handle dynamic viewport changes
    const handle_resize = () => {
      set_is_mobile(check_mobile());
    };

    window.addEventListener('resize', handle_resize);
    return () => window.removeEventListener('resize', handle_resize);
  }, []);

  return { is_mobile };
};



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
    const centerY = rect.height / 2;    // Calculate rotation based on mouse position relative to center
    const rotateY = ((x - centerX) / centerX) * 4; // Left/Right tilt (reduced from 8)
    const rotateX = ((y - centerY) / centerY) * -4; // Up/Down tilt (reduced from 8)
    
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
    setIsHovered(false);  };

  return { ref, transform, glareStyle, handleMouseMove, handleMouseLeave, isHovered };
};

// Experience Card component with 3D tilt effect
const ExperienceCard = ({ exp, index }: { exp: Experience; index: number }) => {
  const { theme } = use_theme();
  const navigate = useNavigate();
  const { is_mobile } = use_device_detection();
  const { ref, transform, glareStyle, handleMouseMove, handleMouseLeave, isHovered } = use3DTilt();

  const handleClick = () => {
    // Only navigate on desktop devices
    if (!is_mobile) {
      navigate(`/experiences/${exp.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-6"
      style={{ perspective: '1000px' }}
    >      <div
        ref={ref}
        className={`glass-morphism p-6 md:p-8 rounded-2xl transition-all duration-200 ${
          !is_mobile ? 'cursor-pointer' : ''
        } transform-gpu ${
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
        onClick={handleClick}
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
          <div className="relative z-20 transform-gpu" style={{ transform: 'translateZ(20px)' }}>          <div className="flex flex-col md:flex-row md:justify-between mb-4">
            <div>
              <h3 className={`text-2xl font-semibold mb-1 transition-colors duration-200 ${
                isHovered && theme === 'dark' ? 'text-white' : theme === 'light' ? 'text-gray-800' : 'text-gray-100'
              }`}>{exp.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <p className={`transition-colors duration-200 ${
                  isHovered ? 'text-gray-300' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>{exp.company}</p>                {exp.link && exp.link_name && (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-2 py-1 rounded-md text-sm transition-all duration-200 hover:scale-105 ${
                      theme === 'light' 
                        ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' 
                        : 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {exp.link_name}
                  </a>
                )}
              </div>
            </div>
            <div className={`md:text-right transition-colors duration-200 ${
              isHovered ? 'text-gray-300' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>{exp.period}</div>
          </div>
          
          <p className={`mb-4 transition-colors duration-200 ${
            isHovered ? 'text-gray-200' : theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>{exp.description}</p>
          
          {exp.skills && exp.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {exp.skills.map((skill) => (
                <span
                  key={skill}
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
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const [experiences, set_experiences] = useState<Experience[]>([]);
  const [loading, set_loading] = useState(true);
  const { theme } = use_theme();
  useEffect(() => {
    const fetch_experiences = async () => {
      try {
        const data = await apiClient.getExperiences();
        set_experiences(data || []);
      } catch (err) {
        console.warn('Failed to fetch experiences from API:', err);
        set_experiences([]);
      } finally {
        set_loading(false);
      }
    };

    fetch_experiences();
  }, []);  if (loading) return <div className="text-center">Loading...</div>;

  if (experiences.length === 0) {
    return (
      <div className="space-y-8">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16">Experience</h2>
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-4">Cannot connect to server</p>
          <p className="text-lg text-gray-400">
            Contact Julian under{" "}
            <a 
              href="mailto:me@julianschwab.dev" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              me@julianschwab.dev
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-4xl md:text-5xl font-serif text-center mb-16">Experience</h2>
      {experiences.map((exp, index) => (
        <ExperienceCard key={exp.id} exp={exp} index={index} />
      ))}
    </div>
  );
};

export default Experience; 