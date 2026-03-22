import { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ChefHat, Salad, Star, Zap, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedChef from '@/components/AnimatedChef';
// Food images from public folder
const dishes = [
  { src: '/breakfast.jpg', label: 'Breakfast Bowl', category: 'Morning' },
  { src: '/burger.jpg', label: 'Gourmet Burger', category: 'Lunch' },
  { src: '/chicken lolipop.jpg', label: 'Chicken Lollipop', category: 'Snacks' },
  { src: '/prawn chowmin.jpg', label: 'Prawn Chowmein', category: 'Dinner' },
  { src: '/snacks.jpg', label: 'Evening Snacks', category: 'Snacks' },
  { src: '/soup.jpg', label: 'Hearty Soup', category: 'Starter' },
  { src: '/steam momo.jpg', label: 'Steamed Momos', category: 'Street Food' },
  { src: '/biriyani.jpg', label: 'Biryani', category: 'Main Course' },
  { src: '/pasta.jpg', label: 'Al Dente Pasta', category: 'Italian' },
  { src: '/pastry cake.jpg', label: 'Pastry Cake', category: 'Dessert' },
];

const stats = [
  { icon: <Star className="w-5 h-5" />, value: '10,000+', label: 'Recipes Generated' },
  { icon: <Zap className="w-5 h-5" />, value: '<3s', label: 'Recipe Created In' },
  { icon: <Heart className="w-5 h-5" />, value: '98%', label: 'User Satisfaction' },
];

export default function Index() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 600], [0, 100]);

  // Auto-scroll carousel
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let animFrame: number;
    let pos = 0;
    const step = 0.5;
    const halfWidth = track.scrollWidth / 2;
    const animate = () => {
      pos += step;
      if (pos >= halfWidth) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="relative flex flex-col justify-center min-h-[95vh] pt-32 pb-20 px-6 xl:px-12 overflow-hidden">
        {/* Ambient blobs */}
        <motion.div style={{ y: heroBgY }} className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full animate-pulse-glow" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[hsl(40_80%_55%)]/15 blur-[120px] rounded-full" />
        </motion.div>

        <div className="max-w-[90rem] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
          
          {/* Left Side (Text & CTAs) */}
          <div className="flex flex-col z-10 lg:pr-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 self-start inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur px-5 py-2 text-sm font-semibold text-primary shadow-[0_0_15px_hsl(140_60%_40%_/_0.15)]"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              Next-Generation Culinary AI
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-left text-5xl sm:text-6xl md:text-[5rem] lg:text-[5.5rem] font-black leading-[1.05] tracking-tight text-balance"
            >
              Cook smarter.{' '}
              <span className="gradient-text drop-shadow-sm">Eat better.</span>
              <br />Every single day.
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-7 max-w-xl text-left text-lg sm:text-xl text-muted-foreground leading-relaxed text-balance"
            >
              Tell us what's in your fridge — or what you're craving — and our AI chef will craft the perfect earthy recipe, complete with a health score and your personal sous-chef on standby.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center sm:items-start gap-4"
            >
              <Link to="/pantry" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full h-15 px-8 py-4 rounded-full gradient-bg text-white font-bold text-lg flex items-center justify-center gap-3 shadow-[0_0_40px_hsl(140_60%_40%_/_0.35)] hover:shadow-[0_0_60px_hsl(140_60%_40%_/_0.5)] transition-all duration-300 glow-primary"
                >
                  <Salad className="w-6 h-6" />
                  Start from your Fridge
                </motion.button>
              </Link>
              <Link to="/generator" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full h-15 px-8 py-4 rounded-full border-2 border-primary/30 bg-background/60 backdrop-blur text-foreground font-bold text-lg flex items-center justify-center gap-2 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300"
                >
                  <ChefHat className="w-6 h-6 text-primary" />
                  Craving a dish?
                  <ArrowRight className="w-5 h-5 ml-1" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-14 flex flex-wrap items-center justify-start gap-12"
            >
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-2 py-1 rounded-md mb-1">{s.icon}</div>
                  <span className="text-3xl font-black">{s.value}</span>
                  <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side (Animated Scene) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full min-h-[500px] lg:min-[600px] relative z-0 flex items-center justify-center mt-10 lg:mt-0"
          >
            <AnimatedChef />
          </motion.div>

        </div>
      </section>

      {/* ─── INFINITE IMAGE MARQUEE ─────────────────────────────────── */}
      <section className="py-6 overflow-hidden border-y border-border/50 bg-muted/20 backdrop-blur-sm">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6">Dishes our AI has mastered</p>
        <div ref={scrollRef} className="overflow-hidden">
          <div ref={trackRef} className="flex gap-4 w-max will-change-transform">
            {/* Render dishes twice for seamless loop */}
            {[...dishes, ...dishes].map((d, i) => (
              <div
                key={i}
                className="relative w-52 h-36 rounded-2xl overflow-hidden flex-shrink-0 group border border-border/40 shadow-md"
              >
                <img
                  src={d.src}
                  alt={d.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{d.category}</span>
                  <p className="text-sm font-bold text-white leading-tight">{d.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BENTO FEATURE GRID ─────────────────────────────────────── */}
      <section className="py-28 px-6 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">One platform. <span className="gradient-text">Endless meals.</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">Every feature you need to take the guesswork out of cooking — powered by state-of-the-art AI.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[280px]">
          
          {/* Big card: Pantry Chef */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 row-span-1 relative rounded-[2rem] overflow-hidden group border border-border/50 shadow-xl cursor-pointer"
          >
            <img src="/breakfast.jpg" alt="Pantry Chef" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/40 to-transparent" />
            <Link to="/pantry" className="absolute inset-0 z-10 flex flex-col justify-end p-8">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg mb-5">
                <Salad className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Pantry Chef</h3>
              <p className="text-white/75 text-sm max-w-sm leading-relaxed">Drop in what's in your fridge — tomatoes, eggs, leftover rice — and get a stunning recipe invented on the spot.</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-white/90 group-hover:gap-3 transition-all">
                Try it now <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>

          {/* Small card: Dish Generator */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-[2rem] overflow-hidden group border border-border/50 shadow-xl cursor-pointer"
          >
            <img src="/burger.jpg" alt="Dish Generator" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <Link to="/generator" className="absolute inset-0 z-10 flex flex-col justify-end p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg mb-4">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-1.5">Dish Generator</h3>
              <p className="text-white/70 text-sm leading-relaxed">Name any dish in the world. Get a perfect, professional-grade recipe in seconds.</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-white/90 group-hover:gap-3 transition-all">
                Generate now <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>

          {/* Small card: Momos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-[2rem] overflow-hidden group border border-border/50 shadow-xl"
          >
            <img src="/steam momo.jpg" alt="Steamed Momos" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Street Food</span>
              <h3 className="text-xl font-black text-white">Steamed Momos</h3>
              <p className="text-white/60 text-sm mt-1">Try generating this iconic dish!</p>
            </div>
          </motion.div>

          {/* AI Sous-chef card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-[2rem] overflow-hidden group border border-border/50 shadow-xl"
          >
            <img src="/soup.jpg" alt="AI Chef" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-1.5">AI Sous-Chef</h3>
              <p className="text-white/70 text-sm leading-relaxed">Ask anything mid-cook — substitutions, timings, plating tips.</p>
            </div>
          </motion.div>

          {/* Health Analysis card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative rounded-[2rem] overflow-hidden group border border-border/50 shadow-xl"
          >
            <img src="/snacks.jpg" alt="Health Analysis" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-1.5">Health Analysis</h3>
              <p className="text-white/70 text-sm leading-relaxed">Every recipe comes with a dynamic health score, calories, and smart nutritional tags.</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto rounded-[2.5rem] overflow-hidden text-center p-14 border border-border/50 shadow-2xl"
        >
          <img src="/chicken lolipop.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-pink-600/70 to-orange-500/80 backdrop-blur-[2px]" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 text-balance">Ready to reinvent your kitchen?</h2>
            <p className="text-white/80 text-lg mb-10 max-w-lg mx-auto">Join thousands of home cooks who use RecipeAI every day to discover new flavors, reduce food waste, and eat healthier.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/pantry">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-14 px-9 rounded-full bg-white text-gray-900 font-bold text-base flex items-center gap-2.5 shadow-xl hover:bg-white/90 transition-all">
                  <Salad className="w-5 h-5 text-primary" />
                  Pantry Chef
                </motion.button>
              </Link>
              <Link to="/generator">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-14 px-9 rounded-full border-2 border-white/50 text-white font-bold text-base flex items-center gap-2 hover:bg-white/10 transition-all">
                  <ChefHat className="w-5 h-5" />
                  Dish Generator
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ChefHat className="w-4 h-4 text-primary" />
          <span className="font-bold text-foreground">RecipeAI</span>
        </div>
        <p>Built with AI-powered intelligence powered by Groq. Crafted with ❤️ for food lovers.</p>
      </footer>
    </div>
  );
}
