import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { suggestedRecipes } from '@/data/recipes';

import butterChicken from '@/assets/butter-chicken.jpg';
import pastaAlfredo from '@/assets/pasta-alfredo.jpg';
import vegFriedRice from '@/assets/veg-fried-rice.jpg';
import tacos from '@/assets/tacos.jpg';
import saladBowl from '@/assets/salad-bowl.jpg';

const imageMap: Record<string, string> = {
  'butter-chicken': butterChicken,
  'pasta-alfredo': pastaAlfredo,
  'veg-fried-rice': vegFriedRice,
  'tacos': tacos,
  'salad-bowl': saladBowl,
};

interface Props {
  onSelectRecipe: (id: string) => void;
}

const SuggestedRecipes = ({ onSelectRecipe }: Props) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Popular Recipes ✨
          </h2>
          <p className="mt-2 text-muted-foreground">Get inspired by trending dishes</p>
        </motion.div>

        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
          {suggestedRecipes.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="snap-start flex-shrink-0 w-[280px] group"
            >
              <div className="glass rounded-3xl overflow-hidden glass-hover transition-all duration-300 group-hover:-translate-y-1">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={imageMap[recipe.image]}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 glass rounded-full px-2.5 py-1 text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {recipe.cookingTime}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{recipe.cuisineEmoji}</span>
                    <span className="text-xs text-muted-foreground font-medium">{recipe.cuisine}</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{recipe.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{recipe.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectRecipe(recipe.id)}
                    className="w-full py-2.5 rounded-full border border-primary/20 text-primary text-sm font-medium flex items-center justify-center gap-1 hover:bg-primary/5 transition-colors duration-200"
                  >
                    View Recipe <ChevronRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuggestedRecipes;
