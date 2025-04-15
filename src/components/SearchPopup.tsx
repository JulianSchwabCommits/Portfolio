import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { use_theme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const SearchPopup = () => {
  const [is_open, set_is_open] = useState(false);
  const [search, set_search] = useState('');
  const [selected_index, set_selected_index] = useState(0);
  const { set_theme } = use_theme();
  const navigate = useNavigate();

  const results = [
    { id: 'dark', label: 'Dark Mode', type: 'theme' },
    { id: 'light', label: 'Light Mode', type: 'theme' },
    { id: '/', label: 'Work', type: 'route' },
    { id: '/about', label: 'About', type: 'route' },
    { id: '/play', label: 'Play', type: 'route' },
    { id: '/contact', label: 'Contact', type: 'route' }
  ].filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handle_keydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        set_is_open(true);
      }
      if (e.key === 'Escape') {
        set_is_open(false);
      }
    };

    window.addEventListener('keydown', handle_keydown);
    return () => window.removeEventListener('keydown', handle_keydown);
  }, []);

  const handle_keydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      set_selected_index(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      set_selected_index(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      const selected_item = results[selected_index];
      handle_selection(selected_item);
    }
  };

  const handle_selection = (item: typeof results[0]) => {
    if (item.type === 'theme') {
      set_theme(item.id as 'dark' | 'light');
    } else if (item.type === 'route') {
      navigate(item.id);
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
                placeholder="Search for pages or themes..."
                className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
                autoFocus
              />
              
              {results.length > 0 && (
                <div className="mt-2 space-y-1">
                  {results.map((result, index) => (
                    <div
                      key={result.id}
                      className={`p-2 rounded cursor-pointer transition-colors ${
                        index === selected_index 
                          ? 'bg-white/10' 
                          : 'hover:bg-white/5'
                      }`}
                      onClick={() => handle_selection(result)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{result.label}</span>
                        <span className="text-xs text-gray-400">
                          {result.type === 'theme' ? 'Theme' : 'Page'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-2 text-sm text-gray-400">
                Press Enter to select, ↑↓ to navigate
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-10 flex justify-center cursor-pointer" style={{ opacity: 1, transform: 'translateY(8.62266px)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white opacity-80 hover:opacity-100 transition-opacity">
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchPopup; 