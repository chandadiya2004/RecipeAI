import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Zap } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
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
    description: 'A fast, satisfying morning meal',
    ingredients: ['Eggs', 'Butter', 'Bread', 'Cheese'],
    color: 'from-amber-500/20 to-yellow-500/10',
    border: 'border-amber-400/40',
    ring: 'ring-amber-400/50',
    glow: 'hover:shadow-amber-300/25',
    badge: 'bg-amber-100 text-amber-800',
  },
  {
    emoji: '🍝',
    title: 'Pasta Night',
    cuisine: 'Italian',
    description: 'Classic Italian comfort food',
    ingredients: ['Pasta', 'Tomatoes', 'Garlic', 'Olive Oil'],
    color: 'from-red-500/20 to-orange-500/10',
    border: 'border-red-400/40',
    ring: 'ring-red-400/50',
    glow: 'hover:shadow-red-300/25',
    badge: 'bg-red-100 text-red-800',
  },
  {
    emoji: '🍗',
    title: 'Chicken Bowl',
    cuisine: 'Indian',
    description: 'Hearty protein-packed meal',
    ingredients: ['Chicken', 'Rice', 'Bell Pepper', 'Onion'],
    color: 'from-orange-500/20 to-amber-400/10',
    border: 'border-orange-400/40',
    ring: 'ring-orange-400/50',
    glow: 'hover:shadow-orange-300/25',
    badge: 'bg-orange-100 text-orange-800',
  },
  {
    emoji: '🥘',
    title: 'Veggie Soup',
    cuisine: 'Any',
    description: 'Warm and comforting one-pot',
    ingredients: ['Potatoes', 'Carrots', 'Celery', 'Onion'],
    color: 'from-green-500/20 to-teal-400/10',
    border: 'border-green-400/40',
    ring: 'ring-green-400/50',
    glow: 'hover:shadow-green-300/25',
    badge: 'bg-green-100 text-green-800',
  },
  {
    emoji: '🍜',
    title: 'Noodle Fix',
    cuisine: 'Chinese',
    description: 'Asian-style noodle dish',
    ingredients: ['Noodles', 'Soy Sauce', 'Egg', 'Garlic'],
    color: 'from-purple-500/20 to-pink-400/10',
    border: 'border-purple-400/40',
    ring: 'ring-purple-400/50',
    glow: 'hover:shadow-purple-300/25',
    badge: 'bg-purple-100 text-purple-800',
  },
  {
    emoji: '🥚',
    title: 'Egg Special',
    cuisine: 'Any',
    description: 'Simple and nutritious',
    ingredients: ['Eggs', 'Spinach', 'Tomato', 'Onion'],
    color: 'from-cyan-500/20 to-blue-400/10',
    border: 'border-cyan-400/40',
    ring: 'ring-cyan-400/50',
    glow: 'hover:shadow-cyan-300/25',
    badge: 'bg-cyan-100 text-cyan-800',
  },
];

const PantryChef = () => {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);
  const [currentQuery, setCurrentQuery] = useState<QueryData | null>(null);
  const [activeCardIdx, setActiveCardIdx] = useState<number | null>(null);
  // Per-card servings state (default 2 for each)
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

      const token = await getToken();

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
  }, []);

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

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <div className="relative pt-28 pb-4 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-purple-400/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-0 right-1/3 w-[400px] h-[400px] bg-orange-400/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center px-4 mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-background/80 backdrop-blur text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5 shadow-sm">
            🥗 Ingredient-First Cooking
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 leading-[1.1]">
            Pantry <span className="gradient-text">Chef</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Pick a quick starter set or type your own ingredients — our AI builds a recipe around exactly what you have.
          </p>
        </motion.div>

        {/* ── QUICK ACTION CARDS ─────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-2">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground uppercase tracking-wider">Quick Ingredient Sets</span>
            <span className="text-xs text-muted-foreground ml-1 hidden sm:inline">— customize servings then click to generate</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickSets.map((set, idx) => {
              const isActive = activeCardIdx === idx;
              const servings = cardServings[idx];
              return (
                <motion.div
                  key={set.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  className={`
                    relative flex flex-col rounded-2xl border-2 overflow-hidden
                    bg-gradient-to-br ${set.color} ${set.border}
                    transition-all duration-300 hover:shadow-lg ${set.glow}
                    ${isActive ? `ring-2 ${set.ring}` : ''}
                    ${isLoading && !isActive ? 'opacity-60' : ''}
                  `}
                >
                  {/* Active shimmer */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-primary/10 pointer-events-none"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                    />
                  )}

                  {/* Card body — clickable to generate */}
                  <button
                    className="text-left p-4 pb-2 flex-1 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    onClick={() => !isLoading && handleQuickAction(idx, set)}
                  >
                    <div className="text-3xl mb-2 leading-none">{set.emoji}</div>
                    <div className="font-black text-[15px] text-foreground leading-tight mb-1">{set.title}</div>
                    <div className="text-muted-foreground text-[12px] mb-2.5 leading-snug">{set.description}</div>
                    <div className="flex flex-wrap gap-1">
                      {set.ingredients.map(ing => (
                        <span key={ing} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${set.badge}`}>{ing}</span>
                      ))}
                    </div>
                  </button>

                  {/* Servings row — NOT triggering generation */}
                  <div className="px-4 py-3 border-t border-border/30 flex items-center justify-between gap-2 bg-background/30 backdrop-blur-sm">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Servings</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => adjustServings(idx, -1, e)}
                        disabled={isLoading || servings <= 1}
                        className="w-7 h-7 rounded-lg border border-border/60 bg-background/60 flex items-center justify-center hover:bg-muted/60 disabled:opacity-40 transition-all active:scale-90"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <motion.span
                        key={servings}
                        initial={{ scale: 0.75, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-7 text-center text-sm font-black text-foreground"
                      >
                        {servings}
                      </motion.span>
                      <button
                        onClick={(e) => adjustServings(idx, +1, e)}
                        disabled={isLoading || servings >= 10}
                        className="w-7 h-7 rounded-lg border border-border/60 bg-background/60 flex items-center justify-center hover:bg-muted/60 disabled:opacity-40 transition-all active:scale-90"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Generate CTA strip */}
                  <button
                    disabled={isLoading}
                    onClick={() => !isLoading && handleQuickAction(idx, set)}
                    className={`w-full py-2 text-[12px] font-black uppercase tracking-widest transition-all duration-200
                      ${isActive
                        ? 'bg-primary/20 text-primary'
                        : 'bg-background/40 text-muted-foreground hover:text-primary hover:bg-primary/10'
                      }
                      disabled:cursor-not-allowed
                    `}
                  >
                    {isActive ? 'Generating...' : `Generate for ${servings} →`}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">or add your own ingredients below</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>
        </div>
      </div>

      {/* ── MANUAL FORM ──────────────────────────────── */}
      <HeroSection onGenerate={handleGenerate} isLoading={isLoading} />

      {/* ── RESULT ───────────────────────────────────── */}
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
