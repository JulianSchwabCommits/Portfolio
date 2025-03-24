
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import ProjectCard from "../components/ProjectCard";

const projects = [
  {
    title: "Personal AI Assistant",
    subtitle: "AI-powered productivity tool",
    description: "A smart assistant that helps with daily tasks using natural language processing.",
    year: "2024",
    technologies: ["React", "TypeScript", "OpenAI", "TailwindCSS"],
    link: "#"
  },
  {
    title: "Smart Home Dashboard",
    subtitle: "IoT Control Center",
    description: "A centralized dashboard for managing smart home devices and monitoring energy usage.",
    year: "2024",
    technologies: ["React", "IoT", "Real-time Data", "Charts"],
    link: "#"
  },
  {
    title: "Crypto Portfolio Tracker",
    subtitle: "Financial Management Tool",
    description: "Track and analyze cryptocurrency investments with real-time data and visualizations.",
    year: "2023",
    technologies: ["React", "TypeScript", "API Integration", "Charts"],
    link: "#"
  },
  {
    title: "Weather App",
    subtitle: "Location-based Weather Service",
    description: "Elegant weather forecasting application with interactive maps and alerts.",
    year: "2023",
    technologies: ["React Native", "APIs", "Geolocation"],
    link: "#"
  },
  {
    title: "Task Management System",
    subtitle: "Productivity Application",
    description: "Collaborative task management system with real-time updates and priority sorting.",
    year: "2022",
    technologies: ["React", "Node.js", "MongoDB", "WebSockets"],
    link: "#"
  },
  {
    title: "E-commerce Platform",
    subtitle: "Online Shopping Solution",
    description: "Full-featured e-commerce platform with product management, cart, and checkout.",
    year: "2022",
    technologies: ["Next.js", "Stripe", "MongoDB", "Authentication"],
    link: "#"
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
