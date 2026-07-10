import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Users, BarChart3, Globe, RefreshCw, CheckCircle2, BookmarkPlus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Recipe } from '@/data/recipes';
import HealthAnalysis from './HealthAnalysis';

interface Props {
  recipe: Recipe;
  onRegenerate: () => void;
}

const GeneratedRecipe = ({ recipe, onRegenerate }: Props) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };

  const statItems = [
    {
      icon: Clock, label: recipe.cookingTime, title: 'Cook Time',
      gradient: 'from-blue-500 to-cyan-400', bg: 'from-blue-500/10 to-cyan-400/5',
      border: 'border-blue-400/30', iconBg: 'bg-blue-500/15', iconColor: 'text-blue-600',
    },
    {
      icon: Users, label: `${recipe.servings || 2} Servings`, title: 'Servings',
      gradient: 'from-emerald-500 to-teal-400', bg: 'from-emerald-500/10 to-teal-400/5',
      border: 'border-emerald-400/30', iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-600',
    },
    {
      icon: BarChart3, label: recipe.difficulty, title: 'Difficulty',
      gradient: 'from-amber-500 to-orange-400', bg: 'from-amber-500/10 to-orange-400/5',
      border: 'border-amber-400/30', iconBg: 'bg-amber-500/15', iconColor: 'text-amber-600',
    },
    {
      icon: Globe, label: `${recipe.cuisineEmoji ?? ''} ${recipe.cuisine}`, title: 'Cuisine',
      gradient: 'from-violet-500 to-purple-400', bg: 'from-violet-500/10 to-purple-400/5',
      border: 'border-violet-400/30', iconBg: 'bg-violet-500/15', iconColor: 'text-violet-600',
    },
  ];

  return (
    <section ref={ref} className="py-4 sm:py-6 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="space-y-5 sm:space-y-6"
      >

        {/* ═══ HERO BANNER ═══════════════════════════════════════════ */}
        <motion.div variants={itemVariants} className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
          {/* Theme gradient base */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(221 83% 45%), hsl(210 90% 50%), hsl(199 89% 42%))' }} />
          {recipe.image && (
            <img
              src={recipe.image} alt={recipe.title}
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous" loading="eager"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/5" />

          <div className="relative z-10 p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold tracking-wider uppercase">
                {recipe.cuisineEmoji} {recipe.cuisine}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold tracking-wider uppercase">
                {recipe.difficulty}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white drop-shadow-xl leading-tight mb-3">
              {recipe.title}
            </h1>
            <div className="text-white/90 text-sm sm:text-base leading-relaxed w-full [&_p]:m-0">
              <ReactMarkdown>{recipe.description}</ReactMarkdown>
            </div>
          </div>
        </motion.div>

        {/* ═══ STAT CARDS ════════════════════════════════════════════ */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.bg} border ${item.border} p-4 sm:p-5 group cursor-default transition-all duration-300 hover:shadow-lg`}
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.gradient} opacity-70 group-hover:opacity-100 transition-opacity`} />
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${item.iconBg} mb-3`}>
                  <Icon className={`w-4.5 h-4.5 ${item.iconColor}`} />
                </div>
                <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1">{item.title}</p>
                <p className="text-sm sm:text-base font-black text-foreground leading-tight">{item.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ═══ INGREDIENTS + STEPS 2-COL ════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5 items-start">

          {/* Ingredients */}
          <motion.div variants={itemVariants} className="rounded-2xl sm:rounded-3xl border border-border/60 overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-base shadow-md flex-shrink-0">🥗</div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Ingredients</h2>
                <p className="text-xs text-foreground/50">{recipe.ingredients.length} items</p>
              </div>
            </div>
            <div className="divide-y divide-border/40">
              {recipe.ingredients.map((ing, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.035 }}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-primary/5 transition-colors duration-150 group"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary/30 group-hover:text-primary flex-shrink-0 transition-colors" />
                  <span className="flex-1 text-sm font-medium text-foreground">{ing.name}</span>
                  <span className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                    {ing.quantity}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Cooking Steps */}
          <motion.div variants={itemVariants} className="rounded-2xl sm:rounded-3xl border border-border/60 overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-base shadow-md flex-shrink-0">👨‍🍳</div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Cooking Steps</h2>
                <p className="text-xs text-foreground/50">{recipe.steps.length} steps</p>
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-2">
              {recipe.steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.38, delay: 0.25 + i * 0.06 }}
                  className="relative flex gap-3 p-3 sm:p-4 rounded-xl hover:bg-muted/40 transition-all duration-200 group"
                >
                  {/* Connector line */}
                  {i < recipe.steps.length - 1 && (
                    <div className="absolute left-[23px] sm:left-[27px] top-[44px] sm:top-[48px] bottom-0 w-px bg-border/50 group-hover:bg-primary/20 transition-colors" />
                  )}
                  {/* Step circle */}
                  <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full gradient-bg flex items-center justify-center text-white font-black text-xs shadow-md z-10">
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="text-[10px] font-black text-primary/50 uppercase tracking-widest mb-1">Step {step.number}</div>
                    <div className="text-sm text-foreground/90 leading-relaxed [&_p]:m-0 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4">
                      <ReactMarkdown>{step.text}</ReactMarkdown>
                    </div>
                  </div>
                  {step.icon && (
                    <div className="flex-shrink-0 text-xl sm:text-2xl opacity-50 group-hover:opacity-90 transition-opacity self-start mt-0.5">
                      {step.icon}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══ HEALTH ANALYSIS ═══════════════════════════════════════ */}
        <HealthAnalysis recipe={recipe} />

        {/* ═══ ACTION BUTTONS ════════════════════════════════════════ */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-1">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRegenerate}
            className="flex items-center justify-center gap-2 px-7 py-3.5 gradient-bg text-white font-bold rounded-2xl shadow-lg hover:shadow-xl glow-primary transition-all duration-300 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate Recipe
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-7 py-3.5 bg-card/80 backdrop-blur-sm font-bold rounded-2xl text-foreground border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 text-sm shadow-sm"
          >
            <BookmarkPlus className="w-4 h-4" />
            Save Recipe
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default GeneratedRecipe;
