import { motion } from "framer-motion";
import { use_theme } from "../context/ThemeContext";

interface ExperienceProps {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies?: string[];
}

const WorkExperience = ({
  title,
  company,
  period,
  description,
  technologies,
}: ExperienceProps) => {
  const { theme } = use_theme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="glass-morphism p-6 md:p-8 rounded-2xl mb-6 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1"
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col md:flex-row md:justify-between mb-4">
        <div>
          <h3 className="text-2xl font-semibold mb-1">{title}</h3>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-2`}>@{company}</p>
        </div>
        <div className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} md:text-right`}>{period}</div>
      </div>
      
      <p className={`mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{description}</p>
      
      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {technologies.map((tech) => (
            <span key={tech} className="technologie-pill">
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default WorkExperience;
