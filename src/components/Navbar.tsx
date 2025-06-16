import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { use_theme } from "../context/ThemeContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = use_theme();
  
  const navItems = [
    { name: "Work", path: "/" },
    { name: "About", path: "/about" },
    { name: "Play", path: "/play" },
    { name: "Contact", path: "/contact" }
  ];  return (
    <motion.nav 
      key={`navbar-${theme}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center py-6 px-4"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="glass-morphism flex items-center justify-center gap-1 sm:gap-4 rounded-full px-[6px] py-[6px]" style={{ pointerEvents: 'auto' }}>        {navItems.map(item => (          <Link 
            key={`${item.name}-${theme}`}
            to={item.path} 
            className="relative px-2 sm:px-4 py-2 text-sm sm:text-base min-w-[60px] sm:min-w-[80px] text-center z-10"
            style={{ pointerEvents: 'auto' }}onClick={(e) => {
              console.log('Navigation click:', item.name);
              e.preventDefault();
              navigate(item.path);
            }}
          >
            {location.pathname === item.path && (              <motion.div 
                layoutId={`navbar-indicator-${theme}`}
                className={`absolute inset-0 rounded-full pointer-events-none ${theme === 'light' ? 'bg-black/10' : 'bg-white/10'}`}
                initial={false}
                transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.6
                }}
              />
            )}
            <span className="relative z-20 font-medium">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navbar;