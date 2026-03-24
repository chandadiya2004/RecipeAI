import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, ChefHat, HeartPulse, ShieldCheck, Sparkles, Timer, Users } from 'lucide-react';

const dishGallery = [
  { src: '/breakfast.jpg', title: 'Breakfast Bowl', category: 'Morning Fuel' },
  { src: '/burger.jpeg', title: 'Gourmet Burger', category: 'Quick Lunch' },
  { src: '/chicken lolipop.jpeg', title: 'Chicken Lollipop', category: 'Party Favorite' },
  { src: '/prawn chowmin.jpeg', title: 'Prawn Chowmein', category: 'Street Style' },
  { src: '/snacks.jpeg', title: 'Healthy Snacks', category: 'Evening Bite' },
  { src: '/soup.jpeg', title: 'Comfort Soup', category: 'Warm & Light' },
  { src: '/steam momo.jpeg', title: 'Steamed Momos', category: 'Popular Pick' },
  { src: '/biriyani.jpeg', title: 'Royal Biryani', category: 'Main Course' },
  { src: '/pasta.jpeg', title: 'Creamy Pasta', category: 'Italian Classic' },
  { src: '/pastry cake.jpeg', title: 'Pastry Cake', category: 'Dessert' },
];

const valueBlocks = [
  {
    icon: <Timer className="w-5 h-5 text-primary" />,
    title: 'Fast output, practical recipes',
    text: 'Get full structured recipes in seconds, including ingredients, steps, and nutrition context so you can start cooking right away.',
  },
  {
    icon: <HeartPulse className="w-5 h-5 text-primary" />,
    title: 'Health-aware by design',
    text: 'Each recipe includes health score and calorie estimates, helping you make better daily food choices without extra planning.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    title: 'Reliable authenticated experience',
    text: 'Your core tools are protected and personalized, giving every user a secure and focused AI cooking workspace.',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Tell us your context',
    text: 'Either enter available ingredients or a specific dish name. You can also set servings and preferred difficulty before generating.',
  },
  {
    step: '02',
    title: 'Generate with AI precision',
    text: 'RecipeAI creates a complete result with clean sections: title, description, ingredient quantities, step-by-step method, and difficulty level.',
  },
  {
    step: '03',
    title: 'Cook confidently with support',
    text: 'Use the integrated AI Sous-Chef to ask substitutions, technique questions, or quick fixes while cooking in real time.',
  },
];

const authPath = '/auth?mode=signin';

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 sm:pt-28 pb-14 sm:pb-20 px-4 sm:px-6">
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-10 items-stretch">
          <div className="glass rounded-3xl border border-border/70 p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Smart Recipe Assistant
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-balance">
              Smarter cooking starts with better guidance.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              RecipeAI combines speed, clarity, and consistency to turn meal decisions into a streamlined workflow. Whether you are reducing food waste from fridge leftovers or generating a dish from pure craving, the system delivers practical, well-structured recipes with measurable health context.
            </p>

            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              The experience is intentionally clean and practical: focused interactions, structured output, and secure access. You get intelligent generation, chat assistance, and activity continuity in one polished workspace.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to={authPath} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-12 px-6 rounded-xl gradient-bg text-white font-bold inline-flex items-center justify-center gap-2.5 shadow-md hover:opacity-95 transition-opacity">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <Link to={authPath} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-12 px-6 rounded-xl border border-border/70 bg-background text-foreground font-bold inline-flex items-center justify-center gap-2.5 hover:bg-muted/60 transition-colors">
                  <ChefHat className="w-4 h-4 text-primary" />
                  Explore Features
                </button>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                <p className="text-xl font-black">10K+</p>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Recipes Generated</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                <p className="text-xl font-black">3s</p>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Average Generation</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                <p className="text-xl font-black">98%</p>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">User Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-border/70 shadow-lg bg-muted/30">
            <Link to={authPath} className="block h-full group">
              <img
                src="/biriyani.jpeg"
                alt="Delicious biryani plated professionally"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute" />
            </Link>
          </div>
        </section>

        <section className="max-w-7xl mx-auto mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {valueBlocks.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border/70 bg-background/70 p-5">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 mb-3">
                {item.icon}
              </div>
              <h3 className="text-lg font-extrabold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="max-w-7xl mx-auto mt-14 sm:mt-16">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Recipe Gallery</h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Click any image to continue to Sign In / Sign Up and start generating.
              </p>
            </div>
            <Link to={authPath} className="text-sm font-bold text-primary inline-flex items-center gap-1.5 hover:underline">
              Open authentication
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {dishGallery.map((dish) => (
              <Link
                to={authPath}
                key={dish.title}
                className="group relative rounded-2xl overflow-hidden border border-border/70 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={dish.src}
                  alt={dish.title}
                  className="w-full h-40 sm:h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold">{dish.category}</p>
                  <p className="text-sm text-white font-extrabold leading-tight">{dish.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto mt-14 sm:mt-16 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 sm:gap-8">
          <div className="glass rounded-3xl border border-border/70 p-6 sm:p-8">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">How the platform works</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
              The workflow is intentionally simple so anyone can move from idea to execution quickly.
            </p>

            <div className="mt-6 space-y-4">
              {processSteps.map((item) => (
                <div key={item.step} className="rounded-2xl border border-border/70 bg-background/70 p-4 sm:p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg gradient-bg text-white text-xs font-black">
                      {item.step}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-gradient-to-br from-primary/15 to-muted/30 p-6 sm:p-8">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Why it feels production-grade</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              This frontend is designed to feel like a mature company product: clear content hierarchy, strong typography, controlled spacing, and action-focused components. Combined with authenticated flows and structured API responses, the user journey remains clean from discovery to recipe execution.
            </p>

            <div className="mt-6 space-y-3.5">
              {[
                'Focused interaction model with minimal friction between search and generation.',
                'Content-rich cards and sections for trust, clarity, and user confidence.',
                'Performance-oriented image handling using compressed assets and lazy loading.',
                'Consistent call-to-action paths that route users to authentication first.',
              ].map((line) => (
                <div key={line} className="flex items-start gap-2.5">
                  <BadgeCheck className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">{line}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-border/70 bg-background/70 p-4 sm:p-5">
              <div className="flex items-center gap-2.5 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <p className="font-bold">Ready for your first generation?</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Create an account or sign in to unlock Pantry Chef, Dish Generator, AI Chat, and your personalized activity history.
              </p>
              <Link to={authPath} className="inline-flex mt-4">
                <button className="h-11 px-5 rounded-xl gradient-bg text-white font-bold inline-flex items-center gap-2">
                  Continue to Sign In / Sign Up
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
