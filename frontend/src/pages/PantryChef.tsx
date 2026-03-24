import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GeneratedRecipe from '@/components/GeneratedRecipe';
import LoadingState from '@/components/LoadingState';
import { Recipe, suggestedRecipes } from '@/data/recipes';

interface QueryData {
  ingredients?: string[];
  servings?: number;
  cuisine?: string;
  dish_name?: string;
}

const quickSets = [
  {
    emoji: '🍳',
    title: 'Quick Breakfast',
    cuisine: 'Any',
    description: 'Fast, satisfying morning meal',
    ingredients: ['Eggs', 'Butter', 'Bread', 'Cheese'],
    gradient: 'from-amber-500 to-yellow-400',
    bg: 'from-amber-500/12 to-yellow-400/5',
    border: 'border-amber-400/30',
    glow: 'hover:shadow-amber-400/20',
    tag: 'bg-amber-100 text-amber-700',
  },
  {
    emoji: '🍝',
    title: 'Pasta Night',
    cuisine: 'Italian',
    description: 'Classic Italian comfort food',
    ingredients: ['Pasta', 'Tomatoes', 'Garlic', 'Olive Oil'],
    gradient: 'from-red-500 to-orange-400',
    bg: 'from-red-500/12 to-orange-400/5',
    border: 'border-red-400/30',
    glow: 'hover:shadow-red-400/20',
    tag: 'bg-red-100 text-red-700',
  },
  {
    emoji: '🍗',
    title: 'Chicken Bowl',
    cuisine: 'Indian',
    description: 'Hearty protein-packed meal',
    ingredients: ['Chicken', 'Rice', 'Bell Pepper', 'Onion'],
    gradient: 'from-orange-500 to-amber-400',
    bg: 'from-orange-500/12 to-amber-400/5',
    border: 'border-orange-400/30',
    glow: 'hover:shadow-orange-400/20',
    tag: 'bg-orange-100 text-orange-700',
  },
  {
    emoji: '🥘',
    title: 'Veggie Soup',
    cuisine: 'Any',
    description: 'Warm, comforting one-pot',
    ingredients: ['Potatoes', 'Carrots', 'Celery', 'Onion'],
    gradient: 'from-emerald-500 to-teal-400',
    bg: 'from-emerald-500/12 to-teal-400/5',
    border: 'border-emerald-400/30',
    glow: 'hover:shadow-emerald-400/20',
    tag: 'bg-emerald-100 text-emerald-700',
  },
  {
    emoji: '🍜',
    title: 'Noodle Fix',
    cuisine: 'Chinese',
    description: 'Asian-style noodle dish',
    ingredients: ['Noodles', 'Soy Sauce', 'Egg', 'Garlic'],
    gradient: 'from-violet-500 to-purple-400',
    bg: 'from-violet-500/12 to-purple-400/5',
    border: 'border-violet-400/30',
    glow: 'hover:shadow-violet-400/20',
    tag: 'bg-violet-100 text-violet-700',
  },
  {
    emoji: '🥚',
    title: 'Egg Special',
    cuisine: 'Any',
    description: 'Simple and nutritious',
    ingredients: ['Eggs', 'Spinach', 'Tomato', 'Onion'],
    gradient: 'from-cyan-500 to-blue-400',
    bg: 'from-cyan-500/12 to-blue-400/5',
    border: 'border-cyan-400/30',
    glow: 'hover:shadow-cyan-400/20',
    tag: 'bg-cyan-100 text-cyan-700',
  },
];

