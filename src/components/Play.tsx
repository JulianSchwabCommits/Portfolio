import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  demo_url: string;
  github_url: string;
  tags: string[];
}

const Play = () => {
  const [projects, set_projects] = useState<Project[]>([]);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  useEffect(() => {
    const fetch_projects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        set_projects(data || []);
      } catch (err) {
        set_error(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        set_loading(false);
      }
    };

    fetch_projects();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="glass-morphism p-6 rounded-xl"
        >
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <p className="text-gray-400 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/10 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4">
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Demo
            </a>
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              GitHub
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Play; 