
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import Hero from "../components/Hero";
import WorkExperience from "../components/WorkExperience";

const experienceData = [
  {
    title: "Application Developer",
    company: "Swisscom",
    period: "2021-Present",
    description: "Developing and maintaining enterprise-level applications. Working with cross-functional teams to deliver high-quality software solutions.",
    technologies: ["React", "TypeScript", "Node.js", "AWS"]
  },
  {
    title: "Web Development",
    company: "Personal",
    period: "2021-Present",
    description: "Creating responsive and modern web experiences.",
    technologies: ["React", "Next.js", "TailwindCSS"]
  },
  {
    title: "Python Games",
    company: "Personal",
    period: "2022-Present",
    description: "Collection of interactive Python games using Pygame",
    technologies: ["Python", "Pygame"]
  },
  {
    title: "Game Development",
    company: "Personal",
    period: "2023-2024",
    description: "Creating immersive 3D experiences with Unreal Engine 5",
    technologies: ["Unreal Engine", "C++", "Blender"]
  }
];

const Work = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24 pt-24 pb-20">
        <Hero />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-32 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16">Experience</h2>
          
          <div className="max-w-4xl mx-auto">
            {experienceData.map((exp, index) => (
              <WorkExperience
                key={index}
                title={exp.title}
                company={exp.company}
                period={exp.period}
                description={exp.description}
                technologies={exp.technologies}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Work;
