import { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ChefHat, Salad, Star, Zap, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Food images from public folder
const dishes = [
  { src: '/breakfast.jpg', label: 'Breakfast Bowl', category: 'Morning' },
  { src: '/burger.jpg', label: 'Gourmet Burger', category: 'Lunch' },
  { src: '/chicken lolipop.jpg', label: 'Chicken Lollipop', category: 'Snacks' },
  { src: '/prawn chowmin.jpg', label: 'Prawn Chowmein', category: 'Dinner' },
  { src: '/snacks.jpg', label: 'Evening Snacks', category: 'Snacks' },
  { src: '/soup.jpg', label: 'Hearty Soup', category: 'Starter' },
  { src: '/steam momo.jpg', label: 'Steamed Momos', category: 'Street Food' },
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
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-28 pb-16 px-6 overflow-hidden">
        {/* Ambient blobs */}
        <motion.div style={{ y: heroBgY }} className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-400/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-400/15 blur-[120px] rounded-full" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 backdrop-blur px-5 py-2 text-sm font-semibold text-foreground/70 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          Next-Generation Culinary AI
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center text-5xl sm:text-6xl md:text-[5.5rem] font-black leading-[1.05] tracking-tight max-w-5xl text-balance"
        >
          Cook smarter.{' '}
          <span className="gradient-text">Eat better.</span>
          <br />Every single day.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-7 max-w-2xl text-center text-lg text-muted-foreground leading-relaxed text-balance"
        >
          Tell us what's in your fridge — or what you're craving — and our AI chef will craft the perfect recipe, complete with a health score and your personal sous-chef on standby.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/pantry">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="h-14 px-9 rounded-full gradient-bg text-white font-bold text-base flex items-center gap-2.5 shadow-[0_0_40px_hsl(330_80%_60%_/_0.35)] hover:shadow-[0_0_60px_hsl(330_80%_60%_/_0.5)] transition-all duration-300"
            >
              <Salad className="w-5 h-5" />
              Start from your Fridge
            </motion.button>
          </Link>
          <Link to="/generator">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="h-14 px-9 rounded-full border-2 border-border bg-card/60 backdrop-blur text-foreground font-bold text-base flex items-center gap-2 hover:border-primary/40 hover:bg-muted/40 transition-all duration-300"
            >
              <ChefHat className="w-5 h-5 text-primary" />
              Craving a dish?
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-10 text-center"
        >
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 text-primary">{s.icon}</div>
              <span className="text-3xl font-black">{s.value}</span>
              <span className="text-sm text-muted-foreground font-medium">{s.label}</span>
            </div>
          ))}
        </motion.div>
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
