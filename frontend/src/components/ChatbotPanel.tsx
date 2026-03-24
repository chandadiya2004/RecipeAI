import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/context/AuthContext';
import { Recipe } from '@/data/recipes';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatbotPanelProps {
  currentRecipe?: Recipe | null;
}

const ChatbotPanel = ({ currentRecipe }: ChatbotPanelProps) => {
  const { getAccessToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI Sous-Chef. Need help with a recipe, ingredient substitutions, or cooking tips?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const userMsg: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const token = await getAccessToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ 
          messages: newMessages.filter(m => m.role !== 'system'),
          context: currentRecipe || null,
          source: 'dish_generator_chat',
        })
      });

      if (!response.ok) throw new Error("Failed to fetch chat");

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the kitchen right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[460px] sm:h-[560px] lg:h-[650px] glass rounded-3xl overflow-hidden shadow-xl border border-border">
      {/* Header */}
      <div className="h-14 sm:h-16 flex items-center px-4 sm:px-6 border-b border-border bg-muted/40 backdrop-blur-md">
        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2.5 sm:mr-3" />
        <h3 className="font-bold text-foreground text-base sm:text-lg">AI Sous-Chef</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 flex flex-col scrollbar-hide">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.4, type: "spring", stiffness: 220, damping: 22 }}
            key={i} 
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-5 shadow-sm border ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-purple-500 to-orange-500 text-white rounded-br-sm border-transparent shadow-[0_4px_15px_hsl(330_80%_60%_/_0.3)]' 
                : 'bg-muted/40 text-foreground rounded-bl-sm border-border/80 backdrop-blur-xl'
            }`}>
              <div className="flex items-center gap-2 mb-2 opacity-80 text-[11px] uppercase tracking-wider font-extrabold">
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                {msg.role === 'user' ? 'You' : 'Chef AI'}
              </div>
              {msg.role === 'assistant' ? (
                <div className="text-[14px] sm:text-[15px] leading-relaxed font-medium whitespace-pre-wrap [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-extrabold">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            className="flex justify-start w-full"
          >
            <div className="bg-muted/40 text-foreground rounded-2xl rounded-bl-sm p-4 sm:p-5 w-24 flex items-center justify-center border border-border/80 backdrop-blur-xl shadow-sm">
              <div className="flex gap-1.5 items-center">
                <motion.span animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2.5 h-2.5 rounded-full bg-primary/70" />
                <motion.span animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2.5 h-2.5 rounded-full bg-primary/70" />
                <motion.span animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2.5 h-2.5 rounded-full bg-primary/70" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-3.5 sm:p-5 border-t border-border bg-background/50 backdrop-blur-lg">
        <div className="relative flex items-center shadow-md rounded-2xl bg-muted/30 border-2 border-border/80 focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all duration-300 group focus-within:shadow-[0_0_30px_hsl(330_80%_60%_/_0.15)]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about substitutions or tips..."
            className="w-full h-14 sm:h-16 pl-4 sm:pl-6 pr-14 sm:pr-16 bg-transparent border-none outline-none text-[14px] sm:text-[15px] font-medium placeholder-muted-foreground/60"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 sm:right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-purple-500 to-orange-500 disabled:opacity-40 transition-all duration-300 active:scale-95 shadow-md shadow-primary/20"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPanel;
