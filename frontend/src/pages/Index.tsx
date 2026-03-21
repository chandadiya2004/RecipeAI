import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SuggestedRecipes from '@/components/SuggestedRecipes';
import GeneratedRecipe from '@/components/GeneratedRecipe';
import LoadingState from '@/components/LoadingState';
import { fullRecipe } from '@/data/recipes';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);

  const handleGenerate = useCallback(() => {
    setIsLoading(true);
    setShowRecipe(false);
    setTimeout(() => {
      setIsLoading(false);
      setShowRecipe(true);
    }, 3000);
  }, []);

  const handleSelectRecipe = useCallback((_id: string) => {
    handleGenerate();
  }, [handleGenerate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onGenerate={handleGenerate} isLoading={isLoading} />
      <SuggestedRecipes onSelectRecipe={handleSelectRecipe} />
      {isLoading && <LoadingState />}
      {showRecipe && !isLoading && (
        <GeneratedRecipe recipe={fullRecipe} onRegenerate={handleGenerate} />
      )}
    </div>
  );
};

export default Index;
