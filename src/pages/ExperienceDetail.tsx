import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';
import PageTransition from '../components/PageTransition';
import { use_theme } from '../context/ThemeContext';

interface Experience {
  id: number;
  title: string;
  company: string;
  description: string;
  skills: string[];
  year: string;
  company_url?: string;
  image_url?: string;
}

const ExperienceDetail = () => {
  const { id } = useParams();
  const [experience, set_experience] = useState<Experience | null>(null);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);
  const { theme } = use_theme();

  useEffect(() => {
    const fetch_experience = async () => {
      if (!id) {
        set_error('No experience ID provided');
        set_loading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .eq('id', parseInt(id))
          .single();

        if (error) throw error;
        if (!data) {
          set_error('Experience not found');
          set_experience(null);
        } else {
          set_experience(data);
        }
      } catch (err) {
        set_error(err instanceof Error ? err.message : 'Failed to fetch experience');
        set_experience(null);
      } finally {
        set_loading(false);
      }
    };

    fetch_experience();
  }, [id]);
  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className={`glass-morphism rounded-2xl p-8 ${
            theme === 'light' 
              ? 'shadow-lg shadow-gray-900/20' 
              : 'shadow-lg shadow-black/20'
          }`}>
            <div className={`text-center text-xl ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>Loading experience...</div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !experience) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-24 flex items-center justify-center px-4">
          <div className={`glass-morphism rounded-2xl p-8 text-center max-w-md ${
            theme === 'light' 
              ? 'shadow-lg shadow-gray-900/20' 
              : 'shadow-lg shadow-black/20'
          }`}>
            <div className={`text-xl mb-4 ${
              theme === 'light' ? 'text-red-600' : 'text-red-400'
            }`}>
              {error || 'Experience not found'}
            </div>
            <p className={`mb-6 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Cannot connect to server. Please contact me directly.
            </p>
            <Link
              to="/contact"
              className={`inline-block px-6 py-3 rounded-2xl transition-all duration-200 ${
                theme === 'light'
                  ? 'bg-gray-800 text-white hover:bg-gray-700 shadow-lg shadow-gray-900/20'
                  : 'bg-white/10 text-white hover:bg-white/20 shadow-lg shadow-black/20'
              }`}
            >
              Contact Me
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24 pt-24 pb-20">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className={`text-5xl md:text-6xl font-serif mb-2 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>{experience.title}</h1>
              <p className={`text-2xl ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>{experience.company}</p>
              <p className={`text-xl ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>{experience.year}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-4 mt-4 md:mt-0"
            >
              {experience.company_url && (
                <a
                  href={experience.company_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`glass-morphism px-6 py-3 rounded-full transition-all duration-200 text-lg font-medium ${
                    theme === 'light'
                      ? 'text-gray-800 hover:bg-black/10'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Company Website →
                </a>
              )}
            </motion.div>
          </div>

          {/* Image */}
          {experience.image_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <img 
                src={experience.image_url} 
                alt={experience.company}
                className="w-full h-auto rounded-2xl"
              />
            </motion.div>
          )}

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <p className={`text-xl leading-relaxed ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-200'
            }`}>{experience.description}</p>
          </motion.div>

          {/* Skills */}
          {experience.skills && experience.skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className={`text-2xl font-serif mb-6 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>Skills & Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {experience.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-4 py-2 rounded-full text-lg transition-colors duration-200 ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-white/10 text-gray-200 hover:bg-white/20'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ExperienceDetail; 