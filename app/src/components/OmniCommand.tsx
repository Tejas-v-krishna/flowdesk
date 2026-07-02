import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Command, 
  Search, 
  LayoutDashboard, 
  CheckSquare, 
  Trello, 
  FolderOpen, 
  Calendar, 
  MessageSquare, 
  Target, 
  FileText, 
  GanttChartSquare, 
  BarChart3, 
  Wallet, 
  User,
  ChevronRight,
  Zap
} from 'lucide-react';
import { GlassPanel } from './GlassPanel';

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", category: "General" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks", category: "General" },
  { icon: Trello, label: "Tactical Board", path: "/kanban", category: "General" },
  { icon: FolderOpen, label: "Projects", path: "/projects", category: "General" },
  { icon: Calendar, label: "Calendar", path: "/calendar", category: "General" },
  { icon: MessageSquare, label: "Brain AI", path: "/ai", category: "Intelligence" },
  { icon: Target, label: "Focus HUD", path: "/focus", category: "Intelligence" },
  { icon: FileText, label: "The Archive", path: "/notes", category: "Intelligence" },
  { icon: GanttChartSquare, label: "Goal Matrix", path: "/goals", category: "Intelligence" },
  { icon: BarChart3, label: "Biometrics", path: "/analytics", category: "Intelligence" },
  { icon: Wallet, label: "Finance Pulse", path: "/finance", category: "Account" },
  { icon: User, label: "Identity", path: "/profile", category: "Account" },
];

interface OmniCommandProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OmniCommand({ isOpen, onClose }: OmniCommandProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredItems = navigationItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex].path);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl"
          >
            <GlassPanel className="overflow-hidden border-white/10 shadow-2xl shadow-black/50">
              {/* SearchBar */}
              <div className="flex items-center gap-4 px-6 py-5 border-b border-white/5 bg-white/[0.02]">
                <Command size={20} className="text-primary animate-pulse" />
                <input 
                  autoFocus
                  placeholder="Where to, Commander?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-white placeholder-white/10"
                />
                <div className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black text-white/20 uppercase tracking-widest">
                  ESC to Close
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[450px] overflow-y-auto custom-scrollbar py-2">
                {filteredItems.length > 0 ? (
                  <div className="space-y-4 px-2">
                    {/* Groups */}
                    {["General", "Intelligence", "Account"].map(category => {
                      const itemsInCat = filteredItems.filter(i => i.category === category);
                      if (itemsInCat.length === 0) return null;
                      return (
                        <div key={category} className="space-y-1">
                          <h5 className="px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
                            {category}
                          </h5>
                          {itemsInCat.map((item) => {
                            const globalIndex = filteredItems.indexOf(item);
                            const isSelected = selectedIndex === globalIndex;
                            const Icon = item.icon;
                            
                            return (
                              <button
                                key={item.path}
                                onClick={() => handleSelect(item.path)}
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                                  isSelected ? 'bg-primary/10 border border-primary/20 shadow-lg' : 'bg-transparent border border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`p-2 rounded-xl transition-all ${isSelected ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-white/5 text-muted-foreground'}`}>
                                    <Icon size={18} />
                                  </div>
                                  <span className={`text-sm font-black tracking-normal ${isSelected ? 'text-white' : 'text-muted-foreground group-hover:text-white'}`}>
                                    {item.label}
                                  </span>
                                </div>
                                {isSelected && (
                                  <div className="flex items-center gap-2">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Navigate</span>
                                     <ChevronRight size={14} className="text-primary" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-20">
                     <Search size={40} />
                     <p className="text-sm font-black uppercase tracking-widest text-center px-10">
                        No command protocols found for "{query}"
                     </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/5 bg-black/40 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/40">
                       <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px]">ENTER</div>
                       to Select
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/40">
                       <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px]">↑↓</div>
                       to Move
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <Zap size={12} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Spatial Relay Engine</span>
                 </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

