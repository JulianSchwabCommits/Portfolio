import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import ProjectCard from "../components/ProjectCard";

const projects = [
  {
    title: "VisualizeAlgs",
    subtitle: "Algorithm Visualization Tool",
    description: "Interactive platform for visualizing common algorithms and data structures.",
    year: "2023",
    technologies: ["HTML", "CSS", "JavaScript"],
    link: "https://algs.julianschwab.dev"
  },
  /*
  {
    title: "Games Hub",
    subtitle: "Collection of Web Games",
    description: "A hub for simple, fun browser games built with vanilla web technologies.",
    year: "2023",
    technologies: ["HTML", "CSS", "JavaScript"],
    link: "https://play.julianschwab.dev"
  },
  {
    title: "Chat",
    subtitle: "AI Chatbot Interface",
    description: "Modern AI chatbot that connects to Openrouter API with a sleek, responsive UI.",
    year: "2024",
    technologies: ["React", "OpenRouter API", "TailwindCSS"],
    link: "https://chat.julianschwab.dev"
  },
  */
  {
    title: "FaceRecognition",
    subtitle: "Facial Analysis Tool",
    description: "Application for face detection and recognition using Deepface technology.",
    year: "2023",
    technologies: ["Python", "OpenCV", "Deepface"],
    link: "https://github.com/JulianSchwabCommits/FaceRecognition"
  },
  {
    title: "Portfolio",
    subtitle: "Personal Showcase",
    description: "Modern, responsive portfolio website showcasing projects and professional experience.",
    year: "2024",
    technologies: ["React", "Vite", "TailwindCSS"],
    link: "https://julianschwab.dev"
  }
];

const Play = () => {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              subtitle={project.subtitle}
              description={project.description}
              year={project.year}
              technologies={project.technologies}
              link={project.link}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Play;
