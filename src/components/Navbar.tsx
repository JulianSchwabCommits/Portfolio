
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const navItems = [
    { name: "Work", path: "/" },
    { name: "About", path: "/about" },
    { name: "Play", path: "/play" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4"
    >
      <div className="glass-morphism flex items-center justify-center gap-4 px-8 py-3 rounded-full">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="relative px-4 py-2"
          >
            <span className="relative z-10 font-medium">
              {item.name}
            </span>
            {location.pathname === item.path && (
              <motion.div
                layoutId="navbar-indicator"
                className="absolute inset-0 rounded-full bg-white/10"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navbar;
