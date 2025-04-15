import { motion } from "framer-motion";
import { use_theme } from "../context/ThemeContext";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  year: string;
  technologies?: string[];
  link?: string;
}

const ProjectCard = ({
  title,
  subtitle,
  description,
  year,
  technologies,
  link
}: ProjectCardProps) => {
  const { theme } = use_theme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="glass-morphism rounded-2xl p-6 md:p-8 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row md:justify-between mb-4">
        <div>
          <h3 className="text-2xl font-semibold mb-1">{title}</h3>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-2`}>{subtitle}</p>
        </div>
        <div className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} md:text-right`}>{year}</div>
      </div>
      
      <p className={`mb-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{description}</p>
      
      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {technologies.map((tech) => (
            <span key={tech} className="technologie-pill">
              {tech}
            </span>
          ))}
        </div>
      )}
      
      {link && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`inline-block mt-2 px-4 py-2 glass-morphism rounded-full transition-all duration-300 ${
            theme === 'light' ? 'hover:bg-black/10' : 'hover:bg-white/10'
          }`}
        >
          View Project →
        </a>
      )}
    </motion.div>
  );
};

export default ProjectCard;
