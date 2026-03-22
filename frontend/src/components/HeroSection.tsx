import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown, Users } from 'lucide-react';
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
    <section className="relative pt-32 pb-20 px-4 sm:px-6 min-h-[90vh] flex flex-col justify-center overflow-hidden">
      {/* Aura background */}
      <div className="absolute inset-0 bg-aura pointer-events-none" />

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Text Details and Form */}
        <motion.div
          initial={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col z-10"
        >
          <div className="text-left mb-8 md:mb-10 lg:pr-8">
            <h1 className="text-5xl sm:text-6xl lg:text-[4rem] font-extrabold tracking-tight text-foreground leading-[1.08] text-balance mb-6">
              Cook Like a Pro with <span className="gradient-text">AI</span> 🌿
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-lg leading-relaxed">
              Enter the ingredients you have on hand, and your AI Sous-Chef will instantly generate a perfect, earthy-inspired recipe crafted just for you.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-primary/20 bg-background/60"
          >
            <div className="space-y-6">
              <IngredientInput ingredients={ingredients} onChange={setIngredients} />

              {/* Servings slider */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2 tracking-wide uppercase">
                  <Users className="w-4 h-4 text-primary" />
                  Servings
                </label>
                <div className="flex items-center gap-5 bg-background/50 p-2.5 rounded-3xl border-2 border-border/80 backdrop-blur-md transition-all focus-within:border-primary/40 focus-within:shadow-[0_0_20px_hsl(140_60%_40%_/_0.15)]">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    className="flex-1 h-2 rounded-full appearance-none bg-muted-foreground/20 cursor-pointer accent-primary [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 transition-all duration-200 ml-2"
                  />
                  <motion.div 
                    key={servings}
                    initial={{ scale: 0.8, y: -10, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    className="gradient-bg text-white shadow-[0_4px_20px_hsl(140_60%_40%_/_0.4)] text-base font-black w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  >
                    {servings}
                  </motion.div>
                </div>
              </div>

              {/* Cuisine dropdown */}
              <div className="space-y-3 relative pt-2">
                <label className="text-sm font-semibold tracking-wide text-foreground uppercase">Cuisine</label>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-background/50 border-2 border-border/80 hover:border-primary/40 focus:border-primary/50 focus:shadow-[0_0_20px_hsl(140_60%_40%_/_0.2)] transition-all duration-300 text-base font-medium backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl bg-muted rounded-full p-1 shadow-sm">{selectedCuisine.emoji}</span>
                    <span>{selectedCuisine.label}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl p-2.5 z-20 shadow-xl border border-border/80 backdrop-blur-2xl"
                  >
                    {cuisines.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => { setCuisine(c.value); setDropdownOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all duration-200 ${
                          cuisine === c.value ? 'bg-primary/15 text-primary font-bold shadow-inner' : 'hover:bg-muted/80 text-foreground font-medium'
                        }`}
                      >
                        <span className="text-xl">{c.emoji}</span> {c.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onGenerate({ ingredients, servings, cuisine })}
                disabled={isLoading}
                className="mt-6 w-full py-4.5 min-h-[64px] rounded-2xl gradient-bg hover:shadow-lg text-white font-black text-[17px] flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_8px_30px_hsl(140_60%_40%_/_0.4)] hover:shadow-[0_8px_40px_hsl(140_60%_40%_/_0.6)] disabled:opacity-70 disabled:cursor-not-allowed glow-primary"
              >
                <Sparkles className="w-6 h-6 animate-pulse" />
                {isLoading ? 'Creating Magic...' : 'Generate AI Recipe'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Animated Chef */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full min-h-[400px] lg:min-h-[600px] relative z-0 flex items-center justify-center"
        >
          <AnimatedChef />
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
