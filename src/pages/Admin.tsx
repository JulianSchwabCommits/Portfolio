import { useEffect, useMemo, useState } from "react";
import PageTransition from "../components/PageTransition";
import { useContent } from "../context/ContentContext";
import type {
  AboutSection,
  ContactLink,
  ExperienceContent,
  GalleryImage,
  HeroContent,
  ProjectContent
} from "../types/content";

const commaListToArray = (value: string) =>
  value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

const arrayToCommaList = (values: string[]) => values.join(", ");

const Admin = () => {
  const {
    content,
    updateHero,
    updateAbout,
    updateExperiences,
    updateProjects,
    updateContactLinks,
    resetContent
  } = useContent();

  const [heroForm, setHeroForm] = useState<HeroContent>(content.hero);
  const [aboutSections, setAboutSections] = useState<AboutSection[]>(content.about.sections);
  const [aboutGallery, setAboutGallery] = useState<GalleryImage[]>(content.about.gallery);
  const [experienceList, setExperienceList] = useState<ExperienceContent[]>(content.experiences);
  const [projectList, setProjectList] = useState<ProjectContent[]>(content.projects);
  const [contactList, setContactList] = useState<ContactLink[]>(content.contactLinks);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setHeroForm({ ...content.hero });
  }, [content.hero]);

  useEffect(() => {
    setAboutSections(content.about.sections.map(section => ({ ...section })));
    setAboutGallery(content.about.gallery.map(image => ({ ...image })));
  }, [content.about]);

  useEffect(() => {
    setExperienceList(content.experiences.map(exp => ({ ...exp, skills: [...exp.skills] })));
  }, [content.experiences]);

  useEffect(() => {
    setProjectList(content.projects.map(project => ({ ...project, tags: [...project.tags] })));
  }, [content.projects]);

  useEffect(() => {
    setContactList(content.contactLinks.map(link => ({ ...link })));
  }, [content.contactLinks]);

  useEffect(() => {
    if (!statusMessage) return;
    const timer = setTimeout(() => setStatusMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  const setStatus = (message: string) => {
    setStatusMessage(message);
  };

  const handleHeroSave = () => {
    updateHero({ ...heroForm });
    setStatus("Hero content saved");
  };

  const handleAboutSave = () => {
    updateAbout({
      sections: aboutSections.map(section => ({ ...section })),
      gallery: aboutGallery.map(image => ({ ...image }))
    });
    setStatus("About content saved");
  };

  const handleExperienceSave = () => {
    updateExperiences(experienceList.map(exp => ({ ...exp, skills: [...exp.skills] })));
    setStatus("Experiences saved");
  };

  const handleProjectsSave = () => {
    updateProjects(projectList.map(project => ({ ...project, tags: [...project.tags] })));
    setStatus("Projects saved");
  };

  const handleContactsSave = () => {
    updateContactLinks(contactList.map(link => ({ ...link })));
    setStatus("Contact links saved");
  };

  const handleReset = () => {
    resetContent();
    setStatus("Content reset to defaults");
  };

  const addAboutSection = () => {
    setAboutSections(prev => [
      ...prev,
      {
        id: Date.now(),
        type: "description",
        text: ""
      }
    ]);
  };

  const removeAboutSection = (id: number) => {
    setAboutSections(prev => prev.filter(section => section.id !== id));
  };

  const addAboutImage = () => {
    setAboutGallery(prev => [
      ...prev,
      {
        id: Date.now(),
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        alt: "New gallery image"
      }
    ]);
  };

  const removeAboutImage = (id: number) => {
    setAboutGallery(prev => prev.filter(image => image.id !== id));
  };

  const addExperience = () => {
    setExperienceList(prev => [
      ...prev,
      {
        id: Date.now(),
        title: "New role",
        company: "Company",
        period: "2024",
        year: "2024",
        description: "Describe the work you did.",
        skills: [],
        link: "",
        linkName: "",
        companyUrl: "",
        imageUrl: ""
      }
    ]);
  };

  const removeExperience = (id: number) => {
    setExperienceList(prev => prev.filter(exp => exp.id !== id));
  };

  const addProject = () => {
    setProjectList(prev => [
      ...prev,
      {
        id: Date.now(),
        title: "New project",
        description: "Quick description",
        longDescription: "Longer description for the project detail page.",
        year: new Date().getFullYear().toString(),
        tags: [],
        demoUrl: "",
        githubUrl: "",
        imageUrl: ""
      }
    ]);
  };

  const removeProject = (id: number) => {
    setProjectList(prev => prev.filter(project => project.id !== id));
  };

  const addContactLink = () => {
    setContactList(prev => [
      ...prev,
      {
        id: Date.now(),
        type: "other",
        label: "New link",
        value: "",
        href: ""
      }
    ]);
  };

  const removeContactLink = (id: number) => {
    setContactList(prev => prev.filter(link => link.id !== id));
  };

  const heroPreview = useMemo(
    () => `${heroForm.intro} ${heroForm.highlight} — ${heroForm.description}`,
    [heroForm]
  );

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-20 space-y-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif">Content Admin</h1>
            <p className="text-base text-muted-foreground mt-2 max-w-2xl">
              Update portfolio content instantly. Changes are saved to your browser's local storage so you can iterate quickly and deploy when ready.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="self-start px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
          >
            Reset to defaults
          </button>
        </div>

        {statusMessage && (
          <div className="glass-morphism px-4 py-3 rounded-xl text-sm text-emerald-200">
            {statusMessage}
          </div>
        )}

        <section className="glass-morphism rounded-2xl p-6 space-y-6">
          <header>
            <h2 className="text-2xl font-serif">Hero</h2>
            <p className="text-sm text-muted-foreground">This content appears on the landing section of the homepage.</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Intro line</span>
              <input
                value={heroForm.intro}
                onChange={e => setHeroForm(prev => ({ ...prev, intro: e.target.value }))}
                className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Highlight</span>
              <input
                value={heroForm.highlight}
                onChange={e => setHeroForm(prev => ({ ...prev, highlight: e.target.value }))}
                className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
              />
            </label>
            <label className="flex flex-col gap-2 md:col-span-1">
              <span className="text-sm font-medium">Description</span>
              <input
                value={heroForm.description}
                onChange={e => setHeroForm(prev => ({ ...prev, description: e.target.value }))}
                className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground">Preview: {heroPreview}</p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleHeroSave}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              Save hero
            </button>
          </div>
        </section>

        <section className="glass-morphism rounded-2xl p-6 space-y-6">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif">About</h2>
              <p className="text-sm text-muted-foreground">Control the paragraphs and gallery on the About page.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addAboutSection}
                className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm"
              >
                Add paragraph
              </button>
              <button
                type="button"
                onClick={addAboutImage}
                className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm"
              >
                Add gallery image
              </button>
            </div>
          </header>

          <div className="space-y-4">
            {aboutSections.map(section => (
              <div key={section.id} className="rounded-xl border border-white/10 p-4 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <label className="text-sm font-medium">
                    Type
                    <select
                      value={section.type}
                      onChange={e =>
                        setAboutSections(prev =>
                          prev.map(item =>
                            item.id === section.id ? { ...item, type: e.target.value as AboutSection["type"] } : item
                          )
                        )
                      }
                      className="mt-1 w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    >
                      <option value="title">Title</option>
                      <option value="description">Paragraph</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeAboutSection(section.id)}
                    className="self-start px-3 py-2 rounded-full bg-red-500/10 text-red-200 hover:bg-red-500/20 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={section.text}
                  onChange={e =>
                    setAboutSections(prev =>
                      prev.map(item => (item.id === section.id ? { ...item, text: e.target.value } : item))
                    )
                  }
                  rows={section.type === "title" ? 2 : 4}
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                  placeholder={section.type === "title" ? "Title content" : "Paragraph content"}
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {aboutGallery.map(image => (
              <div key={image.id} className="rounded-xl border border-white/10 p-4 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <span className="text-sm font-medium">Gallery image</span>
                  <button
                    type="button"
                    onClick={() => removeAboutImage(image.id)}
                    className="self-start px-3 py-2 rounded-full bg-red-500/10 text-red-200 hover:bg-red-500/20 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <input
                  value={image.src}
                  onChange={e =>
                    setAboutGallery(prev =>
                      prev.map(item => (item.id === image.id ? { ...item, src: e.target.value } : item))
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                  placeholder="Image URL"
                />
                <input
                  value={image.alt}
                  onChange={e =>
                    setAboutGallery(prev =>
                      prev.map(item => (item.id === image.id ? { ...item, alt: e.target.value } : item))
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                  placeholder="Alt text"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAboutSave}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              Save about content
            </button>
          </div>
        </section>

        <section className="glass-morphism rounded-2xl p-6 space-y-6">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif">Experiences</h2>
              <p className="text-sm text-muted-foreground">These power the cards on the Work page and experience detail views.</p>
            </div>
            <button
              type="button"
              onClick={addExperience}
              className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm"
            >
              Add experience
            </button>
          </header>

          <div className="space-y-4">
            {experienceList.map(exp => (
              <div key={exp.id} className="rounded-xl border border-white/10 p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    value={exp.title}
                    onChange={e =>
                      setExperienceList(prev =>
                        prev.map(item => (item.id === exp.id ? { ...item, title: e.target.value } : item))
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    placeholder="Role"
                  />
                  <input
                    value={exp.company}
                    onChange={e =>
                      setExperienceList(prev =>
                        prev.map(item => (item.id === exp.id ? { ...item, company: e.target.value } : item))
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    placeholder="Company"
                  />
                  <input
                    value={exp.period}
                    onChange={e =>
                      setExperienceList(prev =>
                        prev.map(item => (item.id === exp.id ? { ...item, period: e.target.value } : item))
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    placeholder="Period"
                  />
                  <input
                    value={exp.year}
                    onChange={e =>
                      setExperienceList(prev =>
                        prev.map(item => (item.id === exp.id ? { ...item, year: e.target.value } : item))
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    placeholder="Year"
                  />
                </div>
                <textarea
                  value={exp.description}
                  onChange={e =>
                    setExperienceList(prev =>
                      prev.map(item => (item.id === exp.id ? { ...item, description: e.target.value } : item))
                    )
                  }
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                  placeholder="Description"
                />
                <input
                  value={arrayToCommaList(exp.skills)}
                  onChange={e =>
                    setExperienceList(prev =>
                      prev.map(item =>
                        item.id === exp.id ? { ...item, skills: commaListToArray(e.target.value) } : item
                      )
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                  placeholder="Skills (comma separated)"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={exp.link ?? ""}
                    onChange={e =>
                      setExperienceList(prev =>
                        prev.map(item => (item.id === exp.id ? { ...item, link: e.target.value } : item))
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    placeholder="Primary link"
                  />
                  <input
                    value={exp.linkName ?? ""}
                    onChange={e =>
                      setExperienceList(prev =>
                        prev.map(item => (item.id === exp.id ? { ...item, linkName: e.target.value } : item))
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    placeholder="Link label"
                  />
                  <input
                    value={exp.companyUrl ?? ""}
                    onChange={e =>
                      setExperienceList(prev =>
                        prev.map(item => (item.id === exp.id ? { ...item, companyUrl: e.target.value } : item))
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    placeholder="Company URL"
                  />
                </div>
                <input
                  value={exp.imageUrl ?? ""}
                  onChange={e =>
                    setExperienceList(prev =>
                      prev.map(item => (item.id === exp.id ? { ...item, imageUrl: e.target.value } : item))
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                  placeholder="Detail image URL"
                />
                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="px-3 py-2 rounded-full bg-red-500/10 text-red-200 hover:bg-red-500/20 text-sm"
                >
                  Remove experience
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleExperienceSave}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              Save experiences
            </button>
          </div>
        </section>

        <section className="glass-morphism rounded-2xl p-6 space-y-6">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif">Projects</h2>
              <p className="text-sm text-muted-foreground">Showcased on the Play page and project detail routes.</p>
            </div>
            <button
              type="button"
              onClick={addProject}
              className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm"
            >
              Add project
            </button>
          </header>

          <div className="space-y-4">
            {projectList.map(project => (
              <div key={project.id} className="rounded-xl border border-white/10 p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    value={project.title}
                    onChange={e =>
                      setProjectList(prev =>
                        prev.map(item => (item.id === project.id ? { ...item, title: e.target.value } : item))
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    placeholder="Title"
                  />
                  <input
                    value={project.year}
                    onChange={e =>
                      setProjectList(prev =>
                        prev.map(item => (item.id === project.id ? { ...item, year: e.target.value } : item))
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    placeholder="Year"
                  />
                </div>
                <textarea
                  value={project.description}
                  onChange={e =>
                    setProjectList(prev =>
                      prev.map(item => (item.id === project.id ? { ...item, description: e.target.value } : item))
                    )
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                  placeholder="Short description"
                />
                <textarea
                  value={project.longDescription ?? ""}
                  onChange={e =>
                    setProjectList(prev =>
                      prev.map(item =>
                        item.id === project.id ? { ...item, longDescription: e.target.value } : item
                      )
                    )
                  }
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                  placeholder="Long description for detail page"
                />
                <input
                  value={arrayToCommaList(project.tags)}
                  onChange={e =>
                    setProjectList(prev =>
                      prev.map(item =>
                        item.id === project.id ? { ...item, tags: commaListToArray(e.target.value) } : item
                      )
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                  placeholder="Tags (comma separated)"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={project.demoUrl ?? ""}
                    onChange={e =>
                      setProjectList(prev =>
                        prev.map(item => (item.id === project.id ? { ...item, demoUrl: e.target.value } : item))
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    placeholder="Demo URL"
                  />
                  <input
                    value={project.githubUrl ?? ""}
                    onChange={e =>
                      setProjectList(prev =>
                        prev.map(item => (item.id === project.id ? { ...item, githubUrl: e.target.value } : item))
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    placeholder="GitHub URL"
                  />
                  <input
                    value={project.imageUrl ?? ""}
                    onChange={e =>
                      setProjectList(prev =>
                        prev.map(item => (item.id === project.id ? { ...item, imageUrl: e.target.value } : item))
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    placeholder="Image URL"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeProject(project.id)}
                  className="px-3 py-2 rounded-full bg-red-500/10 text-red-200 hover:bg-red-500/20 text-sm"
                >
                  Remove project
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleProjectsSave}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              Save projects
            </button>
          </div>
        </section>

        <section className="glass-morphism rounded-2xl p-6 space-y-6">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif">Contact links</h2>
              <p className="text-sm text-muted-foreground">Displayed on the contact page with icons based on the link type.</p>
            </div>
            <button
              type="button"
              onClick={addContactLink}
              className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm"
            >
              Add contact link
            </button>
          </header>

          <div className="space-y-4">
            {contactList.map(link => (
              <div key={link.id} className="rounded-xl border border-white/10 p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="text-sm font-medium">
                    Type
                    <select
                      value={link.type}
                      onChange={e =>
                        setContactList(prev =>
                          prev.map(item =>
                            item.id === link.id ? { ...item, type: e.target.value as ContactLink["type"] } : item
                          )
                        )
                      }
                      className="mt-1 w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    >
                      <option value="email">Email</option>
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="phone">Phone</option>
                      <option value="website">Website</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                  <input
                    value={link.label}
                    onChange={e =>
                      setContactList(prev =>
                        prev.map(item => (item.id === link.id ? { ...item, label: e.target.value } : item))
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                    placeholder="Label"
                  />
                </div>
                <input
                  value={link.value}
                  onChange={e =>
                    setContactList(prev =>
                      prev.map(item => (item.id === link.id ? { ...item, value: e.target.value } : item))
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                  placeholder="Displayed value"
                />
                <input
                  value={link.href}
                  onChange={e =>
                    setContactList(prev =>
                      prev.map(item => (item.id === link.id ? { ...item, href: e.target.value } : item))
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10"
                  placeholder="Link URL"
                />
                <button
                  type="button"
                  onClick={() => removeContactLink(link.id)}
                  className="px-3 py-2 rounded-full bg-red-500/10 text-red-200 hover:bg-red-500/20 text-sm"
                >
                  Remove link
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleContactsSave}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              Save contact links
            </button>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Admin;
