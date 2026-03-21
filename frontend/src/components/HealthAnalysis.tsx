import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Recipe } from '@/data/recipes';

interface Props {
  recipe: Recipe;
}

const CircularProgress = ({ value, size = 100, stroke = 8 }: { value: number; size?: number; stroke?: number }) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const color = value >= 70 ? 'hsl(160 60% 45%)' : value >= 40 ? 'hsl(40 95% 50%)' : 'hsl(0 70% 55%)';

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(210 20% 93%)" strokeWidth={stroke} />
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
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
};

const HealthAnalysis = ({ recipe }: Props) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const tagColor = (tag: string) => {
    if (tag.includes('Protein')) return 'bg-[hsl(270_70%_95%)] text-[hsl(270_70%_40%)]';
    if (tag.includes('Gluten')) return 'bg-[hsl(160_50%_92%)] text-[hsl(160_50%_30%)]';
    return 'bg-[hsl(40_90%_92%)] text-[hsl(40_80%_35%)]';
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-3xl p-6 sm:p-8"
    >
      <h3 className="text-lg font-bold text-foreground mb-6">🔬 Health Analysis</h3>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Circular score */}
        <div className="relative flex-shrink-0">
          <CircularProgress value={recipe.healthScore} size={120} stroke={10} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{recipe.healthScore}</span>
            <span className="text-xs text-muted-foreground">Score</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {/* Calories */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-sm text-muted-foreground">Calories per serving</p>
              <p className="text-xl font-bold text-foreground">{recipe.calories} kcal</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${tagColor(tag)}`}
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
