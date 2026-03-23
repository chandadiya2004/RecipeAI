import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Home, Salad, ChefHat, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
  { path: '/pantry', label: 'Pantry Chef', icon: <Salad className="w-4 h-4" /> },
  { path: '/generator', label: 'Dish Generator', icon: <ChefHat className="w-4 h-4" /> },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const setCapability = () => setSupportsHover(media.matches);

    setCapability();
    media.addEventListener('change', setCapability);

    return () => media.removeEventListener('change', setCapability);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setHoveredPath(null);
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (_path: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  };

  return (
    <>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.button
            type="button"
            aria-label="Close mobile menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] md:hidden"
          />
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ 
          y: scrolled ? 16 : 0, 
          opacity: 1
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto transition-all duration-300 flex items-center justify-between mx-auto relative ${
          scrolled 
            ? 'glass shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-background/85 backdrop-blur-2xl border border-border/50 rounded-2xl px-4 sm:px-6 py-3 mt-0 w-[min(95%,1100px)]' 
            : 'bg-transparent pt-6 px-4 sm:px-10 pb-4 border-b border-transparent w-full max-w-[1536px]'
        }`}
      >
        
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0"
          >
            <img src="/favicon.svg" alt="RecipeAI Logo" className="w-full h-full object-contain drop-shadow-md" />
          </motion.div>
          <span className="text-lg sm:text-xl font-black tracking-tight text-foreground">
            Recipe<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <div
          className="hidden md:flex items-center gap-1 bg-muted/40 p-1.5 rounded-full border border-border/30 backdrop-blur-md"
          onMouseLeave={() => setHoveredPath(null)}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onMouseEnter={() => supportsHover && setHoveredPath(item.path)}
              onFocus={() => setHoveredPath(item.path)}
              onBlur={() => setHoveredPath(null)}
              onClick={() => handleNavClick(item.path)}
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

        {/* Right Side: Action Button (Desktop) & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          {/* Sign In Button (Hidden on Mobile) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full gradient-bg text-white text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 glow-primary shrink-0 group overflow-hidden relative"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out z-10" />
            
            <User className="w-4 h-4 relative z-20" />
            <span className="relative z-20">Sign In</span>
          </motion.button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-muted/50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-3 p-4 glass rounded-3xl border border-border/50 shadow-2xl flex flex-col gap-2 mx-0 bg-background/95 backdrop-blur-3xl md:hidden origin-top"
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavClick(item.path);
                  }}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all duration-300 ${
                    isActive(item.path) 
                      ? 'bg-primary/10 text-primary scale-[1.02]' 
                      : 'hover:bg-muted/50 text-foreground/80 hover:text-foreground'
                  }`}
                >
                  <span className={`${isActive(item.path) ? 'scale-110' : 'scale-100'} transition-transform`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
              
              <div className="h-px w-full bg-border/50 my-2" />
              
              <button 
                type="button"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl gradient-bg text-white text-base font-bold shadow-lg shadow-primary/20 glow-primary active:scale-[0.98] transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                Sign In
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
      </motion.nav>
      </div>
    </>
  );
};

export default Navbar;
