import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SuggestedRecipes from '@/components/SuggestedRecipes';
import GeneratedRecipe from '@/components/GeneratedRecipe';
import LoadingState from '@/components/LoadingState';
import { Recipe, suggestedRecipes } from '@/data/recipes';
import { useNavigate } from 'react-router-dom';

interface QueryData {
  ingredients?: string[];
  servings?: number;
  cuisine?: string;
  dish_name?: string;
}

const PantryChef = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);
  const [currentQuery, setCurrentQuery] = useState<QueryData | null>(null);

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

      const response = await fetch("http://localhost:8000/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to generate recipe");
      }

      const generatedRecipe = await response.json();
      setRecipeData(generatedRecipe);
      setShowRecipe(true);
    } catch (error) {
      console.error("Error generating recipe:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRegenerate = useCallback(() => {
    if (currentQuery) {
      handleGenerate(currentQuery);
    }
  }, [currentQuery, handleGenerate]);

  const navigate = useNavigate();

  const handleSelectRecipe = useCallback((id: string) => {
    const suggested = suggestedRecipes.find(r => r.id === id);
    if (suggested) {
      handleGenerate({ dish_name: suggested.title, servings: suggested.servings, cuisine: suggested.cuisine });
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }, [handleGenerate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20"> {/* Add padding for the sticky navbar */}
        <div className="text-center pt-8 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            Pantry <span className="gradient-text">Chef</span> 🥗
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-2 text-balance">
            Tell us what's in your fridge, and our AI will invent a delicious meal tailored just for you.
          </p>
        </div>
        <HeroSection onGenerate={handleGenerate} isLoading={isLoading} />
        <SuggestedRecipes onSelectRecipe={handleSelectRecipe} />
        {isLoading && <LoadingState />}
        {showRecipe && !isLoading && recipeData && (
          <GeneratedRecipe recipe={recipeData} onRegenerate={handleRegenerate} />
        )}
      </div>
    </div>
  );
};

export default PantryChef;
