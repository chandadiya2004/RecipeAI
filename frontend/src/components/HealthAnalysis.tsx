import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Recipe } from '@/data/recipes';
import { Flame, Heart } from 'lucide-react';

interface Props {
  recipe: Recipe;
}

const CircularProgress = ({ value, size = 120, stroke = 10 }: { value: number; size?: number; stroke?: number }) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 75 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444';
  const label = value >= 75 ? 'Great' : value >= 50 ? 'Good' : 'Fair';
  const labelColor = value >= 75 ? 'text-emerald-600' : value >= 50 ? 'text-amber-600' : 'text-red-600';
  const shadowColor = value >= 75 ? 'rgba(34,197,94,0.35)' : value >= 50 ? 'rgba(245,158,11,0.35)' : 'rgba(239,68,68,0.35)';

  return (
    <div className="relative flex flex-col items-center gap-1">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" className="text-muted/50" strokeWidth={stroke} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color}
            strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${shadowColor})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-foreground">{value}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Score</span>
        </div>
      </div>
      <span className={`text-xs font-black uppercase tracking-wider ${labelColor}`}>{label}</span>
    </div>
  );
};

const HealthAnalysis = ({ recipe }: Props) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const tagStyle = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes('protein') || t.includes('healthy') || t.includes('vegan') || t.includes('low') || t.includes('fiber'))
      return 'bg-emerald-500/12 text-emerald-700 border-emerald-400/30';
    if (t.includes('fat') || t.includes('sugar') || t.includes('heavy') || t.includes('high'))
      return 'bg-red-500/12 text-red-700 border-red-400/30';
    return 'bg-amber-500/12 text-amber-700 border-amber-400/30';
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl sm:rounded-3xl border border-border/60 overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-md flex-shrink-0">
          <Heart className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Health Analysis</h2>
          <p className="text-xs text-foreground/50">Nutritional overview</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
        {/* Score ring */}
        <div className="flex-shrink-0">
          <CircularProgress value={recipe.healthScore} size={110} stroke={10} />
        </div>

        {/* Right side */}
        <div className="flex-1 space-y-4 w-full">
          {/* Calories */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/8 border border-orange-400/20">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center flex-shrink-0">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Calories per serving</p>
              <p className="text-lg font-black text-foreground leading-none">{recipe.calories} <span className="text-sm font-semibold text-foreground/60">kcal</span></p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2.5">Diet Tags</p>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border ${tagStyle(tag)} transition-all duration-200 hover:shadow-sm`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HealthAnalysis;
