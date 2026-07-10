import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChefHat, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/context/AuthContext';
import { Recipe } from '@/data/recipes';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatbotPanelProps {
  currentRecipe?: Recipe | null;
}

const ChatbotPanel = ({ currentRecipe }: ChatbotPanelProps) => {
  const { getAccessToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your **AI Sous-Chef** 👨‍🍳\n\nAsk me anything about this recipe — substitutions, tips, modifications, or cooking techniques!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input.trim(), timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const token = await getAccessToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: newMessages.filter((m) => m.role !== 'system'),
          context: currentRecipe || null,
          source: 'dish_generator_chat',
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch chat');
      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.response, timestamp: new Date() }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again!", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const quickSuggestions = [
    '🔄 Substitutions?',
    '🌱 Make it vegan',
    '⏱️ Faster method?',
    '🌶️ Less spicy?',
  ];

  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-xl">

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className="relative flex-shrink-0 overflow-hidden">
        {/* Gradient background — matches app theme */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(221 83% 45%), hsl(210 90% 50%), hsl(199 89% 42%))' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/15" />
        {/* Animated sparkle dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/40"
              style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 30}%` }}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        <div className="relative z-10 px-4 py-3.5 flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg">
            <ChefHat className="w-5 h-5 text-white" />
          </div>

          {/* Title + status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-bold text-white text-sm leading-none">AI Sous-Chef</span>
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </div>
            <div className="flex items-center gap-1.5">
              <motion.span
                className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_6px_#4ade80]"
                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white/70 text-xs">Always online · Expert chef AI</span>
            </div>
          </div>


        </div>
      </div>

      {/* ── MESSAGES AREA ────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-3 scrollbar-hide">

        {/* Quick suggestions (shown only at start) */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap gap-2 pb-1"
            >
              {quickSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s.replace(/^[^\w]+/, '').trim()); inputRef.current?.focus(); }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20 hover:border-primary/50 transition-all duration-200 active:scale-95"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, type: 'spring', stiffness: 260, damping: 24 }}
            className={`flex w-full gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Bot avatar */}
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <ChefHat className="w-3.5 h-3.5 text-white" />
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white rounded-tr-sm shadow-[0_4px_14px_rgba(168,85,247,0.3)]'
                  : 'bg-muted/60 text-foreground rounded-tl-sm border border-border/60 backdrop-blur-sm'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="text-sm leading-relaxed [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-4 [&_ol]:pl-4 [&_li]:mb-0.5 [&_strong]:font-bold">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>

            {/* User avatar */}
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md text-white text-xs font-black">
                You
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-end gap-2 justify-start"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <ChefHat className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-muted/60 border border-border/60 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 0.18, 0.36].map((delay, i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary/60"
                      animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ── INPUT BAR ────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-border/50 bg-background/80 backdrop-blur-md">
        <div className="relative flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask about this recipe…"
              disabled={isLoading}
              className="w-full h-11 pl-4 pr-4 bg-muted/40 border border-border/70 rounded-2xl outline-none text-sm font-medium placeholder-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all duration-300 disabled:opacity-60"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93 }}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-primary/30 disabled:opacity-40 disabled:shadow-none transition-all duration-200"
          >
            <Send className="w-4 h-4 translate-x-px" />
          </motion.button>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40 mt-2 font-medium">
          Powered by RecipeAI · Chef context active
        </p>
      </div>
    </div>
  );
};

export default ChatbotPanel;
