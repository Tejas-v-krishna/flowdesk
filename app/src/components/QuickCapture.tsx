import { useState } from 'react';
import { Plus, X, Send, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../api/client';
import { GlassPanel } from './GlassPanel';
import { useQueryClient } from '@tanstack/react-query';

export function QuickCapture() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'task' | 'note'>('task');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleCapture = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      if (type === 'task') {
        await api.post('/tasks', { title: content, status: 'Todo', priority: 'Medium' });
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      } else {
        await api.post('/notes', { title: content.slice(0, 20), content, tags: ['QUICK'], pinned: false });
        queryClient.invalidateQueries({ queryKey: ['notes'] });
      }
      toast.success(`${type === 'task' ? 'Task' : 'Note'} captured to Inbox`);
      setContent('');
      setIsOpen(false);
    } catch (error) {
      toast.error('Capture failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-10 right-10 z-[60]">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-2xl bg-primary  flex items-center justify-center text-white cursor-pointer group relative overflow-hidden"
        >
          <Plus size={24} className="relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-28 right-10 z-[101] w-[320px]"
            >
              <GlassPanel className="p-6 border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-primary animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-primary/80">Quick Capture</span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-muted-foreground/40 hover:text-foreground transition-colors">
                    <X size={16} />
                  </button>
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setType('task')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${type === 'task' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 text-muted-foreground/40 border-transparent'}`}
                  >
                    Task
                  </button>
                  <button
                    onClick={() => setType('note')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${type === 'note' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 text-muted-foreground/40 border-transparent'}`}
                  >
                    Note
                  </button>
                </div>

                <div className="relative mb-4">
                  <textarea
                    autoFocus
                    placeholder={type === 'task' ? "What's the mission?" : "Capture the thought..."}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCapture(); }}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-[13px] font-medium text-foreground placeholder-muted-foreground/30 outline-none focus:border-primary/30 transition-all resize-none min-h-[120px]"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-20 text-[10px] font-black uppercase tracking-widest">
                    <span>⌘</span><span>Enter</span>
                  </div>
                </div>

                <button
                  onClick={handleCapture}
                  disabled={isSubmitting || !content.trim()}
                  className="w-full h-11 bg-primary rounded-xl text-[12px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={14} /> Capture</>}
                </button>
              </GlassPanel>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
