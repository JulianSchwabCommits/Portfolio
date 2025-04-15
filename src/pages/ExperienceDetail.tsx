import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';
import PageTransition from '../components/PageTransition';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">{error || 'Experience not found'}</div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24 pt-32 pb-20">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-serif mb-2">{experience.title}</h1>
              <p className="text-2xl text-gray-400">{experience.company}</p>
              <p className="text-xl text-gray-500">{experience.year}</p>
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
                  className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-lg"
                >
                  Company Website
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
                className="w-full h-auto rounded-lg"
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
            <p className="text-xl leading-relaxed">{experience.description}</p>
          </motion.div>

          {/* Skills */}
          {experience.skills && experience.skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex flex-wrap gap-3">
                {experience.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-white/10 rounded-full text-lg"
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