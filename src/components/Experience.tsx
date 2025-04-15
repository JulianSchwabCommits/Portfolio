import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

const Experience = () => {
  const [experiences, set_experiences] = useState<Experience[]>([]);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  useEffect(() => {
    const fetch_experiences = async () => {
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        set_experiences(data || []);
      } catch (err) {
        set_error(err instanceof Error ? err.message : 'Failed to fetch experiences');
      } finally {
        set_loading(false);
      }
    };

    fetch_experiences();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
      {experiences.map((exp, index) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="glass-morphism p-6 rounded-xl"
        >
          <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
          <p className="text-gray-400 mb-2">{exp.company}</p>
          <p className="text-sm text-gray-500 mb-4">{exp.period}</p>
          <p className="mb-4">{exp.description}</p>
          <div className="flex flex-wrap gap-2">
            {exp.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-white/10 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Experience; 