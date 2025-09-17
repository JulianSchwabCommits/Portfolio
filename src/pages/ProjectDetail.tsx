import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { use_theme } from '../context/ThemeContext';
import { useContent } from '../context/ContentContext';
import type { ProjectContent } from '../types/content';

const renderFallback = (theme: string, message: string) => (
  <PageTransition>
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div
        className={`glass-morphism rounded-2xl p-8 text-center max-w-md ${
          theme === 'light' ? 'shadow-lg shadow-gray-900/20' : 'shadow-lg shadow-black/20'
        }`}
      >
        <div className={`text-xl mb-4 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>{message}</div>
        <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          Cannot connect to server. Please contact me directly.
        </p>
        <Link
          to="/contact"
          className={`inline-block px-6 py-3 rounded-2xl transition-all duration-200 ${
            theme === 'light'
              ? 'bg-gray-800 text-white hover:bg-gray-700 shadow-lg shadow-gray-900/20'
              : 'bg-white/10 text-white hover:bg-white/20 shadow-lg shadow-black/20'
          }`}
        >
          Contact Me
        </Link>
      </div>
    </div>
  </PageTransition>
);

const ProjectDetail = () => {
  const { id } = useParams();
  const { theme } = use_theme();
  const { content } = useContent();

  if (!id) {
    return renderFallback(theme, 'No project selected');
  }

  const projectId = Number(id);
  if (Number.isNaN(projectId)) {
    return renderFallback(theme, 'Invalid project ID');
  }

  const project: ProjectContent | undefined = content.projects.find(item => item.id === projectId);

  if (!project) {
    return renderFallback(theme, 'Project not found');
  }

  const detailCopy = project.longDescription ?? project.description;

  return (
    <PageTransition key={`project-detail-${theme}`}>
      <div
        className="min-h-screen bg-gradient-to-b from-background to-background/50"
        style={{ pointerEvents: 'auto' }}
      >
        <div
          className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24 pt-24 pb-20"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1
                className={`text-5xl md:text-6xl font-serif mb-2 ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}
              >
                {project.title}
              </h1>
              <p className={`text-2xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{project.year}</p>
            </motion.div>

            <motion.div
              key={`project-actions-${theme}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-4 mt-4 md:mt-0"
            >
              {project.githubUrl && (
                <div className="relative">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block px-6 py-3 rounded-full transition-all duration-200 text-lg font-medium relative z-[100] backdrop-blur-xl border ${
                      theme === 'light'
                        ? 'bg-black/5 border-black/10 text-gray-800 hover:bg-black/10'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    GitHub →
                  </a>
                </div>
              )}
              {project.demoUrl && (
                <div className="relative">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block px-6 py-3 rounded-full transition-all duration-200 text-lg font-medium relative z-[100] backdrop-blur-xl border ${
                      theme === 'light'
                        ? 'bg-black/5 border-black/10 text-gray-800 hover:bg-black/10'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    Live Demo →
                  </a>
                </div>
              )}
            </motion.div>
          </div>

          {/* Image */}
          {project.imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <img src={project.imageUrl} alt={project.title} className="w-full h-auto rounded-2xl" />
            </motion.div>
          )}

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <p
              className={`text-xl leading-relaxed ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-200'
              }`}
            >
              {detailCopy}
            </p>
          </motion.div>

          {/* Technologies */}
          {project.tags && project.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className={`text-2xl font-serif mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className={`px-4 py-2 rounded-full text-lg transition-colors duration-200 ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-white/10 text-gray-200 hover:bg-white/20'
                    }`}
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
