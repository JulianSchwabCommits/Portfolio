import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { defaultContent } from "../data/default-content";
import type {
  AboutContent,
  ContactLink,
  ExperienceContent,
  HeroContent,
  ProjectContent,
  SiteContent
} from "../types/content";

const STORAGE_KEY = "portfolio-content";

interface ContentContextValue {
  content: SiteContent;
  updateHero: (hero: HeroContent) => void;
  updateAbout: (about: AboutContent) => void;
  updateExperiences: (experiences: ExperienceContent[]) => void;
  updateProjects: (projects: ProjectContent[]) => void;
  updateContactLinks: (links: ContactLink[]) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

const cloneContent = (content: SiteContent): SiteContent =>
  JSON.parse(JSON.stringify(content)) as SiteContent;

const getInitialContent = (): SiteContent => cloneContent(defaultContent);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<SiteContent>(getInitialContent);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<SiteContent>;
        const defaults = cloneContent(defaultContent);
        setContent({
          hero: parsed.hero ?? defaults.hero,
          about: {
            sections: parsed.about?.sections ?? defaults.about.sections,
            gallery: parsed.about?.gallery ?? defaults.about.gallery
          },
          experiences: parsed.experiences ?? defaults.experiences,
          projects: parsed.projects ?? defaults.projects,
          contactLinks: parsed.contactLinks ?? defaults.contactLinks
        });
      }
    } catch (error) {
      console.warn("Failed to load content from localStorage, falling back to defaults", error);
      setContent(getInitialContent());
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content, isHydrated]);

  const updateHero = useCallback((hero: HeroContent) => {
    setContent(prev => ({ ...prev, hero }));
  }, []);

  const updateAbout = useCallback((about: AboutContent) => {
    setContent(prev => ({ ...prev, about }));
  }, []);

  const updateExperiences = useCallback((experiences: ExperienceContent[]) => {
    setContent(prev => ({ ...prev, experiences }));
  }, []);

  const updateProjects = useCallback((projects: ProjectContent[]) => {
    setContent(prev => ({ ...prev, projects }));
  }, []);

  const updateContactLinks = useCallback((links: ContactLink[]) => {
    setContent(prev => ({ ...prev, contactLinks: links }));
  }, []);

  const resetContent = useCallback(() => {
    const defaults = getInitialContent();
    setContent(defaults);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    }
  }, []);

  const value: ContentContextValue = {
    content,
    updateHero,
    updateAbout,
    updateExperiences,
    updateProjects,
    updateContactLinks,
    resetContent
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }

  return context;
};
