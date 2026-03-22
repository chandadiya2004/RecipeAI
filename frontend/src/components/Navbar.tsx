import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Home, Salad, ChefHat } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
  { path: '/pantry', label: 'Pantry Chef', icon: <Salad className="w-4 h-4" /> },
  { path: '/generator', label: 'Dish Generator', icon: <ChefHat className="w-4 h-4" /> },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ 
          y: scrolled ? 16 : 0, 
          opacity: 1,
          width: scrolled ? '85%' : '100%',
          maxWidth: scrolled ? '1000px' : '1536px'
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto transition-all duration-300 flex items-center justify-between mx-auto ${
          scrolled 
            ? 'glass shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-background/80 backdrop-blur-2xl border border-border/50 rounded-full px-6 py-3 mt-0 rounded-b-2xl sm:rounded-full' 
            : 'bg-transparent pt-6 px-6 sm:px-10 pb-4 border-b border-transparent'
        }`}
      >
        
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative w-10 h-10 flex-shrink-0"
          >
            <img src="/favicon.svg" alt="RecipeAI Logo" className="w-full h-full object-contain drop-shadow-md" />
          </motion.div>
          <span className="text-xl font-black tracking-tight text-foreground hidden sm:block">
            Recipe<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-muted/40 p-1.5 rounded-full border border-border/30 backdrop-blur-md">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHoveredPath(item.path)}
              onMouseLeave={() => setHoveredPath(null)}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-colors duration-300 rounded-full z-10 ${
                isActive(item.path) || hoveredPath === item.path
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              <span className={`transition-transform duration-300 ${isActive(item.path) || hoveredPath === item.path ? 'scale-110' : 'scale-100'}`}>
                {item.icon}
              </span>
              {item.label}

              {/* Active Background Pill */}
              {isActive(item.path) && (
                <motion.div
                  layoutId="navbar-active"
                  className="absolute inset-0 bg-background shadow-sm rounded-full -z-10 border border-border/40"
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}

              {/* Hover Background Hover Pill */}
              {hoveredPath === item.path && !isActive(item.path) && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-primary/5 rounded-full -z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side: Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full gradient-bg text-white text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 glow-primary shrink-0 group overflow-hidden relative"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out z-10" />
          
          <User className="w-4 h-4 relative z-20" />
          <span className="relative z-20">Sign In</span>
        </motion.button>
        
      </motion.nav>
    </div>
  );
};

export default Navbar;
