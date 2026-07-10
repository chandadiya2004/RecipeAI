import { type ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { MessageSquare, ChefHat, ShoppingBasket, Clock, Activity, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface ActivityHistoryItem {
  id: number;
  activity_type: string;
  endpoint: string;
  status: string;
  request_payload?: Record<string, unknown> | null;
  error_message?: string | null;
  created_at: string;
}

type HistorySection = 'pantry' | 'dish';

const getString = (value: unknown): string | null => (typeof value === 'string' ? value : null);

const getSource = (item: ActivityHistoryItem): string | null => {
  if (!item.request_payload) return null;
  return getString(item.request_payload.source);
};

const getSection = (item: ActivityHistoryItem): HistorySection => {
  const source = getSource(item);

  if (source?.includes('pantry')) return 'pantry';
  if (source?.includes('dish')) return 'dish';

  if (item.activity_type === 'chat') return 'dish';

  const ingredients = item.request_payload?.ingredients;
  if (Array.isArray(ingredients) && ingredients.length > 0) return 'pantry';

  return 'dish';
};

const statusClasses: Record<string, string> = {
  success: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  failed: 'bg-destructive/10 text-destructive border-destructive/30',
  blocked: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
};

const Pill = ({ children }: { children: ReactNode }) => (
  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted/70 border border-border/70 text-foreground/90">
    {children}
  </span>
);

const renderDetails = (item: ActivityHistoryItem) => {
  const payload = item.request_payload ?? {};
  const section = getSection(item);
  const ingredients = Array.isArray(payload.ingredients) ? (payload.ingredients as unknown[]) : [];
  const restrictions = Array.isArray(payload.dietary_restrictions) ? (payload.dietary_restrictions as unknown[]) : [];

  if (item.activity_type === 'chat') {
    return (
      <div className="mt-4 rounded-xl border border-border/70 bg-muted/30 p-3">
        <div className="flex flex-wrap gap-2">
          <Pill>Messages: {String(payload.message_count ?? 0)}</Pill>
          <Pill>Recipe context: {payload.has_context ? 'Yes' : 'No'}</Pill>
        </div>
      </div>
    );
  }

  if (section === 'pantry') {
    return (
      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {payload.cuisine && <Pill>Cuisine: {String(payload.cuisine)}</Pill>}
          {payload.servings && <Pill>Servings: {String(payload.servings)}</Pill>}
          {ingredients.length > 0 && <Pill>Ingredients: {ingredients.length}</Pill>}
        </div>

        {ingredients.length > 0 && (
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Ingredients Used</div>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <span
                  key={`${String(ingredient)}-${index}`}
                  className="text-xs px-2 py-1 rounded-md bg-background border border-border/70"
                >
                  {String(ingredient)}
                </span>
              ))}
            </div>
          </div>
        )}

        {restrictions.length > 0 && (
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Dietary Preferences</div>
            <div className="flex flex-wrap gap-2">
              {restrictions.map((restriction, index) => (
                <span
                  key={`${String(restriction)}-${index}`}
                  className="text-xs px-2 py-1 rounded-md bg-background border border-border/70"
                >
                  {String(restriction)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-border/70 bg-muted/30 p-3">
      <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Dish Request</div>
      <div className="text-sm font-medium text-foreground">{String(payload.dish_name || 'Custom dish')}</div>
    </div>
  );
};

const getActivityIcon = (item: ActivityHistoryItem, section: HistorySection) => {
  if (item.activity_type === 'chat') return <MessageSquare className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" />;
  if (section === 'pantry') return <ShoppingBasket className="w-6 h-6 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />;
  return <ChefHat className="w-6 h-6 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />;
};

const getStatusIcon = (status: string) => {
  if (status === 'success') return <CheckCircle2 className="w-3.5 h-3.5" />;
  if (status === 'failed') return <XCircle className="w-3.5 h-3.5" />;
  if (status === 'blocked') return <AlertCircle className="w-3.5 h-3.5" />;
  return <Activity className="w-3.5 h-3.5" />;
};

const ActivityCard = ({ item }: { item: ActivityHistoryItem }) => {
  const payload = item.request_payload ?? {};
  const section = getSection(item);
  const title =
    item.activity_type === 'chat'
      ? 'AI Sous-Chef Chat'
      : getString(payload.dish_name) || (section === 'pantry' ? 'Pantry Recipe Request' : 'Dish Recipe Request');

  return (
    <div className="glass glass-hover rounded-2xl p-4 sm:p-5 transition-all duration-300 relative overflow-hidden group border-border/50">
      {/* Subtle background glow effect based on status */}
      <div className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 bg-gradient-to-r ${
        item.status === 'success' ? 'from-emerald-500/10 via-transparent to-transparent' :
        item.status === 'failed' ? 'from-destructive/10 via-transparent to-transparent' :
        item.status === 'blocked' ? 'from-amber-500/10 via-transparent to-transparent' :
        'from-primary/10 via-transparent to-transparent'
      }`} />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 rounded-2xl glass border-border/50 group-hover:scale-110 transition-transform duration-300 shadow-sm flex-shrink-0">
            {getActivityIcon(item, section)}
          </div>
          <div className="space-y-1.5 w-full">
            <h3 className="font-bold text-foreground text-base sm:text-lg tracking-tight group-hover:text-primary transition-colors">{title}</h3>
            
            <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-md border border-border/50">
                <Clock className="w-3.5 h-3.5 opacity-70" />
                {new Date(item.created_at).toLocaleString()}
              </span>
              <span
                className={`flex items-center gap-1 uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${statusClasses[item.status] || 'bg-muted text-foreground border-border'}`}
              >
                {getStatusIcon(item.status)}
                {item.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {item.error_message && (
        <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2 text-sm text-destructive font-medium">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{item.error_message}</p>
        </div>
      )}
      
      <div className="mt-3 pl-0 sm:pl-[60px]">
        {renderDetails(item)}
      </div>
    </div>
  );
};

const HistorySectionBlock = ({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: ActivityHistoryItem[];
}) => (
  <section className="glass rounded-3xl p-5 sm:p-6 border border-border/70">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <span className="text-xs font-semibold bg-muted px-3 py-1 rounded-full border border-border/60 w-fit">
        {items.length} entries
      </span>
    </div>

    {items.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
        No activity in this section yet.
      </div>
    ) : (
      <div className="space-y-3">
        {items.map((item) => (
          <ActivityCard key={item.id} item={item} />
        ))}
      </div>
    )}
  </section>
);

const History = () => {
  const { getAccessToken } = useAuth();
  const [items, setItems] = useState<ActivityHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/activity-history?limit=100`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error('Unable to load activity history');
      }

      const payload = await response.json();
      setItems(payload.items ?? []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [getAccessToken]);

  const handleClearHistory = async () => {
    const confirmed = window.confirm('Clear all your history entries? This cannot be undone.');
    if (!confirmed || isClearing) return;

    setIsClearing(true);
    setError(null);

    try {
      const token = await getAccessToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/activity-history`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error('Unable to clear history');
      }

      await loadHistory();
    } catch (clearError) {
      setError(clearError instanceof Error ? clearError.message : 'Unable to clear history');
    } finally {
      setIsClearing(false);
    }
  };

  const pantryItems = items.filter((item) => getSection(item) === 'pantry');
  const dishItems = items.filter((item) => getSection(item) === 'dish');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Your <span className="gradient-text">Activity History</span>
            </h1>
            <p className="text-muted-foreground">Organized by Pantry Chef and Dish Generator.</p>
          </div>
          <button
            onClick={handleClearHistory}
            disabled={isClearing || isLoading || items.length === 0}
            className="px-4 py-2.5 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-destructive/15 transition-colors"
          >
            {isClearing ? 'Clearing...' : 'Clear History'}
          </button>
        </div>

        {isLoading && (
          <div className="glass rounded-2xl p-6 text-muted-foreground">Loading history...</div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="glass rounded-2xl p-6 text-muted-foreground">
            No activity yet. Generate a recipe or chat with AI and it will appear here.
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="space-y-6">
            <HistorySectionBlock
              title="Pantry Chef"
              subtitle="Ingredient-first recipe generation history"
              items={pantryItems}
            />
            <HistorySectionBlock
              title="Dish Generator"
              subtitle="Dish-based generation and related assistant activity"
              items={dishItems}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default History;