import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface Props {
  onSearch: (dishName: string) => void;
  isLoading: boolean;
}

const DishInput = ({ onSearch, isLoading }: Props) => {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim() && !isLoading) {
      onSearch(value.trim());
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
          onClick={() => value.trim() && onSearch(value.trim())}
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
    </div>
  );
};

export default DishInput;
