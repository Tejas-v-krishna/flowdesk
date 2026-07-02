import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, 
  Flag, 
  BarChart3, 
  ChevronRight, 
  Plus, 
  CheckCircle2,
  Circle,
  Trophy,
  Rocket,
  X,
  Trash2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { toast } from "react-hot-toast";

interface Goal {
  _id: string;
  title: string;
  progress: number;
  category: string;
  deadline: string;
  status: string;
  priority: string;
}

export default function GoalsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Product");

  const { data: goals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: () => api.get('/goals').then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (newGoal: any) => api.post('/goals', newGoal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setNewTitle("");
      setShowForm(false);
      toast.success("Goal created");
    },
    onError: () => toast.error("Failed to create goal"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(/goals/ + id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success("Goal deleted");
    }
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ id, progress, status }: { id: string, progress: number, status?: string }) => 
      api.patch(/goals/ + id, { progress, status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] })
  });

  const activeGoalsCount = goals.filter(g => g.status === 'active').length;
  const completedGoalsCount = goals.filter(g => g.status === 'completed').length;
  const successRate = goals.length > 0 ? Math.round((completedGoalsCount / goals.length) * 100) : 0;

  const handleAddGoal = () => {
    if (!newTitle.trim()) return;
    createMutation.mutate({
      title: newTitle,
      category: newCategory,
      progress: 0,
      status: 'active',
      priority: 'medium',
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });
  };

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8 gap-8 bg-background min-h-screen overflow-y-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Strategic Alignment</span>
          </div>
          <h1 className="text-3xl font-medium tracking-normal text-foreground">Goals</h1>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={14} />
          New Objective
        </button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border p-4 rounded-xl shadow-sm"
          >
            <div className="flex gap-4 items-center">
              <input 
                type="text" 
                placeholder="Goal Title..." 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
              <select 
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              >
                <option>Product</option>
                <option>Technical</option>
                <option>Design</option>
                <option>Market</option>
              </select>
              <button onClick={handleAddGoal} className="px-4 py-2 bg-foreground text-background text-sm rounded-xl font-medium">Add</button>
              <button onClick={() => setShowForm(false)} className="p-2 text-muted-foreground hover:text-foreground"><X size={16}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <QuickStat label="Active Goals" value={activeGoalsCount.toString()} icon={Target} />
        <QuickStat label="Completed" value={completedGoalsCount.toString()} icon={CheckCircle2} />
        <QuickStat label="Success Rate" value={successRate + "%"} icon={Trophy} />
        <QuickStat label="Momentum" value="+8%" icon={Rocket} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 md:gap-8">
        {/* Objectives List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-normal text-muted-foreground">Quarterly Objectives</h3>
            <div className="flex gap-2">
               <button className="px-2 py-1 rounded bg-muted text-[10px] font-medium text-foreground">All</button>
               <button className="px-2 py-1 rounded text-[10px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">Active</button>
               <button className="px-2 py-1 rounded text-[10px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">Completed</button>
            </div>
          </div>
          
          <div className="space-y-3">
            {isLoading && <div className="text-sm text-muted-foreground">Loading goals...</div>}
            {goals.length === 0 && !isLoading && <div className="text-sm text-muted-foreground">No goals found. Create one to get started.</div>}
            
            {goals.map((goal) => (
              <div key={goal._id} className="p-5 bg-card border border-border rounded-xl group hover:border-muted-foreground/30 transition-colors shadow-sm">
                <div className="flex items-center gap-4 md:gap-6">
                  {/* Progress Ring */}
                  <div className="relative w-12 h-12 shrink-0 cursor-pointer" onClick={() => {
                      const newProg = goal.progress >= 100 ? 0 : Math.min(goal.progress + 25, 100);
                      const newStatus = newProg === 100 ? 'completed' : 'active';
                      updateProgressMutation.mutate({ id: goal._id, progress: newProg, status: newStatus });
                  }}>
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted" />
                      <circle 
                        cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" 
                        strokeDasharray="125.6" 
                        strokeDashoffset={125.6 - (125.6 * goal.progress) / 100}
                        className={goal.status === 'completed' ? 'text-green-500' : 'text-foreground'}
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-foreground">
                       {goal.progress}%
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                       <h4 className="text-sm font-medium tracking-normal text-foreground line-clamp-1">{goal.title}</h4>
                       {goal.status === 'completed' && <CheckCircle2 size={14} className="text-foreground dark:text-foreground" />}
                    </div>
                    <div className="flex items-center gap-4 text-[10px] uppercase font-medium tracking-normal text-muted-foreground">
                       <span className="flex items-center gap-1">
                          <Flag size={10} /> {goal.category}
                       </span>
                       <span className="flex items-center gap-1">
                          <BarChart3 size={10} /> {goal.priority} Priority
                       </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 hidden md:block">
                     <span className="block text-[10px] font-medium uppercase tracking-normal text-muted-foreground mb-0.5">Deadline</span>
                     <span className="block text-xs font-medium text-foreground">{new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>

                  <div className="p-2 flex gap-2 rounded-xl bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => deleteMutation.mutate(goal._id)} className="hover:text-red-500">
                        <Trash2 size={16} />
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Strategic Insights */}
        <section className="space-y-6">
          <h3 className="text-xs font-medium uppercase tracking-normal text-muted-foreground">Operational Insights</h3>
          <div className="p-6 md:p-8 bg-muted/30 border border-border rounded-xl space-y-6 shadow-sm">
             <div className="space-y-3">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground shadow-sm">
                      <Target size={16} />
                   </div>
                   <h4 className="text-xs font-medium uppercase tracking-normal text-foreground">Convergence Analysis</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                   Your current goal alignment is <span className="text-foreground font-semibold">84%</span>. Release 4.0 is ahead of schedule, while Biometrics Sync is lagging.
                </p>
             </div>

             <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "84%" }}
                   className="h-full bg-foreground"
                   transition={{ duration: 1, ease: "easeOut" }}
                />
             </div>

             <div className="pt-5 border-t border-border/50">
                <span className="block text-[10px] font-medium uppercase tracking-normal text-muted-foreground mb-4">Recommended Actions</span>
                <div className="space-y-3">
                   <ActionItem text="Allocate 2h to Biometrics Sync" />
                   <ActionItem text="Review Product Mission Statement" />
                   <ActionItem text="Finalize Q4 OKR Schema" />
                </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function QuickStat({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="p-5 bg-card border border-border rounded-xl flex items-center gap-4 shadow-sm hover:border-muted-foreground/30 transition-colors group">
       <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
          <Icon size={18} />
       </div>
       <div>
          <span className="block text-[10px] font-medium uppercase tracking-normal text-muted-foreground mb-0.5">{label}</span>
          <span className="block text-xl font-semibold text-foreground tracking-normal">{value}</span>
       </div>
    </div>
  );
}

function ActionItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
       <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center p-0.5 group-hover:bg-foreground group-hover:border-foreground transition-all">
          <Circle size={8} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-background transition-opacity" />
       </div>
       <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{text}</span>
    </div>
  );
}
