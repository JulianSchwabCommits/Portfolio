import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import ProjectCard from "../components/ProjectCard";
import { useContent } from "../context/ContentContext";

const Play = () => {
  const { content } = useContent();
  const projects = content.projects;

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
        {projects.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-gray-300 mb-4">Cannot connect to server</p>
            <p className="text-lg text-gray-400">
              Contact Julian under{" "}
              <a 
                href="mailto:me@julianschwab.dev" 
                className="text-blue-400 hover:text-blue-300 underline"
              >
                me@julianschwab.dev
              </a>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                year={project.year}
                tags={project.tags}
                demoUrl={project.demoUrl}
                githubUrl={project.githubUrl}
              />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Play;
