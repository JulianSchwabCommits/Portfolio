import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { use_theme } from "../context/ThemeContext";

const Navbar = () => {
  const location = useLocation();
  const { theme } = use_theme();
  
  const navItems = [
    { name: "Work", path: "/" },
    { name: "About", path: "/about" },
    { name: "Play", path: "/play" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4"
    >
      <div className="glass-morphism flex items-center justify-center gap-1 sm:gap-4 rounded-full px-[6px] py-[6px]">
        {navItems.map(item => (
          <Link 
            key={item.name} 
            to={item.path} 
            className="relative px-2 sm:px-4 py-2 text-sm sm:text-base"
          >
            <span className="relative z-10 font-medium">
              {item.name}
            </span>
            {location.pathname === item.path && (
              <motion.div 
                layoutId="navbar-indicator" 
                className={`absolute inset-0 rounded-full ${theme === 'light' ? 'bg-black/10' : 'bg-white/10'}`}
                initial={false}
                transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.6
                }}
              />
            )}
          </Link>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navbar;