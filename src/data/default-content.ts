import { SiteContent } from "../types/content";

export const defaultContent: SiteContent = {
  hero: {
    intro: "Hi, I'm Julian.",
    highlight: "A Coder.",
    description: "Application Developer at Swisscom."
  },
  about: {
    sections: [
      {
        id: 1,
        type: "title",
        text: "Currently crafting digital experiences in Zurich where it's {temp}."
      },
      {
        id: 2,
        type: "description",
        text: "I'm an application developer apprentice at Swisscom with an obsession for polished user experiences. Outside of work you'll find me exploring endurance sports, testing side projects, and learning how great products are built."
      },
      {
        id: 3,
        type: "description",
        text: "This portfolio is a playground for experiments with TypeScript, React, and modern design systems. I'm constantly evolving it as I learn new techniques and frameworks."
      }
    ],
    gallery: [
      { id: 1, src: "/julian.jpg", alt: "Portrait of Julian Schwab" },
      { id: 2, src: "/kiting.jpg", alt: "Julian kiteboarding" }
    ]
  },
  experiences: [
    {
      id: 1,
      title: "Application Developer Apprentice",
      company: "Swisscom",
      period: "Aug 2023 – Present",
      year: "2023 – Present",
      description: "Building internal tooling and customer-facing prototypes with TypeScript, React, and automation workflows. I collaborate with designers and engineers to ship accessible experiences and iterate quickly on feedback.",
      skills: ["TypeScript", "React", "Automation", "Design Systems"],
      link: "https://www.swisscom.ch",
      linkName: "Swisscom",
      companyUrl: "https://www.swisscom.ch"
    },
    {
      id: 2,
      title: "Freelance Web Developer",
      company: "Independent",
      period: "2021 – Present",
      year: "2021 – Present",
      description: "Partner with local businesses to design, develop, and launch responsive websites. Focus on clear storytelling, performance budgets, and giving teams simple tooling to keep their sites fresh.",
      skills: ["Next.js", "Tailwind CSS", "Content Strategy", "SEO"],
      link: "mailto:hello@julianschwab.dev",
      linkName: "Work with me",
      companyUrl: "mailto:hello@julianschwab.dev"
    }
  ],
  projects: [
    {
      id: 1,
      title: "Portfolio Engine",
      description: "A modular portfolio built with React, shadcn/ui, and Framer Motion animations.",
      longDescription: "The portfolio engine is my sandbox for shipping polished interfaces. It includes a content layer, custom motion primitives, and a fast admin panel that lets me ship updates in minutes instead of hours.",
      year: "2024",
      tags: ["React", "TypeScript", "Framer Motion"],
      demoUrl: "https://julianschwab.dev",
      githubUrl: "https://github.com/JulianSchwabCommits",
      imageUrl: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 2,
      title: "Race Day Planner",
      description: "A progressive web app that plans fueling and pacing for endurance races.",
      longDescription: "Race Day Planner helps athletes build training blocks, log workouts, and create race-day nutrition strategies. The app syncs offline, provides reminders, and exports printable checklists for events.",
      year: "2023",
      tags: ["PWA", "Vite", "IndexedDB"],
      demoUrl: "https://racedayplanner.example.com",
      githubUrl: "https://github.com/JulianSchwabCommits/race-day-planner",
      imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 3,
      title: "Motion Components Library",
      description: "Composable motion primitives for React apps.",
      longDescription: "A collection of reusable animation patterns built with Framer Motion. It includes transitions, reveal animations, and interactive cards that help teams prototype quickly without writing bespoke motion logic each time.",
      year: "2022",
      tags: ["Framer Motion", "Component Library", "Storybook"],
      githubUrl: "https://github.com/JulianSchwabCommits/motion-library",
      imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
    }
  ],
  contactLinks: [
    {
      id: 1,
      type: "email",
      label: "Email",
      value: "me@julianschwab.dev",
      href: "mailto:me@julianschwab.dev"
    },
    {
      id: 2,
      type: "github",
      label: "GitHub",
      value: "JulianSchwabCommits",
      href: "https://github.com/JulianSchwabCommits"
    },
    {
      id: 3,
      type: "linkedin",
      label: "LinkedIn",
      value: "julian-schwab",
      href: "https://www.linkedin.com/in/julian-schwab-680349263"
    }
  ]
};
