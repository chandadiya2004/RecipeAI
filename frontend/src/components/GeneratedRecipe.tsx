import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Users, BarChart3, Globe, RefreshCw } from 'lucide-react';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section ref={ref} className="py-2 sm:py-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="space-y-8 sm:space-y-10"
      >
        {/* ===== HERO IMAGE SECTION ===== */}
        <motion.div variants={itemVariants} className="relative h-96 sm:h-[500px] rounded-3xl overflow-hidden group">
          {/* Image */}
          {recipe.image && (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              crossOrigin="anonymous"
              loading="eager"
            />
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-xl mb-2 leading-tight text-balance">
              {recipe.title}
            </h1>
            <div className="text-white/95 text-base sm:text-lg font-medium drop-shadow-lg leading-relaxed max-w-2xl [&_p]:m-0">
              <ReactMarkdown>{recipe.description}</ReactMarkdown>
            </div>
          </div>
        </motion.div>

        {/* ===== INFO PILLS SECTION ===== */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            { icon: Clock, label: recipe.cookingTime, title: 'Cooking Time' },
            { icon: Users, label: `${recipe.servings || 2} Servings`, title: 'Servings' },
            { icon: BarChart3, label: recipe.difficulty, title: 'Difficulty' },
            { icon: Globe, label: `${recipe.cuisineEmoji} ${recipe.cuisine}`, title: 'Cuisine' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ translateY: -4 }}
                className="glass rounded-2xl p-4 sm:p-5 border border-border/50 text-center group hover:border-primary/50 transition-all duration-300"
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                <p className="text-xs sm:text-sm font-bold text-foreground/70 uppercase tracking-wider mb-1">
                  {item.title}
                </p>
                <p className="text-sm sm:text-lg font-bold text-foreground">
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===== INGREDIENTS SECTION ===== */}
        <motion.div variants={itemVariants} className="glass rounded-3xl p-6 sm:p-10 border-2 border-border/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-2xl shadow-lg">
              🥗
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Ingredients</h2>
              <p className="text-sm text-foreground/60">Everything you need</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {recipe.ingredients.map((ing, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="w-3 h-3 rounded-full gradient-bg flex-shrink-0 group-hover:w-4 group-hover:h-4 transition-all duration-300" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm sm:text-base">{ing.name}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-bold px-3 py-1 rounded-lg bg-primary/10 text-primary whitespace-nowrap">
                    {ing.quantity}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ===== COOKING STEPS SECTION ===== */}
        <motion.div variants={itemVariants} className="glass rounded-3xl p-6 sm:p-10 border-2 border-border/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-2xl shadow-lg">
              👨‍🍳
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Cooking Steps</h2>
              <p className="text-sm text-foreground/60">Follow these instructions carefully</p>
            </div>
          </div>

          <div className="space-y-4">
            {recipe.steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl p-6 sm:p-7 bg-gradient-to-r from-muted/40 to-transparent border border-border/30 hover:border-primary/40 transition-all duration-300"
              >
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex gap-4 sm:gap-6">
                  {/* Step number circle */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full gradient-bg flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                      {step.number}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-xs font-black text-primary/70 uppercase tracking-widest mb-1.5 block">
                      Step {step.number}
                    </span>
                    <div className="text-sm sm:text-base text-foreground leading-relaxed [&_p]:m-0 [&_strong]:font-extrabold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 space-y-2">
                      <ReactMarkdown>{step.text}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 text-4xl sm:text-5xl opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    {step.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ===== HEALTH ANALYSIS SECTION ===== */}
        <HealthAnalysis recipe={recipe} />

        {/* ===== ACTION BUTTONS ===== */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRegenerate}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-4 gradient-bg text-primary-foreground font-bold rounded-2xl transition-all duration-300 glow-primary hover:shadow-xl"
          >
            <RefreshCw className="w-5 h-5" />
            Regenerate Recipe
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 sm:flex-initial glass px-8 py-4 font-bold rounded-2xl text-foreground border border-border/50 hover:border-primary/50 transition-all duration-300"
          >
            💾 Save Recipe
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default GeneratedRecipe;
