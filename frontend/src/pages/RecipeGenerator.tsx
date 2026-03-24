import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Sparkles, MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import DishInput, { DishDifficulty, DishSearchPayload } from '@/components/DishInput';
import ChatbotPanel from '@/components/ChatbotPanel';
import GeneratedRecipe from '@/components/GeneratedRecipe';
import LoadingState from '@/components/LoadingState';
import SuggestedRecipes from '@/components/SuggestedRecipes';
import { Recipe, suggestedRecipes } from '@/data/recipes';

const normalizeDifficulty = (value?: string): DishDifficulty => {
  const normalized = (value || '').trim().toLowerCase();
  if (normalized === 'hard') return 'Hard';
  if (normalized === 'easy' || normalized === 'simple') return 'Easy';
  return 'Medium';
};

const RecipeGenerator = () => {
  const { getAccessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);
  const [requestedPrefs, setRequestedPrefs] = useState<{
    servings: number;
    difficulty: DishDifficulty;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async ({ dishName, servings, difficulty }: DishSearchPayload) => {
    setIsLoading(true);
    setRecipeData(null);
    setErrorMessage(null);
    setRequestedPrefs({ servings, difficulty });

    try {
      const token = await getAccessToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          dish_name: dishName,
          servings,
          difficulty,
          source: "dish_generator",
        })
      });

      if (!response.ok) {
        let detail = "Failed to generate recipe";
        try {
          const payload = await response.json();
          if (payload?.detail) detail = payload.detail;
        } catch {
          detail = "Failed to generate recipe";
        }
        throw new Error(detail);
      }

      const generatedRecipe = await response.json();
      setRecipeData(generatedRecipe);
      
      setTimeout(() => {
        if (resultsRef.current) {
          const navbarOffset = window.innerWidth < 640 ? 84 : 96;
          const top = resultsRef.current.getBoundingClientRect().top + window.scrollY - navbarOffset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 300);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unable to generate recipe.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecipe = (id: string) => {
    const suggested = suggestedRecipes.find(r => r.id === id);
    if (suggested) {
      handleSearch({
        dishName: suggested.title,
        servings: suggested.servings,
        difficulty: normalizeDifficulty(suggested.difficulty),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ scrollbarGutter: 'stable' }}>
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* ===== HERO SECTION ===== */}
        <section className="relative pt-20 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-400/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -right-32 w-96 h-96 bg-orange-400/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-6xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-6 justify-center"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">AI-Powered Generation</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4 leading-[1.1] text-balance"
            >
              Create Any <span className="gradient-text">Recipe</span> With AI
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-foreground/70 max-w-2xl leading-relaxed mb-10 mx-auto"
            >
              Enter any dish name and get a professional AI-generated recipe in seconds. Customize servings, difficulty, and get instant guidance from your personal Chef AI.
            </motion.p>

            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6"
            >
              <DishInput onSearch={handleSearch} isLoading={isLoading} />
            </motion.div>
          </div>
        </section>

        {/* ===== MAIN CONTENT AREA ===== */}
        <section className="flex-1 px-4 sm:px-6 pb-16 sm:pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Show Loading */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingState />
              </motion.div>
            )}

            {/* Show Suggested Recipes (Only if no recipe generated yet) */}
            {!isLoading && !recipeData && !errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SuggestedRecipes onSelectRecipe={handleSelectRecipe} />
              </motion.div>
            )}

            {/* Show Error */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl p-8 border-2 border-destructive/20 bg-destructive/5"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">⚠️</div>
                  <div>
                    <h3 className="text-lg font-bold text-destructive mb-2">Request Blocked</h3>
                    <p className="text-foreground/70">{errorMessage}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Show Recipe Result */}
            {recipeData && (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GeneratedRecipe
                  recipe={recipeData}
                  onRegenerate={() =>
                    handleSearch({
                      dishName: recipeData.title,
                      servings: recipeData.servings || 2,
                      difficulty: normalizeDifficulty(recipeData.difficulty),
                    })
                  }
                />
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && !recipeData && !errorMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="glass rounded-3xl p-12 sm:p-16 text-center border-2 border-dashed border-border/50 min-h-[400px] flex flex-col items-center justify-center"
              >
                <div className="text-6xl mb-6 animate-bounce">
                  <ChefHat className="w-16 h-16 mx-auto text-foreground/40" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-3">Ready to Cook?</h3>
                <p className="text-foreground/60 max-w-md text-lg">
                  Search for your favorite dish above and we'll generate a complete AI recipe just for you.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Floating Chat Bubble & Modal */}
      {recipeData && (
        <>
          {/* Bubble Button - Always Visible */}
          <motion.button
            key="chat-bubble"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowChatModal(true)}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full gradient-bg text-white shadow-2xl flex items-center justify-center hover:shadow-[0_0_40px_hsl(330_80%_60%_/_0.6)] transition-all duration-300 z-40 glow-primary"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MessageCircle className="w-7 h-7" />
            </motion.div>
          </motion.button>

          {/* Chat Modal - Floating from Bottom Right */}
          {showChatModal && (
            <>
              {/* Backdrop with blur */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                onClick={() => setShowChatModal(false)}
              />

              {/* Floating Chat Widget */}
              <motion.div
                key="chat-modal"
                initial={{ 
                  opacity: 0, 
                  scale: 0.8,
                  y: 100,
                  x: 100
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: 0,
                  x: 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8,
                  y: 100,
                  x: 100
                }}
                transition={{ 
                  type: 'spring',
                  damping: 25,
                  stiffness: 300,
                  duration: 0.4
                }}
                className="fixed bottom-24 right-6 w-96 h-[600px] rounded-3xl overflow-hidden shadow-2xl z-50 border border-border/50"
              >
                {/* Close Button - Floating in Corner */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowChatModal(false)}
                  className="absolute -top-3 -right-3 z-20 w-12 h-12 rounded-full gradient-bg text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Chatbot Panel */}
                <ChatbotPanel currentRecipe={recipeData} />
              </motion.div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RecipeGenerator;
