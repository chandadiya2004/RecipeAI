import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { User, Home, Salad, ChefHat, History, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const baseNavItems = [
  { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
];

const featureNavItems = [
  { path: '/pantry', label: 'Pantry Chef', icon: <Salad className="w-4 h-4" /> },
  { path: '/generator', label: 'Dish Generator', icon: <ChefHat className="w-4 h-4" /> },
  { path: '/history', label: 'History', icon: <History className="w-4 h-4" /> },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
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
  const visibleNavItems = user ? [...baseNavItems, ...featureNavItems] : [];

  const handleNavClick = (_path: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
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
        initial={shouldReduceMotion ? false : { y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto transition-all duration-300 flex items-center justify-between mx-auto relative ${
          scrolled 
            ? 'glass shadow-[0_8px_24px_rgb(0,0,0,0.10)] bg-background/88 backdrop-blur-2xl border border-border/50 rounded-xl px-3.5 sm:px-5 py-2.5 mt-2 w-[min(95%,1080px)]' 
            : 'bg-transparent pt-4 px-4 sm:px-8 pb-3 border-b border-transparent w-full max-w-[1536px]'
        }`}
      >
        
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
          <motion.div 
            whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 24 }}
            className="relative w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0"
          >
            <img src="/favicon.svg" alt="RecipeAI Logo" className="w-full h-full object-contain drop-shadow-md" />
          </motion.div>
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-foreground">
            Recipe<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <div
          className="hidden md:flex items-center gap-1 bg-muted/35 p-1 rounded-full border border-border/35 backdrop-blur-md"
        >
          {visibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`relative flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold transition-colors duration-300 rounded-full z-10 ${
                isActive(item.path)
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              <span className={`transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'scale-100'}`}>
                {item.icon}
              </span>
              {item.label}

              {/* Active Background Pill */}
              {isActive(item.path) && (
                <motion.div
                  layoutId="navbar-active"
                  className="absolute inset-0 bg-background shadow-sm rounded-full -z-10 border border-border/40"
                  transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side: Theme, Action Button (Desktop) & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Sign In Button (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-2">
            {!user && (
              <Link to="/auth?mode=signin">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full gradient-bg text-white text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-300 shrink-0"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </motion.button>
              </Link>
            )}
            {!user && (
              <Link to="/auth?mode=signup">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 min-w-[104px] whitespace-nowrap rounded-full border border-border/70 bg-background/75 text-foreground text-sm font-semibold leading-none shadow-sm hover:shadow-md transition-all duration-300 shrink-0"
                >
                  Sign Up
                </motion.button>
              </Link>
            )}
            {user && (
              <button
                type="button"
                onClick={() => signOut()}
                className="flex items-center justify-center gap-2 px-4 py-2.5 min-w-[104px] whitespace-nowrap rounded-full border border-border/70 bg-background/75 text-foreground text-sm font-semibold leading-none shadow-sm hover:shadow-md transition-all duration-300 shrink-0"
              >
                Sign Out
              </button>
            )}
          </div>

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
              initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-2.5 p-3.5 glass rounded-2xl border border-border/50 shadow-2xl flex flex-col gap-2 mx-0 bg-background/95 backdrop-blur-3xl md:hidden origin-top"
            >
              {visibleNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavClick(item.path);
                  }}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-300 ${
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

              {!user && (
                <Link to="/auth?mode=signin">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl gradient-bg text-white text-base font-semibold shadow-md shadow-primary/20 active:scale-[0.98] transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </button>
                </Link>
              )}

              {!user && (
                <Link to="/auth?mode=signup">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border/70 bg-background/70 text-foreground text-base font-semibold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </button>
                </Link>
              )}

              {user && (
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border/70 bg-background/70 text-foreground text-base font-semibold"
                >
                  Sign Out
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
      </motion.nav>
      </div>
    </>
  );
};

export default Navbar;
