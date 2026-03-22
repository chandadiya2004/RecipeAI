import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
        scrolled ? 'glass shadow-md bg-background/50 backdrop-blur-2xl border-border/50' : 'bg-transparent pt-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-all duration-300 group-hover:scale-105">
              <img src="/favicon.svg" alt="RecipeAI Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <span className="text-xl font-black tracking-tight text-foreground">
              Recipe<span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link 
              to="/" 
              className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-full hover:bg-muted/50 ${isActive('/') ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
            >
              Home
              {isActive('/') && (
                <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-4 right-4 h-[3px] rounded-t-full gradient-bg mix-blend-darken dark:mix-blend-lighten" />
              )}
            </Link>
            <Link 
              to="/pantry" 
              className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-full hover:bg-muted/50 ${isActive('/pantry') ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
            >
              Pantry Chef
              {isActive('/pantry') && (
                <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-4 right-4 h-[3px] rounded-t-full gradient-bg mix-blend-darken dark:mix-blend-lighten" />
              )}
            </Link>
            <Link 
              to="/generator" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-full hover:bg-muted/50 ${isActive('/generator') ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
            >
              Dish Generator
              {isActive('/generator') && (
                <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-4 right-4 h-[3px] rounded-t-full gradient-bg mix-blend-darken dark:mix-blend-lighten" />
              )}
            </Link>
          </div>
        </div>

        {/* Right Side: Profile / Action */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full gradient-bg text-white text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 glow-primary"
        >
          <User className="w-4 h-4" />
          Sign In
        </motion.button>

      </div>
    </motion.nav>
  );
};

export default Navbar;
