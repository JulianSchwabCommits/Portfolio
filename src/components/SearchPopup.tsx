import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { use_theme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Send, Sun, Moon } from 'lucide-react';
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

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
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
const ThemeToggle = () => {
  const { theme, toggle_theme } = use_theme();
  
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        toggle_theme();
      }}
      className="absolute bottom-2 right-3 p-2 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer"
    >
      {theme === 'light' ? 
        <Moon className="w-5 h-5 text-white" /> : 
        <Sun className="w-5 h-5" />
      }
    </div>
  );
};

const SearchButton = ({ onClick }: { onClick: () => void }) => {
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
        <button className={`p-4 glass-morphism rounded-full cursor-pointer hover:bg-white/10 transition-all duration-200 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          <span className="text-sm">{get_button_text()}</span>
        </button>
        
        {is_hovering && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute bottom-full mb-2 right-0 whitespace-nowrap px-3 py-1.5 text-sm rounded-md ${
              theme === 'light' 
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

const SearchPopup = () => {
  const [is_open, set_is_open] = useState(false);
  const [search, set_search] = useState('');
  const [selected_index, set_selected_index] = useState(0);
  const [projects, set_projects] = useState<SearchItem[]>([]);
  const [experiences, set_experiences] = useState<SearchItem[]>([]);
  const [show_chatbot, set_show_chatbot] = useState(false);
  const { set_theme } = use_theme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch_data = async () => {
      const { data: projects_data } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });
      
      const { data: experiences_data } = await supabase
        .from('experiences')
        .select('*')
        .order('id', { ascending: false });

      set_projects(projects_data?.map(p => ({
        id: p.id,
        title: p.title,
        type: 'project',
        description: p.description,
        skills: p.skills
      })) || []);

      set_experiences(experiences_data?.map(e => ({
        id: e.id,
        title: e.title,
        type: 'experience',
        company: e.company,
        period: e.period,
        description: e.description,
        skills: e.skills
      })) || []);
    };

    if (is_open) {
      fetch_data();
    }
  }, [is_open]);

  const static_results: SearchItem[] = [
    { id: 2, title: 'Work', type: 'route' },
    { id: 3, title: 'About', type: 'route' },
    { id: 4, title: 'Play', type: 'route' },
    { id: 5, title: 'Contact', type: 'route' }
  ];

  const get_filtered_results = () => {
    if (!search) {
      return static_results;
    }
    
    const search_lower = search.toLowerCase();
    return [
      ...static_results.filter(item => item.title.toLowerCase().includes(search_lower)),
      ...projects.filter(item => item.title.toLowerCase().includes(search_lower)),
      ...experiences.filter(item => item.title.toLowerCase().includes(search_lower))
    ];
  };

  const filtered_results = get_filtered_results();

  useEffect(() => {
    const handle_keydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        set_is_open(true);
        set_search('');
      }
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        set_show_chatbot(true);
      }
      if (e.key === 'Escape') {
        set_is_open(false);
        set_search('');
        set_show_chatbot(false);
      }
    };

    window.addEventListener('keydown', handle_keydown);
    return () => window.removeEventListener('keydown', handle_keydown);
  }, []);

  const handle_keydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      set_selected_index(prev => Math.min(prev + 1, filtered_results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      set_selected_index(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filtered_results.length > 0) {
      e.preventDefault();
      const selected_item = filtered_results[selected_index];
      handle_selection(selected_item);
    } else if (e.key === 'Enter' && filtered_results.length === 0 && search.trim()) {
      e.preventDefault();
      set_show_chatbot(true);
    }
  };

  const handle_selection = (item: SearchItem) => {
    if (item.type === 'theme') {
      set_theme(item.title.toLowerCase() === 'dark mode' ? 'dark' : 'light');
    } else if (item.type === 'route') {
      navigate(item.title.toLowerCase() === 'work' ? '/' : `/${item.title.toLowerCase()}`);
    } else if (item.type === 'project' || item.type === 'experience') {
      navigate(`/${item.type}s/${item.id}`);
    }
    set_is_open(false);
    set_search('');
  };

  return (
    <>
      <SearchButton onClick={() => set_is_open(true)} />
      <AnimatePresence>
        {is_open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => {
              set_is_open(false);
              set_show_chatbot(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-morphism rounded-xl p-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    set_search(e.target.value);
                    set_selected_index(0);
                  }}
                  onKeyDown={handle_keydown}
                  placeholder="Search for pages, themes, projects, or experiences..."
                  className="w-full bg-transparent text-white placeholder-[#9ca3af] outline-none"
                  autoFocus
                />
                
                {/* Theme Toggle */}
                <div className="mt-2 border-t border-white/10 pt-2">
                  <ThemeToggle />
                </div>
                
                {filtered_results.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {filtered_results.map((result, index) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        className={`p-2 rounded cursor-pointer transition-colors ${
                          index === selected_index 
                            ? 'border border-white/20' 
                            : 'border border-transparent'
                        }`}
                        onClick={() => handle_selection(result)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-white">{result.title}</span>
                          <span className="text-xs text-[#9ca3af]">
                            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                          </span>
                        </div>
                        {(result.description || result.skills) && (
                          <div className="mt-1 text-xs text-[#9ca3af]">
                            {result.description && <div>{result.description}</div>}
                            {result.skills && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.skills.map(skill => (
                                  <span key={skill} className="px-1 py-0.5 bg-gray-800/50 rounded">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : search.trim() ? (
                  <div className="mt-2 p-4 text-center">
                    <p className="text-white mb-2">No results found</p>
                    <button 
                      onClick={() => set_show_chatbot(true)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    >
                      Ask AI about "{search}"
                    </button>
                  </div>
                ) : null}
                
                <div className="mt-2 text-sm text-[#9ca3af]">
                  Press Enter to select, ↑↓ to navigate
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {show_chatbot && (
          <ChatbotPopup 
            initialMessage={search}
            onClose={() => {
              set_show_chatbot(false);
              set_is_open(false);
              set_search('');
            }} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchPopup; 