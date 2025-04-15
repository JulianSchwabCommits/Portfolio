import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { use_theme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

interface SearchItem {
  id: number;
  title: string;
  type: 'theme' | 'route' | 'project' | 'experience';
  company?: string;
  period?: string;
  description?: string;
  skills?: string[];
}

const SearchPopup = () => {
  const [is_open, set_is_open] = useState(false);
  const [search, set_search] = useState('');
  const [selected_index, set_selected_index] = useState(0);
  const [projects, set_projects] = useState<SearchItem[]>([]);
  const [experiences, set_experiences] = useState<SearchItem[]>([]);
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
    { id: 0, title: 'Dark Mode', type: 'theme' },
    { id: 1, title: 'Light Mode', type: 'theme' },
    { id: 2, title: 'Work', type: 'route' },
    { id: 3, title: 'About', type: 'route' },
    { id: 4, title: 'Play', type: 'route' },
    { id: 5, title: 'Contact', type: 'route' }
  ];

  const all_results = [
    ...static_results,
    ...(search ? projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase())) : []),
    ...(search ? experiences.filter(e => e.title.toLowerCase().includes(search.toLowerCase())) : [])
  ].filter(item => {
    if (!search) {
      return item.type === 'theme' || item.type === 'route';
    }
    if (search.toLowerCase() === 'route') {
      return item.type === 'route';
    } else if (search.toLowerCase() === 'theme') {
      return item.type === 'theme';
    } else if (search.toLowerCase() === 'project') {
      return item.type === 'project';
    } else if (search.toLowerCase() === 'experience') {
      return item.type === 'experience';
    }
    return item.title.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    const handle_keydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        set_is_open(true);
        set_search('');
      }
      if (e.key === 'Escape') {
        set_is_open(false);
        set_search('');
      }
    };

    window.addEventListener('keydown', handle_keydown);
    return () => window.removeEventListener('keydown', handle_keydown);
  }, []);

  const handle_keydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      set_selected_index(prev => Math.min(prev + 1, all_results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      set_selected_index(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && all_results.length > 0) {
      e.preventDefault();
      const selected_item = all_results[selected_index];
      handle_selection(selected_item);
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
    <AnimatePresence>
      {is_open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => set_is_open(false)}
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
              
              {all_results.length > 0 && (
                <div className="mt-2 space-y-1">
                  {all_results.map((result, index) => (
                    <div
                      key={result.id}
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
              )}
              
              <div className="mt-2 text-sm text-[#9ca3af]">
                Press Enter to select, ↑↓ to navigate
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchPopup; 