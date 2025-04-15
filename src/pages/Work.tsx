import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import Hero from "../components/Hero";
import Experience from "../components/Experience";
import WorkExperience from "../components/WorkExperience";

const experienceData = [
  {
    title: "AI Development",
    company: "Apps Team, @Swisscom",
    period: "2024-Present",
    description: "Designing and implementing AI-powered features at Apps Team to enhance business automation and decision-making.",
    technologies: ["Python", "Machine Learning", "Ollama","aws-bedrock"]
  },
  {
    title: "Machine Learning Development",
    company: "Personal",
    period: "2024-Present",
    description: "Exploring and implementing machine learning models for predictive analytics and automation. Learning from 'Hands-On Machine Learning' while applying concepts to real-world projects.",
    technologies: ["Python", "scikit-learn", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Matplotlib"]
  },
  {
    title: "RPA Development",
    company: "Swisscom",
    period: "2023-2024",
    description: "Automating business processes using UiPath RPA platform.",
    technologies: ["RPA", "UiPath Studio", "UiPath Orchestrator", "Automations"]
  },
  {
    title: "Game Development",
    company: "Personal",
    period: "2023-2024",
    description: "Creating immersive 3D experiences with Unreal Engine 5.",
    technologies: ["Unreal Engine", "C++", "Blender"]
  },
  {
    title: "Python Games",
    company: "Personal",
    period: "2022-2024",
    description: "Collection of interactive Python games using Pygame.",
    technologies: ["Python", "Pygame"]
  },
  {
    title: "Web Development",
    company: "Personal",
    period: "2021-Present",
    description: "Creating responsive and modern web experiences.",
    technologies: ["React", "Vite", "TailwindCSS", "HTML", "CSS", "JavaScript"]
  }
];

const Work = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24 pt-0 pb-20">
        <div className="pt-0">
          <Hero />
        </div>
        <div className="mt-16">
          <Experience />
        </div>
      </div>
    </PageTransition>
  );
};

export default Work;
  