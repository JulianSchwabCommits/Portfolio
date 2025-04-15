import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';

interface AboutData {
  id: number;
  text: string;
}

const About = () => {
  const [about_data, set_about_data] = useState<AboutData | null>(null);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  useEffect(() => {
    const fetch_about = async () => {
      try {
        const { data, error } = await supabase
          .from('about')
          .select('*')
          .single();

        if (error) throw error;
        set_about_data(data);
      } catch (err) {
        set_error(err instanceof Error ? err.message : 'Failed to fetch about data');
      } finally {
        set_loading(false);
      }
    };

    fetch_about();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!about_data) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-morphism p-8 rounded-xl"
    >
      <p className="text-lg leading-relaxed whitespace-pre-line">{about_data.text}</p>
    </motion.div>
  );
};

export default About; 