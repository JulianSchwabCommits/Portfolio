import { motion } from "framer-motion";
import { use_theme } from "../context/ThemeContext";

interface ProjectCardProps {
  title: string;
  description: string;
  year: string;
  technologies: string[];
  demo_url: string | null;
  github_url: string | null;
}


// ProjectCard component to display project details

const ProjectCard = ({
  title,
  description,
  year,
  technologies,
  demo_url,
  github_url
}: ProjectCardProps) => {
  const { theme } = use_theme();
  
  return (
    <motion.div
      className="glass-morphism rounded-3xl overflow-hidden p-8 h-full flex flex-col justify-between transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <span className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{year}</span>
          {demo_url && (
            <a
              href={demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-5 py-2 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-white/10 hover:bg-white/20 text-white'} rounded-full transition-colors text-center`}
            >
              Preview →
            </a>
          )}
        </div>

        <h3 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{title}</h3>
        <p className={`text-lg mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{description}</p>
      </div>
      
      <div className="flex justify-between items-end">
        <div className="flex flex-wrap gap-2 max-w-[70%]">
          {technologies.map((tech, index) => (
            <span 
              key={index}
              className={`px-4 py-2 ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-white/10 text-gray-300'} rounded-full text-sm`}
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
            className={`px-5 py-2 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-white/10 hover:bg-white/20 text-white'} rounded-full transition-colors text-center`}
          >
            GitHub →
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
