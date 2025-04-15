import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { use_theme } from '../context/ThemeContext';

const CursorShadow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { theme } = use_theme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className={`fixed pointer-events-none z-50 w-64 h-64 rounded-full blur-3xl ${
        theme === 'light' ? 'bg-black/5' : 'bg-white/5'
      }`}
      animate={{
        x: position.x - 128,
        y: position.y - 128,
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 200,
        mass: 0.5
      }}
    />
  );
};

export default CursorShadow; 