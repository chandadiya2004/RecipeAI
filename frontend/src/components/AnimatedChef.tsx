import { motion } from 'framer-motion';
import { ChefHat, Sparkles } from 'lucide-react';

const ingredients = [
  { emoji: '🍅', label: 'Tomato', color: 'bg-red-500/20 text-red-500', delay: 0 },
  { emoji: '🌿', label: 'Basil', color: 'bg-green-500/20 text-green-500', delay: 0.2 },
  { emoji: '🧀', label: 'Cheese', color: 'bg-yellow-500/20 text-yellow-600', delay: 0.4 },
  { emoji: '🥩', label: 'Meat', color: 'bg-orange-500/20 text-orange-600', delay: 0.6 },
  { emoji: '🧄', label: 'Garlic', color: 'bg-stone-500/20 text-stone-600', delay: 0.8 },
];

const AnimatedChef = () => {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center">
      {/* Background Glowing Aura */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-orange-400/30 rounded-full blur-3xl -z-10"
      />

      {/* Main Container / The Pot */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 z-10 flex items-center justify-center">
        
        {/* The Magic Cooking Pot Core */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-40 h-40 sm:w-52 sm:h-52 bg-card rounded-[2.5rem] shadow-2xl border-4 border-primary/20 flex flex-col items-center justify-center z-20 group cursor-pointer overflow-hidden backdrop-blur-xl"
        >
          {/* Inner liquid/glow animation */}
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ rotate: { duration: 10, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
            className="absolute -bottom-10 w-[200%] h-[200%] bg-gradient-to-t from-primary/40 to-transparent opacity-50 blur-lg rounded-full"
          />

          <ChefHat className="w-16 h-16 sm:w-20 sm:h-20 text-primary mb-2 drop-shadow-md group-hover:scale-110 transition-transform duration-300 relative z-10" />
          <span className="font-black text-foreground tracking-widest uppercase text-sm relative z-10">AI Chef</span>
          
          {/* Sparks coming out of the pot */}
          <motion.div
            animate={{ opacity: [0, 1, 0], y: [-10, -30], scale: [0.5, 1.2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.2 }}
            className="absolute top-4 left-1/4"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0, 1, 0], y: [-10, -40], scale: [0.5, 1.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
            className="absolute top-8 right-1/4"
          >
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </motion.div>
        </motion.div>

        {/* Orbiting / Flying Ingredients */}
        {ingredients.map((item, i) => {
          const angle = (i / ingredients.length) * Math.PI * 2;
          const radius = typeof window !== 'undefined' && window.innerWidth < 640 ? 100 : 140; // Auto radius
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={item.label}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={{ 
                x: [0, x * 1.2, x], 
                y: [0, y * 1.2, y], 
                scale: [0.5, 1.2, 1], 
                opacity: [0, 1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 4,
                delay: item.delay,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.3, zIndex: 50 }}
              className={`absolute flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-xl border-2 border-border/80 backdrop-blur-md cursor-pointer ${item.color} z-10`}
            >
              <span className="text-3xl filter drop-shadow-sm">{item.emoji}</span>
            </motion.div>
          );
        })}

        {/* Floating recipe cards */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-4 sm:-left-12 top-0 bg-background/80 backdrop-blur-md border border-border p-3 sm:p-4 rounded-2xl shadow-xl z-0"
        >
          <div className="w-16 sm:w-20 h-2 sm:h-3 rounded-full bg-muted-foreground/20 mb-2" />
          <div className="w-12 sm:w-16 h-2 sm:h-3 rounded-full bg-primary/40 mb-2" />
          <div className="w-14 sm:w-18 h-2 sm:h-3 rounded-full bg-muted-foreground/20" />
        </motion.div>

        <motion.div
          animate={{ y: [10, -10, 10], rotate: [2, -2, 2] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -right-4 sm:-right-8 bottom-0 bg-background/80 backdrop-blur-md border border-border p-3 sm:p-4 rounded-2xl shadow-xl z-0 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-orange-400/20 flex items-center justify-center text-lg">🍝</div>
          <div>
            <div className="w-12 h-2 rounded-full bg-foreground/60 mb-2" />
            <div className="w-8 h-2 rounded-full bg-muted-foreground/40" />
          </div>
        </motion.div>

      </div>

      {/* Interactive Tag */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <span className="bg-background/90 backdrop-blur-xl px-5 py-2 rounded-full text-xs font-black text-primary uppercase tracking-widest border-2 border-primary/20 shadow-[0_0_15px_hsl(140_60%_40%_/_0.2)]">
          Interactive UI &bull; Hover to explore
        </span>
      </div>
    </div>
  );
};

export default AnimatedChef;
