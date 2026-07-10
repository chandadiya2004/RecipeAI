import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface IngredientInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
}

const tagColors = [
  { bg: 'bg-primary/15', text: 'text-primary', border: 'border-primary/30', dot: 'bg-primary' },
  { bg: 'bg-emerald-500/15', text: 'text-emerald-700', border: 'border-emerald-400/30', dot: 'bg-emerald-500' },
  { bg: 'bg-amber-500/15', text: 'text-amber-700', border: 'border-amber-400/30', dot: 'bg-amber-500' },
  { bg: 'bg-violet-500/15', text: 'text-violet-700', border: 'border-violet-400/30', dot: 'bg-violet-500' },
  { bg: 'bg-red-500/15', text: 'text-red-700', border: 'border-red-400/30', dot: 'bg-red-500' },
  { bg: 'bg-cyan-500/15', text: 'text-cyan-700', border: 'border-cyan-400/30', dot: 'bg-cyan-500' },
];

const IngredientInput = ({ ingredients, onChange }: IngredientInputProps) => {
  const [value, setValue] = useState('');

  const addIngredient = () => {
    const trimmed = value.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      onChange([...ingredients, trimmed]);
      setValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
    if (e.key === 'Backspace' && value === '' && ingredients.length > 0) {
      onChange(ingredients.slice(0, -1));
    }
  };

  const remove = (idx: number) => onChange(ingredients.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Ingredients</label>
        {ingredients.length > 0 && (
          <span className="text-[10px] font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
            {ingredients.length} added
          </span>
        )}
      </div>

      <div className={`flex flex-wrap gap-2 p-3.5 rounded-2xl bg-background/50 border border-border/80 min-h-[60px]
        focus-within:ring-2 focus-within:ring-primary/25 focus-within:border-primary/50 transition-all duration-300 backdrop-blur-md`}>
        <AnimatePresence mode="popLayout">
          {ingredients.map((ing, i) => {
            const color = tagColors[i % tagColors.length];
            return (
              <motion.span
                key={ing}
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.75, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border ${color.bg} ${color.text} ${color.border} cursor-default`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${color.dot} opacity-80`} />
                {ing}
                <button
                  onClick={() => remove(i)}
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors ml-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </motion.span>
            );
          })}
        </AnimatePresence>

        <div className="flex items-center gap-1.5 flex-1 min-w-[140px]">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={ingredients.length === 0 ? 'Type ingredient, press Enter…' : 'Add more…'}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/50 min-w-0"
          />
          <AnimatePresence>
            {value.trim() && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={addIngredient}
                className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/60 pl-1">Press <kbd className="font-mono bg-muted/60 px-1 rounded text-[10px]">Enter</kbd> or comma to add · <kbd className="font-mono bg-muted/60 px-1 rounded text-[10px]">Backspace</kbd> to remove last</p>
    </div>
  );
};

export default IngredientInput;
