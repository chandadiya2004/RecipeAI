import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Recipe } from '@/data/recipes';

interface Props {
  recipe: Recipe;
}

const CircularProgress = ({ value, size = 130, stroke = 12 }: { value: number; size?: number; stroke?: number }) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const color = value >= 75 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444';
  const shadowColor = value >= 75 ? 'rgba(34, 197, 94, 0.4)' : value >= 50 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)';

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-xl z-10">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" className="text-muted/60" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${shadowColor})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className="text-3xl font-black text-foreground drop-shadow-sm">{value}</span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Score</span>
      </div>
    </div>
  );
};

const HealthAnalysis = ({ recipe }: Props) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const tagColor = (tag: string) => {
    const lTag = tag.toLowerCase();
    if (lTag.includes('protein') || lTag.includes('healthy') || lTag.includes('vegan') || lTag.includes('low')) {
      return 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30';
    }
    if (lTag.includes('fat') || lTag.includes('carb') || lTag.includes('sugar') || lTag.includes('heavy') || lTag.includes('high')) {
      return 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30';
    }
    return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'; // Moderate default
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-3xl p-5 sm:p-8 border-2 border-border/80 shadow-lg bg-gradient-to-br from-background/40 to-muted/20"
    >
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-5 sm:mb-8 flex items-center gap-2">
        <span className="p-2 gradient-bg rounded-lg text-white shadow-md">🔬</span> 
        Health Analysis
      </h3>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
        {/* Circular score */}
        <div className="relative flex-shrink-0">
          <div className="sm:hidden">
            <CircularProgress value={recipe.healthScore} size={108} stroke={10} />
          </div>
          <div className="hidden sm:block">
            <CircularProgress value={recipe.healthScore} />
          </div>
        </div>

        <div className="flex-1 space-y-3 sm:space-y-4 w-full">
          {/* Calories */}
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <span className="text-xl sm:text-2xl">🔥</span>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Calories per serving</p>
              <p className="text-lg sm:text-xl font-bold text-foreground">{recipe.calories} kcal</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3 sm:mt-4 justify-center sm:justify-start">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold border transition-all duration-300 hover:shadow-md ${tagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HealthAnalysis;
