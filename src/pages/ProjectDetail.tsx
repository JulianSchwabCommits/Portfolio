import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';
import PageTransition from '../components/PageTransition';

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

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, set_project] = useState<Project | null>(null);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-4 mt-4 md:mt-0"
            >
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-lg"
                >
                  View on GitHub
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-lg"
                >
                  Live Demo
                </a>
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