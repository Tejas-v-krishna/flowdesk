import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useBrainStore } from '../store/useBrainStore';

export function OperationalGhost() {
  const [isVisible, setIsVisible] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<any>(null);
  const { insights } = useBrainStore() as any;

  // Show the ghost after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Periodic proactive insights
  useEffect(() => {
    if (!isVisible) return;

    const showRandomInsight = () => {
      const insight = insights[Math.floor(Math.random() * insights.length)];
      setCurrentInsight(insight);
      setShowInsight(true);
      
      // Hide after 8 seconds
      setTimeout(() => setShowInsight(false), 8000);
    };

    const interval = setInterval(showRandomInsight, 45000); // Every 45 seconds
    
    // Initial one after 5 seconds
    const initialTimer = setTimeout(showRandomInsight, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [isVisible, insights]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-24 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
          {/* Proactive Insight Bubble */}
          <AnimatePresence>
            {showInsight && currentInsight && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                className="pointer-events-auto max-w-xs bg-[#0d0d0d]/90 border border-primary/20 backdrop-blur-xl p-4 rounded-xl shadow-2xl relative group"
              >
                <button 
                  onClick={() => setShowInsight(false)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X size={12} className="text-white" />
                </button>
                
                <div className="flex gap-3">
                  <div className="mt-1 p-2 rounded-2xl bg-primary/10 text-primary">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-primary mb-1">Ghost Insight</h4>
                    <p className="text-xs font-bold text-white leading-relaxed">
                      {currentInsight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The Ghost Orb */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="pointer-events-auto relative group"
            onClick={() => setShowInsight(!showInsight)}
          >
            {/* Outer Glows */}
            <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl group-hover:bg-primary/60 transition-colors animate-pulse" />
            <div className="absolute inset-0 bg-muted rounded-full blur-2xl animate-pulse delay-75" />
            
            {/* Orb Core */}
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary via-primary to-gray-50 border border-white/20 flex items-center justify-center shadow-2xl overflow-hidden">
              <motion.div
                animate={{ 
                  rotate: 360,
                  transition: { duration: 10, repeat: Infinity, ease: 'linear' }
                }}
                className="absolute inset-0 opacity-40 bg-[conic-gradient(from_0deg,transparent_0deg,white_180deg,transparent_360deg)]"
              />
              <Sparkles size={20} className="text-white relative z-10 shrink-0" />
            </div>

            {/* Hover Tooltip/Label */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <span className="px-3 py-1 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                Operational Ghost Active
              </span>
            </div>
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