const PantryChef = () => {
  const { getAccessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);
  const [currentQuery, setCurrentQuery] = useState<QueryData | null>(null);
  const [activeCardIdx, setActiveCardIdx] = useState<number | null>(null);
  const [cardServings, setCardServings] = useState<number[]>(quickSets.map(() => 2));
  const resultRef = useRef<HTMLDivElement>(null);

  const adjustServings = (idx: number, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardServings(prev => prev.map((v, i) => i === idx ? Math.max(1, Math.min(10, v + delta)) : v));
  };

  const handleGenerate = useCallback(async (data: QueryData) => {
    setCurrentQuery(data);
    setIsLoading(true);
    setShowRecipe(false);

    try {
      const payload: any = {};
      if (data.ingredients) payload.ingredients = data.ingredients;
      if (data.servings) payload.servings = data.servings;
      if (data.cuisine) payload.cuisine = data.cuisine;
      if (data.dish_name) payload.dish_name = data.dish_name;
      payload.source = 'pantry_chef';

      const token = await getAccessToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-recipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to generate recipe');

      const generatedRecipe = await response.json();
      setRecipeData(generatedRecipe);
      setShowRecipe(true);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    } catch (error) {
      console.error('Error generating recipe:', error);
    } finally {
      setIsLoading(false);
      setActiveCardIdx(null);
    }
  }, [getAccessToken]);

  const handleQuickAction = (idx: number, set: typeof quickSets[0]) => {
    setActiveCardIdx(idx);
    handleGenerate({ ingredients: set.ingredients, servings: cardServings[idx], cuisine: set.cuisine });
  };

  const handleRegenerate = useCallback(() => {
    if (currentQuery) handleGenerate(currentQuery);
  }, [currentQuery, handleGenerate]);

  const handleSelectRecipe = useCallback((id: string) => {
    const suggested = suggestedRecipes.find(r => r.id === id);
    if (suggested) handleGenerate({ dish_name: suggested.title, servings: suggested.servings, cuisine: suggested.cuisine });
  }, [handleGenerate]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ── PAGE HEADER ───────────────────────────── */}
      <section className="relative pt-28 pb-6 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-primary/8 blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-10 right-1/4 w-[400px] h-[300px] bg-cyan-400/8 blur-[120px] rounded-full pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center px-4 mb-12"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-6">
            <span className="text-base">🥗</span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Ingredient-First Cooking</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 leading-[1.1]">
            Pantry <span className="gradient-text">Chef</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Pick a starter set or type your own ingredients — AI builds a perfect recipe around what you have.
          </p>
        </motion.div>

        {/* ── QUICK ACTION CARDS ──────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Section label */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center shadow-sm">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">Quick Ingredient Sets</span>
            <span className="hidden sm:inline text-xs text-muted-foreground">— pick servings then click to generate</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {quickSets.map((set, idx) => {
              const isActive = activeCardIdx === idx;
              const servings = cardServings[idx];
              return (
                <motion.div
                  key={set.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  whileHover={!isLoading ? { y: -4, scale: 1.01 } : {}}
                  className={`
                    relative flex flex-col rounded-2xl border overflow-hidden group
                    bg-gradient-to-br ${set.bg} ${set.border}
                    transition-all duration-300 hover:shadow-xl ${set.glow}
                    ${isActive ? 'ring-2 ring-primary/50 border-primary/40' : ''}
                    ${isLoading && !isActive ? 'opacity-50' : ''}
                  `}
                >
                  {/* Animated loading overlay */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-primary/8 pointer-events-none"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                    />
                  )}

                  {/* Top accent line */}
                  <div className={`h-0.5 w-full bg-gradient-to-r ${set.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

                  {/* Card body */}
                  <button
                    className="text-left p-4 flex-1 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    onClick={() => !isLoading && handleQuickAction(idx, set)}
                  >
                    {/* Emoji with gradient backdrop */}
                    <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center text-xl bg-gradient-to-br ${set.gradient} shadow-sm`}>
                      {set.emoji}
                    </div>
                    <div className="font-black text-sm text-foreground mb-1 leading-tight">{set.title}</div>
                    <div className="text-muted-foreground text-xs mb-3 leading-snug">{set.description}</div>
                    <div className="flex flex-wrap gap-1">
                      {set.ingredients.map(ing => (
                        <span key={ing} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${set.tag}`}>{ing}</span>
                      ))}
                    </div>
                  </button>

                  {/* Servings + generate footer */}
                  <div className="px-4 py-2.5 border-t border-border/30 bg-background/40 backdrop-blur-sm flex items-center justify-between gap-2">
                    {/* Servings stepper */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => adjustServings(idx, -1, e)}
                        disabled={isLoading || servings <= 1}
                        className="w-6 h-6 rounded-md border border-border/60 bg-background/70 flex items-center justify-center hover:bg-muted/60 disabled:opacity-40 transition-all active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <motion.span
                        key={servings}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-6 text-center text-xs font-black text-foreground"
                      >
                        {servings}
                      </motion.span>
                      <button
                        onClick={(e) => adjustServings(idx, +1, e)}
                        disabled={isLoading || servings >= 10}
                        className="w-6 h-6 rounded-md border border-border/60 bg-background/70 flex items-center justify-center hover:bg-muted/60 disabled:opacity-40 transition-all active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] text-muted-foreground font-medium">servings</span>
                    </div>

                    {/* Generate button */}
                    <button
                      disabled={isLoading}
                      onClick={() => !isLoading && handleQuickAction(idx, set)}
                      className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-wider transition-all duration-200 rounded-lg px-2.5 py-1
                        ${isActive
                          ? 'bg-primary/15 text-primary'
                          : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                        }
                      `}
                    >
                      {isActive ? 'Cooking…' : 'Cook'}
                      {!isActive && <ChevronRight className="w-3 h-3" />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mt-10 mb-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2 whitespace-nowrap">
              or add your own ingredients below
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>

      {/* ── MANUAL FORM ───────────────────────── */}
      <HeroSection onGenerate={handleGenerate} isLoading={isLoading} />

      {/* ── RESULT ────────────────────────────── */}
      <div ref={resultRef}>
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingState />
            </motion.div>
          )}
          {showRecipe && !isLoading && recipeData && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <GeneratedRecipe recipe={recipeData} onRegenerate={handleRegenerate} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PantryChef;
