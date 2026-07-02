import { useState } from "react";
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  Wallet, 
  Activity,
  Plus,
  Search,
  Filter,
  X,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { toast } from "react-hot-toast";

interface Transaction {
  _id: string;
  title: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export default function FinancePage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Software");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState<'income' | 'expense'>("expense");

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['finance_transactions'],
    queryFn: () => api.get('/finance').then(r => r.data),
  });

  const { data: summary } = useQuery({
    queryKey: ['finance_summary'],
    queryFn: () => api.get('/finance/summary').then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (newTx: any) => api.post('/finance', newTx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_transactions'] });
      queryClient.invalidateQueries({ queryKey: ['finance_summary'] });
      setNewTitle(""); setNewAmount(""); setShowForm(false);
      toast.success("Transaction added");
    },
    onError: () => toast.error("Failed to add transaction"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete('/finance/' + id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_transactions'] });
      queryClient.invalidateQueries({ queryKey: ['finance_summary'] });
      toast.success("Transaction deleted");
    }
  });

  const handleAddTransaction = () => {
    if (!newTitle.trim() || !newAmount) return;
    createMutation.mutate({
      title: newTitle,
      category: newCategory,
      amount: Number(newAmount),
      type: newType,
      date: new Date()
    });
  };

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8 gap-8 bg-background min-h-screen overflow-y-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Capital Matrix</span>
          </div>
          <h1 className="text-3xl font-medium tracking-normal text-foreground">Finance</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-muted p-1 rounded-2xl border border-border">
            {['Overview', 'Ledger', 'Assets'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === tab ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="p-2 rounded-2xl bg-foreground text-background hover:bg-foreground/90 transition-colors">
             <Plus size={16} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border p-4 rounded-xl shadow-sm"
          >
            <div className="flex flex-wrap gap-4 items-center">
              <input 
                type="text" placeholder="Title..." value={newTitle} onChange={e => setNewTitle(e.target.value)}
                className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
              <input 
                type="number" placeholder="Amount..." value={newAmount} onChange={e => setNewAmount(e.target.value)}
                className="w-32 bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
              <select value={newType} onChange={e => setNewType(e.target.value as any)} className="bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-foreground">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input 
                type="text" placeholder="Category" value={newCategory} onChange={e => setNewCategory(e.target.value)}
                className="w-32 bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
              <button onClick={handleAddTransaction} className="px-4 py-2 bg-foreground text-background text-sm rounded-xl font-medium">Add</button>
              <button onClick={() => setShowForm(false)} className="p-2 text-muted-foreground hover:text-foreground"><X size={16}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Assets Balance */}
        <div className="lg:col-span-2 p-8 flex flex-col justify-between min-h-[320px] relative overflow-hidden bg-card border border-border rounded-xl shadow-sm">
          <div className="relative z-10">
            <span className="text-xs font-medium uppercase tracking-normal text-muted-foreground mb-2 block">Net Liquid Assets</span>
            <h2 className="text-5xl md:text-6xl font-semibold text-foreground tracking-normal">
              ${summary?.netWorth?.toLocaleString('en-US') || '0.00'}
            </h2>
            <div className="flex items-center gap-2 mt-4">
              <span className="flex items-center gap-1 text-foreground dark:text-foreground font-medium text-sm">
                <TrendingUp size={16} className="text-green-500" /> <span className="text-green-600">Active</span>
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">real-time sync</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-8 md:gap-12 mt-12 relative z-10 pt-6 border-t border-border/50">
            <FinanceStat label="Monthly Burn" value={"$" + (summary?.monthlyBurn?.toLocaleString() || '0')} icon={ArrowDownRight} color="text-foreground dark:text-foreground" />
            <FinanceStat label="Total Revenue" value={"$" + (summary?.monthlyRevenue?.toLocaleString() || '0')} icon={ArrowUpRight} color="text-foreground dark:text-foreground" />
            <FinanceStat label="Runway" value={(summary?.runway || '0') + " Months"} icon={Activity} color="text-foreground" />
          </div>
        </div>

        {/* Quick Actions / Integration */}
        <div className="space-y-6">
          <div className="p-6 space-y-4 border border-border bg-card rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium uppercase tracking-normal text-muted-foreground">Active Nodes</h3>
              <div className="w-2 h-2 rounded-full bg-muted" />
            </div>
            <div className="space-y-1">
              <IntegrationItem name="Plaid Protocol" status="Connected" icon={Wallet} />
              <IntegrationItem name="Stripe Interface" status="Operational" icon={CreditCard} />
            </div>
          </div>

          <div className="p-6 bg-muted/50 border border-border rounded-xl cursor-pointer hover:bg-muted transition-colors group">
            <h3 className="text-xs font-medium uppercase tracking-normal text-foreground mb-3">AI Advisory</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              "Your subscription burn increased by 4% this month. Recommend auditing unused SaaS nodes."
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Ledger */}
      <section className="space-y-6 mt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-medium uppercase tracking-normal text-muted-foreground">Operation Ledger</h3>
          <div className="flex items-center gap-3">
            <div className="relative group flex-1 md:flex-none">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search ledger..." 
                className="bg-transparent border border-border rounded-2xl py-2 pl-9 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors w-full md:w-56"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-border text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading && <div className="text-sm text-muted-foreground">Loading transactions...</div>}
          {transactions.length === 0 && !isLoading && <div className="text-sm text-muted-foreground">No transactions found.</div>}

          {transactions.map((tx) => (
            <motion.div 
              key={tx._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tx.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{tx.title}</h4>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5 block">{tx.category}</span>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <span className={`block text-sm font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('en-US')}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5 block">
                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <button onClick={() => deleteMutation.mutate(tx._id)} className="p-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FinanceStat({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-normal text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <Icon size={16} className={color} />
        <span className="text-lg font-medium text-foreground tracking-normal">{value}</span>
      </div>
    </div>
  );
}

function IntegrationItem({ name, status, icon: Icon }: { name: string, status: string, icon: any }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-muted-foreground" />
        <span className="text-xs font-medium text-foreground">{name}</span>
      </div>
      <span className="text-[10px] font-medium uppercase tracking-normal text-foreground dark:text-foreground">{status}</span>
    </div>
  );
}
