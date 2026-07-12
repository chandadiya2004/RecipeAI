import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, Users, Globe } from 'lucide-react';
import IngredientInput from './IngredientInput';
import { cuisines } from '@/data/recipes';
import AnimatedChef from './AnimatedChef';

interface HeroSectionProps {
  onGenerate: (data: { ingredients: string[], servings: number, cuisine: string }) => void;
  isLoading: boolean;
}

const HeroSection = ({ onGenerate, isLoading }: HeroSectionProps) => {
  const [ingredients, setIngredients] = useState<string[]>(['Chicken', 'Tomato', 'Garlic', 'Basil']);
  const [servings, setServings] = useState(4);
  const [cuisine, setCuisine] = useState('italian');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedCuisine = cuisines.find(c => c.value === cuisine)!;

  return (
    <section className="relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background glow effects to highlight this section */}
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] bg-primary/18 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-400/12 blur-[150px] rounded-full pointer-events-none -z-10" />
      {/* Soft aura */}
      <div className="absolute inset-0 bg-aura pointer-events-none" />

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">

        {/* ── LEFT: Form ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -28, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col z-10"
        >
          {/* Text */}
          <div className="mb-8 lg:pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/45 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              Interactive Recipe Studio
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.1] text-balance mb-4">
              Cook Like a Pro <br />with <span className="gradient-text">AI</span> 🌿
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Enter the ingredients you have on hand and your AI Sous-Chef will craft a perfect recipe instantly.
            </p>
          </div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="gradient-border rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(59,130,246,0.18)] bg-card/85 space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
            {/* Ingredient Input */}
            <IngredientInput ingredients={ingredients} onChange={setIngredients} />

            {/* Servings */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-widest text-foreground/80 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                Servings
              </label>
              <div className="flex items-center gap-4 bg-background/90 px-4 py-3 rounded-2xl border border-border/65 hover:border-primary/40 focus-within:border-primary/50 transition-all duration-300 shadow-[0_2px_12px_rgba(59,130,246,0.04)] backdrop-blur-md">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none bg-primary/10 dark:bg-primary/20 cursor-pointer accent-primary
                    [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:bg-card [&::-webkit-slider-thumb]:border-[3px]
                    [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md"
                />
                <motion.div
                  key={servings}
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="gradient-bg text-white text-sm font-black w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                >
                  {servings}
                </motion.div>
              </div>
            </div>

            {/* Cuisine */}
            <div className="space-y-2 relative">
              <label className="text-xs font-extrabold uppercase tracking-widest text-foreground/80 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary" />
                Cuisine
              </label>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-background/90 border border-border/65 hover:border-primary/55 transition-all duration-300 font-medium backdrop-blur-md shadow-[0_2px_12px_rgba(59,130,246,0.04)]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-primary/10 border border-primary/15 dark:bg-primary/15 dark:border-primary/30 rounded-xl p-1.5 shadow-sm leading-none">{selectedCuisine.emoji}</span>
                  <span className="text-sm font-bold text-foreground">{selectedCuisine.label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-primary' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-full left-0 right-0 mt-2 rounded-2xl p-2 z-20 shadow-2xl border border-primary/30 dark:border-primary/20 backdrop-blur-2xl max-h-56 overflow-y-auto bg-card/95"
                  >
                    {cuisines.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => { setCuisine(c.value); setDropdownOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                          cuisine === c.value
                            ? 'bg-primary/15 text-primary font-bold shadow-sm'
                            : 'hover:bg-muted/80 dark:hover:bg-muted/65 text-foreground font-medium'
                        }`}
                      >
                        <span className="text-lg leading-none">{c.emoji}</span>
                        {c.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onGenerate({ ingredients, servings, cuisine })}
              disabled={isLoading || ingredients.length === 0}
              className="w-full py-4 rounded-2xl gradient-bg text-white font-black text-base flex items-center justify-center gap-2.5 shadow-lg glow-primary hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Sparkles className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'animate-pulse'}`} />
              {isLoading ? 'Creating Magic…' : 'Generate AI Recipe'}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Chef animation ───────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full min-h-[400px] lg:min-h-[580px] relative z-0 flex items-center justify-center"
        >
          <AnimatedChef />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
