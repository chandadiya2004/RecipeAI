import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, BarChart3, Globe, RefreshCw, Bookmark, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Recipe } from '@/data/recipes';
import HealthAnalysis from './HealthAnalysis';

interface Props {
  recipe: Recipe;
  onRegenerate: () => void;
}

const GeneratedRecipe = ({ recipe, onRegenerate }: Props) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-10 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl overflow-hidden"
        >
          <div className="relative min-h-[170px] sm:min-h-[280px] overflow-hidden gradient-bg flex flex-col justify-end px-4 sm:px-8 py-3 sm:py-7">
            {/* Overlay always on top of the gradient or image */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-10" />

            {/* Only render img when we have a valid URL — avoids broken placeholder */}
            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 hover:scale-105"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                crossOrigin="anonymous"
                loading="eager"
              />
            )}

            <div className="relative z-20 w-full max-w-2xl">
              <h2 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg pb-1.5 sm:pb-3 text-balance">
                {recipe.title}
              </h2>
              <div className="text-white/90 text-xs sm:text-base font-medium drop-shadow-md leading-relaxed [display:-webkit-box] [-webkit-line-clamp:4] sm:[-webkit-line-clamp:5] [-webkit-box-orient:vertical] overflow-hidden [&_p]:m-0 [&_strong]:font-extrabold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
                <ReactMarkdown>{recipe.description}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="p-3.5 sm:p-6 flex flex-wrap gap-2 sm:gap-4">
            {[
              { icon: <Clock className="w-4 h-4 text-primary" />, label: recipe.cookingTime },
              { icon: <BarChart3 className="w-4 h-4 text-primary" />, label: recipe.difficulty },
              { icon: <Globe className="w-4 h-4 text-primary" />, label: `${recipe.cuisineEmoji} ${recipe.cuisine}` },
            ].map((badge, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-muted/30 border border-border/50 text-xs sm:text-sm font-bold tracking-wide text-foreground shadow-sm backdrop-blur-md"
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
          className="glass rounded-3xl p-5 sm:p-8 border-2 border-border/80 shadow-lg bg-gradient-to-br from-background/40 to-muted/20"
        >
          <h3 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <span className="p-2 gradient-bg rounded-lg text-white shadow-md">🥗</span> Ingredients
          </h3>
          <div className="space-y-1.5">
            {recipe.ingredients.map((ing, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
                className="flex items-center gap-3 sm:gap-4 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors duration-200"
              >
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex-shrink-0" />
                <span className="flex-1 text-sm sm:text-base text-foreground font-medium">{ing.name}</span>
                <span className="text-xs sm:text-sm font-bold text-primary bg-primary/8 px-2.5 py-0.5 rounded-lg">{ing.quantity}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-5 sm:p-8 border-2 border-border/80 shadow-lg bg-gradient-to-br from-background/40 to-muted/20"
        >
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="p-2 gradient-bg rounded-lg text-white shadow-md">👨‍🍳</span> Steps
          </h3>
          <div className="space-y-4">
            {recipe.steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                className="group flex gap-3 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-border/60 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform origin-top scale-y-0 group-hover:scale-y-100" />
                <span className="text-2xl sm:text-3xl flex-shrink-0 mt-1 drop-shadow-sm">{step.icon}</span>
                <div className="flex-1">
                  <span className="text-xs font-black text-primary/80 uppercase tracking-widest mb-1.5 block">Step {step.number}</span>
                  <div className="text-sm sm:text-base text-foreground font-medium leading-relaxed [&_p]:m-0 [&_strong]:font-extrabold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
                    <ReactMarkdown>{step.text}</ReactMarkdown>
                  </div>
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
              className={`w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
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
