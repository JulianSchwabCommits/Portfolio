export type AboutSectionType = "title" | "description";

export interface AboutSection {
  id: number;
  type: AboutSectionType;
  text: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export interface AboutContent {
  sections: AboutSection[];
  gallery: GalleryImage[];
}

export interface HeroContent {
  intro: string;
  highlight: string;
  description: string;
}

export interface ExperienceContent {
  id: number;
  title: string;
  company: string;
  period: string;
  year: string;
  description: string;
  skills: string[];
  link?: string;
  linkName?: string;
  companyUrl?: string;
  imageUrl?: string;
}

export interface ProjectContent {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  year: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export type ContactLinkType = "email" | "github" | "linkedin" | "phone" | "website" | "other";

export interface ContactLink {
  id: number;
  type: ContactLinkType;
  label: string;
  value: string;
  href: string;
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  experiences: ExperienceContent[];
  projects: ProjectContent[];
  contactLinks: ContactLink[];
}
