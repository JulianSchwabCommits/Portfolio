import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';
import { use_theme } from '../context/ThemeContext';

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

// Fallback experience data
const fallbackExperiences: Experience[] = [
  {
    id: 1,
    title: "AI Development",
    company: "Apps Team, @Swisscom",
    period: "2024-Present",
    description: "Designing and implementing AI-powered features at Apps Team to enhance business automation and decision-making.",
    skills: ["Python", "Machine Learning", "Ollama", "aws-bedrock"]
  },
  {
    id: 2,
    title: "Machine Learning Development",
    company: "Personal",
    period: "2024-Present",
    description: "Exploring and implementing machine learning models for predictive analytics and automation. Learning from 'Hands-On Machine Learning' while applying concepts to real-world projects.",
    skills: ["Python", "scikit-learn", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Matplotlib"]
  },
  {
    id: 3,
    title: "RPA Development",
    company: "Swisscom",
    period: "2023-2024",
    description: "Automating business processes using UiPath RPA platform.",
    skills: ["RPA", "UiPath Studio", "UiPath Orchestrator", "Automations"]
  },
  {
    id: 4,
    title: "Game Development",
    company: "Personal",
    period: "2023-2024",
    description: "Creating immersive 3D experiences with Unreal Engine 5.",
    skills: ["Unreal Engine", "C++", "Blender"]
  },
  {
    id: 5,
    title: "Python Games",
    company: "Personal",
    period: "2022-2024",
    description: "Collection of interactive Python games using Pygame.",
    skills: ["Python", "Pygame"]
  },
  {
    id: 6,
    title: "Web Development",
    company: "Personal",
    period: "2021-Present",
    description: "Creating responsive and modern web experiences.",
    skills: ["React", "Vite", "TailwindCSS", "HTML", "CSS", "JavaScript"]
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
  const { ref, transform, glareStyle, handleMouseMove, handleMouseLeave, isHovered } = use3DTilt();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-6"
      style={{ perspective: '1000px' }}
    >
      <div
        ref={ref}
        className={`glass-morphism p-6 rounded-xl cursor-pointer transform-gpu transition-all duration-200 ${
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
        <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl z-10"
          style={{
            ...glareStyle,
            transition: 'opacity 0.3s ease-out'
          }}
        />
        
        {/* Reflection gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-xl pointer-events-none" />
        
        <div className="relative z-20 transform-gpu" style={{ transform: 'translateZ(20px)' }}>
          <h3 className={`text-xl font-bold mb-2 transition-colors duration-200 ${
            isHovered && theme === 'dark' ? 'text-white' : theme === 'light' ? 'text-gray-800' : 'text-gray-100'
          }`}>{exp.title}</h3>
          <p className={`mb-2 transition-colors duration-200 ${
            isHovered ? 'text-gray-300' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>{exp.company}</p>
          <p className={`text-sm mb-4 transition-colors duration-200 ${
            isHovered ? 'text-gray-300' : theme === 'light' ? 'text-gray-600' : 'text-gray-500'
          }`}>{exp.period}</p>
          <p className={`mb-4 transition-colors duration-200 ${
            isHovered ? 'text-gray-200' : theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>{exp.description}</p>
          <div className="flex flex-wrap gap-2">
            {exp.skills.map((skill) => (
              <span
                key={skill}
                className={`px-3 py-1 bg-white/10 rounded-full text-sm transition-all duration-200 ${
                  isHovered ? 'scale-105 bg-white/20' : ''
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
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
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        set_experiences(data && data.length > 0 ? data : fallbackExperiences);
      } catch (err) {
        console.warn('Failed to fetch experiences from Supabase, using fallback data:', err);
        set_experiences(fallbackExperiences);
      } finally {
        set_loading(false);
      }
    };

    fetch_experiences();
  }, []);
  if (loading) return <div className="text-center">Loading...</div>;

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