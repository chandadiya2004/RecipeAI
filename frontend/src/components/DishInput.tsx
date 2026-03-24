import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Search, SlidersHorizontal, Users } from 'lucide-react';

export type DishDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface DishSearchPayload {
  dishName: string;
  servings: number;
  difficulty: DishDifficulty;
}

interface Props {
  onSearch: (payload: DishSearchPayload) => void;
  isLoading: boolean;
}

const DishInput = ({ onSearch, isLoading }: Props) => {
  const [value, setValue] = useState('');
  const [servings, setServings] = useState(2);
  const [difficulty, setDifficulty] = useState<DishDifficulty>('Medium');

  const triggerSearch = () => {
    if (!value.trim() || isLoading) return;
    onSearch({
      dishName: value.trim(),
      servings,
      difficulty,
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim() && !isLoading) {
      triggerSearch();
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto mb-8 sm:mb-12 w-full px-0">
      <div className="relative flex items-center w-full h-16 sm:h-20 rounded-2xl sm:rounded-full bg-background/80 border-2 border-border/80 focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary/50 focus-within:shadow-[0_0_40px_hsl(330_80%_60%_/_0.2)] backdrop-blur-xl transition-all duration-300 group">
        <div className="pl-4 sm:pl-8 text-muted-foreground hidden sm:block">
          <Search className="w-6 h-6 md:w-7 md:h-7 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What dish are you craving? (e.g. Butter Chicken)"
          className="w-full h-full bg-transparent border-none outline-none px-4 sm:px-5 text-base sm:text-lg md:text-xl font-medium text-foreground placeholder-muted-foreground/70"
          disabled={isLoading}
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={triggerSearch}
          disabled={!value.trim() || isLoading}
          className="mr-1.5 sm:mr-2 px-4 sm:px-6 md:px-8 h-12 sm:h-16 rounded-xl sm:rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-400 hover:to-orange-400 text-white font-bold flex items-center justify-center disabled:opacity-50 transition-all duration-300 text-sm sm:text-base md:text-lg whitespace-nowrap shadow-[0_4px_20px_hsl(330_80%_60%_/_0.3)] hover:shadow-[0_4px_30px_hsl(330_80%_60%_/_0.5)]"
        >
          {isLoading ? 'Cooking...' : (
            <>
              <span className="sm:hidden">Generate</span>
              <span className="hidden sm:inline">Generate AI</span>
            </>
          )}
        </motion.button>
      </div>

      <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 sm:gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/70 px-2.5 py-2.5 w-fit">
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground pr-1">
            <Users className="w-4 h-4 text-primary" /> Servings
          </span>
          <button
            type="button"
            onClick={() => setServings((prev) => Math.max(1, prev - 1))}
            disabled={isLoading || servings <= 1}
            className="w-8 h-8 rounded-lg border border-border/70 bg-background/80 flex items-center justify-center hover:bg-muted/70 disabled:opacity-40 transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-7 text-center text-sm font-black text-foreground">{servings}</span>
          <button
            type="button"
            onClick={() => setServings((prev) => Math.min(12, prev + 1))}
            disabled={isLoading || servings >= 12}
            className="w-8 h-8 rounded-lg border border-border/70 bg-background/80 flex items-center justify-center hover:bg-muted/70 disabled:opacity-40 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground mb-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" /> Difficulty
          </div>
          <div className="grid grid-cols-3 gap-2">
            {([
              { label: 'Simple', value: 'Easy' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Hard', value: 'Hard' },
            ] as const).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDifficulty(option.value)}
                disabled={isLoading}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold border transition-colors ${
                  difficulty === option.value
                    ? 'bg-primary/15 border-primary/50 text-primary'
                    : 'bg-background/60 border-border/70 text-foreground hover:bg-muted/70'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishInput;
