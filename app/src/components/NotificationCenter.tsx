import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Sparkles, Zap, Info, CheckCircle2, Trash2 } from 'lucide-react';
import { useNotificationStore, NotificationType } from '../store/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';

const typeIcons: Record<NotificationType, any> = {
  ai: Sparkles,
  productivity: Zap,
  system: Info,
  success: CheckCircle2,
  warning: Bell
};

const typeColors: Record<NotificationType, string> = {
  ai: 'text-foreground',
  productivity: 'text-muted-foreground',
  system: 'text-foreground',
  success: 'text-foreground',
  warning: 'text-foreground'
};

export function NotificationCenter() {
  const { notifications, isOpen, setIsOpen, markAsRead, markAllAsRead, clearAll } = useNotificationStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-96 bg-[#0d0d0d]/90 border-l border-white/5 backdrop-blur-xl z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell size={20} className="text-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-muted rounded-full animate-pulse" />
                  )}
                </div>
                <h2 className="text-xl font-bold tracking-normal text-white">Notifications</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Actions */}
            <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-white/5">
              <button
                onClick={markAllAsRead}
                className="text-xs font-bold text-primary hover:opacity-80 transition-opacity"
              >
                Mark all as read
              </button>
              <button
                onClick={clearAll}
                className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={12} />
                Clear all
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Bell size={24} className="text-muted-foreground/20" />
                  </div>
                  <h3 className="text-white font-bold mb-1">All caught up!</h3>
                  <p className="text-sm text-muted-foreground">You have no new notifications.</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = typeIcons[n.type];
                  return (
                    <motion.div
                      layout
                      key={n.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        n.read ? 'bg-white/5 border-transparent opacity-60' : 'bg-primary/5 border-primary/20 bg-white/[0.02]'
                      }`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="flex gap-4">
                        <div className={`mt-1 p-2 rounded-xl bg-white/5 ${typeColors[n.type]}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-bold text-white truncate">{n.title}</h4>
                            <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                              {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {n.message}
                          </p>
                          {n.actionLabel && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                n.onAction?.();
                              }}
                              className="px-4 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
                            >
                              {n.actionLabel}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-[#0d0d0d]">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                <Sparkles size={16} className="text-primary" />
                <p className="text-[11px] font-medium text-primary/80 leading-snug">
                  Adaptive AI is silencing non-essential notifications during your Focus Hour.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

