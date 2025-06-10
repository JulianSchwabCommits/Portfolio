import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';
import PageTransition from '../components/PageTransition';
import { use_theme } from '../context/ThemeContext';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  year: string;
  github_url?: string;
  demo_url?: string;
  image_url?: string;
}

// Custom hook for 3D tilt effect
const use3DTilt = () => {
  const ref = useRef<HTMLAnchorElement>(null);
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

// Tilt Button Component
const TiltButton = ({ href, children, theme }: { href: string, children: React.ReactNode, theme: string }) => {
  const { ref, transform, glareStyle, handleMouseMove, handleMouseLeave, isHovered } = use3DTilt();

  return (
    <div className="perspective-1000" style={{ perspective: '1000px' }}>
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"        className={`relative block px-6 py-3 rounded-lg transition-all duration-200 text-lg transform-gpu overflow-hidden ${
          theme === 'light' 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-white/10 hover:bg-white/20 text-white'
        } ${isHovered 
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
        <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-lg z-10"
          style={{
            ...glareStyle,
            transition: 'opacity 0.3s ease-out'
          }}
        />
        
        {/* Reflection gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-lg pointer-events-none" />
          <span className="relative z-20 transform-gpu text-white" style={{ transform: 'translateZ(20px)' }}>
          {children}
        </span>
      </a>
    </div>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, set_project] = useState<Project | null>(null);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);
  const { theme } = use_theme();

  useEffect(() => {
    const fetch_project = async () => {
      if (!id) {
        set_error('No project ID provided');
        set_loading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', parseInt(id))
          .single();

        if (error) throw error;
        if (!data) {
          set_error('Project not found');
          set_project(null);
        } else {
          set_project(data);
        }
      } catch (err) {
        set_error(err instanceof Error ? err.message : 'Failed to fetch project');
        set_project(null);
      } finally {
        set_loading(false);
      }
    };

    fetch_project();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">{error || 'Project not found'}</div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24 pt-32 pb-20">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-serif mb-2">{project.title}</h1>
              <p className="text-2xl text-gray-400">{project.year}</p>
            </motion.div>            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-4 mt-4 md:mt-0"
            >
              {project.github_url && (
                <TiltButton href={project.github_url} theme={theme}>
                  View on GitHub
                </TiltButton>
              )}
              {project.demo_url && (
                <TiltButton href={project.demo_url} theme={theme}>
                  Live Demo
                </TiltButton>
              )}
            </motion.div>
          </div>

          {/* Image */}
          {project.image_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <img 
                src={project.image_url} 
                alt={project.title}
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
          )}

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <p className="text-xl leading-relaxed">{project.description}</p>
          </motion.div>

          {/* Technologies */}
          {project.tags && project.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-white/10 rounded-full text-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ProjectDetail; 