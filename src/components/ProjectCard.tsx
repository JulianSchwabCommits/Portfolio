import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  year: string;
  technologies: string[];
  demo_url: string | null;
  github_url: string | null;
}

const ProjectCard = ({
  title,
  description,
  year,
  technologies,
  demo_url,
  github_url
}: ProjectCardProps) => {
  return (
    <motion.div
      className="glass-morphism rounded-3xl overflow-hidden hover-scale p-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-400 text-lg">{year}</span>
        {demo_url && (
          <a
            href={demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors text-center"
          >
            Preview →
          </a>
        )}
      </div>

      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-300 text-lg mb-6">{description}</p>
      
      <div className="flex justify-between items-end">
        <div className="flex flex-wrap gap-2 max-w-[70%]">
          {technologies.map((tech, index) => (
            <span 
              key={index}
              className="px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300"
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
            className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors text-center"
          >
            GitHub →
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
