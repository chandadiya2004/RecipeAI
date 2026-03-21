import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Recipe<span className="gradient-text">AI</span>
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-2 rounded-full glass glass-hover text-sm font-medium text-foreground cursor-pointer transition-shadow duration-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Sign In
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
