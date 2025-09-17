import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { use_theme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import ChatbotPopup from './ChatbotPopup';

interface SearchItem {
  id: number;
  title: string;
  type: 'theme' | 'route' | 'project' | 'experience';
  company?: string;
  period?: string;
  description?: string;
  skills?: string[];
}

const use_device_info = () => {
  const [is_mobile, set_is_mobile] = useState(false);
  const [is_mac, set_is_mac] = useState(false);

  useEffect(() => {
    // Check if mobile
    const check_mobile = () => {
      const mobile_regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return mobile_regex.test(navigator.userAgent);
    };

    // Check if Mac
    const check_mac = () => {
      return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    };

    set_is_mobile(check_mobile());
    set_is_mac(check_mac());
  }, []);

  return { is_mobile, is_mac };
};
const SearchButton = ({ onClick, isDisabled = false }: { onClick: () => void; isDisabled?: boolean }) => {
  const [is_hovering, set_is_hovering] = useState(false);
  const { theme } = use_theme();
  const { is_mobile, is_mac } = use_device_info();

  const get_button_text = () => {
    if (is_mobile) return "Search";
    return is_mac ? "⌘K" : "Ctrl+K";
  };

  const get_tooltip_text = () => {
    if (is_mobile) return "Tap to search";
    return is_mac ? "Press ⌘K to search" : "Press Ctrl+K to search";
  };

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-40"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        onClick={onClick}
        onMouseEnter={() => set_is_hovering(true)}
        onMouseLeave={() => set_is_hovering(false)}
        className="relative"
      >
        <button
          disabled={isDisabled}
          className={`p-4 glass-morphism rounded-full transition-all duration-200 transform-gpu ${isDisabled
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer'
            } ${theme === 'light'
              ? 'text-gray-800 hover:bg-gray-100 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30'
              : 'text-white hover:bg-white/10 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-white/10'
            }`}>
          <span className="text-sm">{get_button_text()}</span>
        </button>

        {is_hovering && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute bottom-full mb-2 right-0 whitespace-nowrap px-3 py-1.5 text-sm rounded-md ${theme === 'light'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-800'
              }`}
          >
            {get_tooltip_text()}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const SearchPopup = ({ isAlertOpen = false }: { isAlertOpen?: boolean }) => {
  const [is_open, set_is_open] = useState(false);
  const [search, set_search] = useState('');
  const [selected_index, set_selected_index] = useState(0);
  const [hovered_index, set_hovered_index] = useState(-1);
  const [projects, set_projects] = useState<SearchItem[]>([]);
  const [experiences, set_experiences] = useState<SearchItem[]>([]);
  const [show_chatbot, set_show_chatbot] = useState(false);
  const [chatbot_query, set_chatbot_query] = useState('');
  const input_ref = useRef<HTMLInputElement>(null);
  const { set_theme, theme } = use_theme();
  const navigate = useNavigate();
  const { content } = useContent();

  useEffect(() => {
    if (!is_open) {
      return;
    }

    const mappedProjects = content.projects.map(project => ({
      id: project.id,
      title: project.title,
      type: 'project' as const,
      description: project.description,
      skills: project.tags
    }));

    const mappedExperiences = content.experiences.map(experience => ({
      id: experience.id,
      title: experience.title,
      type: 'experience' as const,
      company: experience.company,
      period: experience.period,
      description: experience.description,
      skills: experience.skills
    }));

    set_projects(mappedProjects);
    set_experiences(mappedExperiences);
  }, [is_open, content.projects, content.experiences]);

  const static_results: SearchItem[] = [
    { id: 2, title: 'Work', type: 'route' },
    { id: 3, title: 'About', type: 'route' },
    { id: 4, title: 'Play', type: 'route' },
    { id: 5, title: 'Contact', type: 'route' }
  ];

  const get_filtered_results = () => {
    const search_lower = search.toLowerCase().trim();

    // Show theme options when searching for theme-related terms
    if (search_lower === 'light' || search_lower === 'light mode') {
      return [{ id: 999, title: 'Light Mode', type: 'theme' as const, description: 'Switch to light theme' }];
    }

    if (search_lower === 'dark' || search_lower === 'dark mode') {
      return [{ id: 998, title: 'Dark Mode', type: 'theme' as const, description: 'Switch to dark theme' }];
    }

    // Show both theme options when searching for general theme terms
    if (search_lower === 'theme' || search_lower === 'mode') {
      return [
        { id: 999, title: 'Light Mode', type: 'theme' as const, description: 'Switch to light theme' },
        { id: 998, title: 'Dark Mode', type: 'theme' as const, description: 'Switch to dark theme' }
      ];
    }

    if (!search) {
      return static_results;
    }

    const matches_search = (item: SearchItem) => {
      // Check title
      if (item.title.toLowerCase().includes(search_lower)) return true;

      // Check description
      if (item.description && item.description.toLowerCase().includes(search_lower)) return true;

      // Check skills/tags
      if (item.skills && item.skills.some(skill => skill.toLowerCase().includes(search_lower))) return true;

      // Check company for experiences
      if (item.company && item.company.toLowerCase().includes(search_lower)) return true;

      return false;
    };

    return [
      ...static_results.filter(matches_search),
      ...projects.filter(matches_search),
      ...experiences.filter(matches_search)
    ];
  };

  const filtered_results = get_filtered_results();

  useEffect(() => {
    const handle_keydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Don't open search popup if alert is open
        if (isAlertOpen) return;
        set_is_open(true);
        set_search('');
        set_selected_index(0);
        // Focus input after opening
        setTimeout(() => {
          input_ref.current?.focus();
        }, 100);
      }
      if (e.key === 'Escape') {
        set_is_open(false);
        set_search('');
      }
    };

    window.addEventListener('keydown', handle_keydown);
    return () => window.removeEventListener('keydown', handle_keydown);
  }, [isAlertOpen]);

  // Auto-focus input when popup opens
  useEffect(() => {
    if (is_open && input_ref.current) {
      input_ref.current.focus();
    }
  }, [is_open]);

  const handle_keydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      set_selected_index(prev => Math.min(prev + 1, filtered_results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      set_selected_index(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered_results.length > 0) {
        // If we have results, select the highlighted one
        const selected_item = filtered_results[selected_index];
        handle_selection(selected_item);
      } else if (search.trim()) {
        // If we have a search term but no results, open chatbot
        set_chatbot_query(search);
        set_show_chatbot(true);
        set_is_open(false);
      }
    }
  };

  const handle_selection = (item: SearchItem) => {
    console.log('SearchPopup - handling selection:', item);
    if (item.type === 'theme') {
      set_theme(item.title.toLowerCase() === 'dark mode' ? 'dark' : 'light');
    } else if (item.type === 'route') {
      navigate(item.title.toLowerCase() === 'work' ? '/' : `/${item.title.toLowerCase()}`);
    } else if (item.type === 'project' || item.type === 'experience') {
      navigate(`/${item.type}s/${item.id}`);
    }
    set_is_open(false);
    set_search('');
    console.log('SearchPopup - selection complete, popup closed');
  };

  return (
    <>
      <SearchButton onClick={() => set_is_open(true)} isDisabled={isAlertOpen} />
      <AnimatePresence>
        {is_open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => {
              console.log('SearchPopup overlay clicked - closing');
              set_is_open(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-lg p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`rounded-2xl p-4 transform-gpu transition-all duration-200 backdrop-blur-xl ${theme === 'light'
                  ? 'bg-white/20 border border-white/30'
                  : 'glass-morphism'
                }`} style={{
                  height: '480px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: theme === 'light'
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)'
                    : '0 25px 50px -12px rgba(255, 255, 255, 0.1)'
                }}>
                <input
                  ref={input_ref}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    set_search(e.target.value);
                    set_selected_index(0);
                  }}
                  onKeyDown={handle_keydown}
                  placeholder="Search for pages, themes, projects, or experiences..."
                  className={`w-full bg-transparent outline-none text-lg py-2 border-b transition-all duration-200 ${theme === 'light'
                      ? 'text-gray-900 placeholder-gray-400 border-gray-200 focus:border-gray-400'
                      : 'text-white placeholder-gray-400 border-white/20 focus:border-white/40'
                    }`}
                />

                {filtered_results.length > 0 ? (
                  <div
                    className="mt-2 flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar"
                    style={{ height: '320px' }}
                  >
                    {filtered_results.map((result, index) => {
                      const should_show_condensed = filtered_results.length > 2;
                      const show_description = !should_show_condensed || hovered_index === index || selected_index === index;
                      const is_active = index === selected_index;

                      return (
                        <div
                          key={`${result.type}-${result.id}`}
                          className={`relative p-3 rounded-2xl cursor-pointer transition-all duration-200 ${theme === 'light'
                              ? 'border border-transparent hover:bg-gray-100/80'
                              : 'border border-transparent hover:bg-white/5'
                            }`}
                          onClick={() => handle_selection(result)}
                          onMouseEnter={() => set_hovered_index(index)}
                          onMouseLeave={() => set_hovered_index(-1)}
                        >
                          {/* Animated selector indicator */}
                          {is_active && (
                            <motion.div
                              layoutId="search-result-indicator"
                              className={`absolute inset-0 rounded-2xl backdrop-blur-md ${theme === 'light'
                                  ? 'bg-white/40 border border-white/50 shadow-lg shadow-gray-900/10'
                                  : 'border border-white/20 bg-white/5 shadow-sm shadow-black/20'
                                }`}
                              initial={false}
                              transition={{
                                type: "spring",
                                bounce: 0.2,
                                duration: 0.6
                              }}
                            />
                          )}
                          <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'
                                }`}>{result.title}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${theme === 'light'
                                  ? 'text-gray-700 bg-gray-200/80'
                                  : 'text-gray-300 bg-gray-800/30'
                                }`}>
                                {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                              </span>
                            </div>
                          </div>

                          {/* Show description based on conditions */}
                          {result.description && show_description && (
                            <div className={`relative z-10 mt-2 text-sm leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                              }`}>
                              {should_show_condensed && result.description.length > 100
                                ? `${result.description.substring(0, 100)}...`
                                : result.description}
                            </div>
                          )}

                          {/* Show period for experiences */}
                          {result.period && show_description && (
                            <div className={`relative z-10 mt-1 text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                              {result.period}
                            </div>
                          )}

                          {/* Show hover/navigation hint for condensed view */}
                          {result.description && should_show_condensed && !show_description && (
                            <div className={`relative z-10 mt-2 text-xs italic ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                              Hover or use ↑↓ to see description
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : search.trim() ? (
                  <div className="mt-2 p-4 text-center flex-1 flex items-center justify-center flex-col" style={{ height: '320px' }}>
                    <div className="text-center">
                      <p className={`text-lg mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white/70'
                        }`}>No results found</p>
                      <p className={`text-sm mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-white/50'
                        }`}>Try searching for pages, projects, experiences, or themes</p>

                      <button
                        onClick={() => {
                          set_chatbot_query(search);
                          set_show_chatbot(true);
                          set_is_open(false);
                        }}
                        className={`px-6 py-2 rounded-2xl transition-all duration-300 ${theme === 'light'
                            ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30'
                            : 'bg-white/10 text-white hover:bg-white/20 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-white/10'
                          } mx-auto mt-2`}
                      >
                        Ask AI about "{search}"
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 p-4 text-center flex-1 flex items-center justify-center" style={{ height: '320px' }}>
                    <div className="text-center">
                      <p className={`text-lg mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white/70'
                        }`}>Start typing to search</p>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/50'
                        }`}>Find pages, projects, experiences, and themes</p>
                    </div>
                  </div>
                )}

                <div className={`mt-2 text-sm border-t pt-2 flex justify-between ${theme === 'light'
                    ? 'text-gray-700 border-gray-200'
                    : 'text-gray-400 border-white/10'
                  }`}>
                  <span>Press Enter to select, ↑↓ to navigate</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ChatbotPopup that appears when Ask AI button is clicked */}
      {show_chatbot && (
        <ChatbotPopup
          onClose={() => set_show_chatbot(false)}
          initialMessage={chatbot_query}
        />
      )}
    </>
  );
};

export default SearchPopup;