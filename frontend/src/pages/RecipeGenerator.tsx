import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import DishInput from '@/components/DishInput';
import ChatbotPanel from '@/components/ChatbotPanel';
import GeneratedRecipe from '@/components/GeneratedRecipe';
import LoadingState from '@/components/LoadingState';
import SuggestedRecipes from '@/components/SuggestedRecipes';
import { Recipe, suggestedRecipes } from '@/data/recipes';

const RecipeGenerator = () => {
  const { getAccessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (dishName: string) => {
    setIsLoading(true);
    setRecipeData(null);
    setErrorMessage(null);

    try {
      const token = await getAccessToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ dish_name: dishName, source: "dish_generator" })
      });

      if (!response.ok) {
        let detail = "Failed to generate dish snippet";
        try {
          const payload = await response.json();
          if (payload?.detail) detail = payload.detail;
        } catch {
          detail = "Failed to generate dish snippet";
        }
        throw new Error(detail);
      }

      const generatedRecipe = await response.json();
      setRecipeData(generatedRecipe);
      
      // Auto-scroll to the result area, offset by navbar height (80px) + breathing room
      setTimeout(() => {
        if (resultsRef.current) {
          const navbarOffset = window.innerWidth < 640 ? 84 : 96;
          const top = resultsRef.current.getBoundingClientRect().top + window.scrollY - navbarOffset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 200);
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
      handleSearch(suggested.title);
    }
  };

  const ResultLayout = () => (
    <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 items-start w-full">
      {/* Left Column: Recipe Results */}
      <div className="flex-1 w-full xl:w-2/3 max-w-full">
         {isLoading && <LoadingState />}
         {!isLoading && !recipeData && (
           <div className="glass flex flex-col items-center justify-center p-6 sm:p-10 min-h-[320px] sm:min-h-[500px] text-center rounded-[2rem] border-2 border-dashed border-border mt-1">
             <div className="text-5xl sm:text-6xl mb-5 sm:mb-6 bg-muted p-4 sm:p-6 rounded-full inline-flex">🍽️</div>
             <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">
               {errorMessage ? "Request Blocked" : "Ready to Cook?"}
             </h3>
             {errorMessage ? (
               <p className="max-w-md text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm sm:text-base font-medium">
                 {errorMessage}
               </p>
             ) : (
               <p className="text-muted-foreground max-w-sm">
                 Type a dish name above or click a popular recipe. Your AI-generated recipe layout and health analysis will magically appear right here.
               </p>
             )}
           </div>
         )}
         {!isLoading && recipeData && (
           <div className="mt-0 md:-mt-10 transition-all">
             <GeneratedRecipe recipe={recipeData} onRegenerate={() => handleSearch(recipeData.title)} />
           </div>
         )}
      </div>

      {/* Right Column: AI Chatbot */}
      <div className="w-full xl:w-[400px] flex-shrink-0 xl:sticky xl:top-[120px] mb-8 xl:mb-0">
         <ChatbotPanel currentRecipe={recipeData} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 sm:pt-28 pb-10 sm:pb-12 px-4 sm:px-6 max-w-[1400px] w-full mx-auto flex flex-col">
        {/* Header Area */}
        <div className="text-center mb-6 sm:mb-8 px-1 sm:px-2 mt-1 sm:mt-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4 text-balance">
            Dish <span className="gradient-text">Generator</span> ✨
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-7 sm:mb-10 text-balance">
            Enter the name of any dish you're craving, and we'll provide a full recipe alongside your personal AI Sous-Chef.
          </p>
          <DishInput onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Popular Recipes Section - Directly below search bar */}
        <div className="mb-8 sm:mb-12">
          <SuggestedRecipes onSelectRecipe={handleSelectRecipe} />
        </div>

        {/* Unified Result Area - Below popular recipes */}
        <div ref={resultsRef} className="mt-2 sm:mt-4">
          <ResultLayout />
        </div>
      </main>
    </div>
  );
};

export default RecipeGenerator;
