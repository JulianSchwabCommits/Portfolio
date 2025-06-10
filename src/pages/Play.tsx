import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PageTransition from "../components/PageTransition";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../utils/supabase";

interface Project {
  id: number;
  title: string;
  description: string;
  demo_url: string | null;
  github_url: string | null;
  tags: string[];
  year: string;
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
          .order('year', { ascending: false });

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

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-20">
        <motion.div 
          className="flex flex-col items-center justify-center text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-serif mb-8"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.7, ease: "easeOut" }
              }
            }}
          >
            Personal Projects
          </motion.h1>
        </motion.div>
        
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                year={project.year}
                technologies={project.tags}
                demo_url={project.demo_url}
                github_url={project.github_url}
              />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Play;
