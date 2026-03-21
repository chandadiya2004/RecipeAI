import { motion } from 'framer-motion';

const LoadingState = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* AI indicator */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl mb-4"
          >
            🍳
          </motion.div>
          <h3 className="text-xl font-bold text-foreground mb-2">Cooking up your recipe...</h3>
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 rounded-full gradient-bg"
              />
            ))}
          </div>
        </motion.div>

        {/* Skeleton cards */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-3xl overflow-hidden"
          >
            {i === 1 && <div className="h-56 shimmer" />}
            <div className="p-6 space-y-4">
              <div className="h-6 w-2/5 rounded-lg shimmer" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded-lg shimmer" />
                <div className="h-4 w-4/5 rounded-lg shimmer" />
                <div className="h-4 w-3/5 rounded-lg shimmer" />
              </div>
              {i === 1 && (
                <div className="flex gap-2">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-8 w-24 rounded-full shimmer" />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LoadingState;
