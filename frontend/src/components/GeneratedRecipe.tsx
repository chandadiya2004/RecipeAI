import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, BarChart3, Globe, RefreshCw, Bookmark, Share2, Check } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import HealthAnalysis from './HealthAnalysis';

import butterChicken from '@/assets/butter-chicken.jpg';

interface Props {
  recipe: Recipe;
  onRegenerate: () => void;
}

const GeneratedRecipe = ({ recipe, onRegenerate }: Props) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const toggleCheck = (idx: number) => {
    const next = new Set(checkedItems);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setCheckedItems(next);
  };

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl overflow-hidden"
        >
          <div className="relative h-56 sm:h-72 overflow-hidden">
            <img src={butterChicken} alt={recipe.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground leading-tight">{recipe.title}</h2>
              <p className="text-primary-foreground/80 text-sm mt-1">{recipe.description}</p>
            </div>
          </div>

          <div className="p-6 flex flex-wrap gap-3">
            {[
              { icon: <Clock className="w-4 h-4" />, label: recipe.cookingTime },
              { icon: <BarChart3 className="w-4 h-4" />, label: recipe.difficulty },
              { icon: <Globe className="w-4 h-4" />, label: `${recipe.cuisineEmoji} ${recipe.cuisine}` },
            ].map((badge, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-muted text-sm font-medium text-foreground"
              >
                {badge.icon} {badge.label}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Ingredients */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-6 sm:p-8"
        >
          <h3 className="text-lg font-bold text-foreground mb-5">🥗 Ingredients</h3>
          <div className="space-y-1">
            {recipe.ingredients.map((ing, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
                onClick={() => toggleCheck(i)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-150 text-left ${
                  checkedItems.has(i) ? 'bg-accent/50' : 'hover:bg-muted/50'
                }`}
              >
                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  checkedItems.has(i) ? 'border-primary bg-primary' : 'border-border'
                }`}>
                  {checkedItems.has(i) && <Check className="w-3 h-3 text-primary-foreground" />}
                </span>
                <span className={`flex-1 text-sm ${checkedItems.has(i) ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {ing.name}
                </span>
                <span className="text-sm text-muted-foreground">{ing.quantity}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-6 sm:p-8"
        >
          <h3 className="text-lg font-bold text-foreground mb-5">👨‍🍳 Steps</h3>
          <div className="space-y-3">
            {recipe.steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                className="flex gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{step.icon}</span>
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Step {step.number}</span>
                  <p className="text-sm text-foreground mt-1 leading-relaxed">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Health Analysis */}
        <HealthAnalysis recipe={recipe} />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          {[
            { icon: <RefreshCw className="w-4 h-4" />, label: 'Regenerate', onClick: onRegenerate, primary: true },
            { icon: <Bookmark className="w-4 h-4" />, label: 'Save', onClick: () => {}, primary: false },
            { icon: <Share2 className="w-4 h-4" />, label: 'Share', onClick: () => {}, primary: false },
          ].map((btn, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={btn.onClick}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                btn.primary
                  ? 'gradient-bg text-primary-foreground glow-primary'
                  : 'glass glass-hover text-foreground'
              }`}
            >
              {btn.icon} {btn.label}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GeneratedRecipe;
