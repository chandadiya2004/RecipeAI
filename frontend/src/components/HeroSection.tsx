import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown, Users } from 'lucide-react';
import IngredientInput from './IngredientInput';
import { cuisines } from '@/data/recipes';

interface HeroSectionProps {
  onGenerate: () => void;
  isLoading: boolean;
}

const HeroSection = ({ onGenerate, isLoading }: HeroSectionProps) => {
  const [ingredients, setIngredients] = useState<string[]>(['Chicken', 'Tomato', 'Garlic']);
  const [servings, setServings] = useState(4);
  const [cuisine, setCuisine] = useState('indian');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedCuisine = cuisines.find(c => c.value === cuisine)!;

  return (
    <section className="relative pt-32 pb-20 px-6">
      {/* Aura background */}
      <div className="absolute inset-0 bg-aura pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1] text-balance">
            Create Your Perfect
            <br />
            <span className="gradient-text">Recipe</span> 🍳
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-md mx-auto">
            Tell us what you have, and our AI will craft the ideal dish for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-6 sm:p-8 animate-float"
          style={{ animationDuration: '6s' }}
        >
          <div className="space-y-6">
            <IngredientInput ingredients={ingredients} onChange={setIngredients} />

            {/* Servings slider */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                Servings
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none bg-muted cursor-pointer accent-primary [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="gradient-bg text-primary-foreground text-sm font-bold w-9 h-9 rounded-xl flex items-center justify-center">
                  {servings}
                </span>
              </div>
            </div>

            {/* Cuisine dropdown */}
            <div className="space-y-3 relative">
              <label className="text-sm font-medium text-foreground">Cuisine</label>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border hover:border-primary/30 transition-all duration-200 text-sm"
              >
                <span>{selectedCuisine.emoji} {selectedCuisine.label}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 glass rounded-2xl p-2 z-10"
                >
                  {cuisines.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => { setCuisine(c.value); setDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors duration-150 ${
                        cuisine === c.value ? 'bg-primary/10 text-foreground font-medium' : 'hover:bg-muted/60 text-foreground'
                      }`}
                    >
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onGenerate}
              disabled={isLoading}
              className="w-full py-4 rounded-full gradient-bg gradient-bg-hover text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 glow-primary disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.97]"
            >
              <Sparkles className="w-5 h-5" />
              {isLoading ? 'Generating...' : 'Generate Recipe'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
