import { motion } from "framer-motion";
import { Sparkles, Brain, Target, Zap, Activity, Network, ChevronRight } from "lucide-react";
import { AnimatedAIChat } from "../components/ui/animated-ai-chat";
import { useBrainStore, BrainInsight } from "../store/useBrainStore";
import { formatDistanceToNow } from "date-fns";

const insightIcons: Record<string, any> = {
  strategy: Target,
  productivity: Zap,
  rest: Activity,
  connection: Network
};

export function AIAssistantPage() {
  const { insights, executiveSummary } = useBrainStore();

  return (
    <div className="flex-1 flex min-h-0 bg-background relative overflow-hidden">
      {/* Background Refraction */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-black/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-muted rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="flex-1 flex min-h-0 relative z-10 divide-x divide-border">
        {/* Left: AI Chat */}
        <div className="flex-[1.2] flex flex-col min-h-0">
          <AnimatedAIChat />
        </div>

        {/* Right: Mission Control Dashboard */}
        <div className="flex-1 flex flex-col min-h-0 bg-muted backdrop-blur-md border-l border-border overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-black/10 border border-border">
                  <Brain size={20} className="text-foreground" />
                </div>
                <h2 className="text-2xl font-bold tracking-normal text-foreground">AI Assistant Dashboard</h2>
              </div>
              <p className="text-sm text-muted-foreground font-medium">AI Assistant is active and ready.</p>
            </div>

            {/* Executive Summary Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-card border border-border relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Sparkles size={40} className="text-foreground" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={14} className="text-foreground" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">My Briefing</span>
                </div>
                <p className="text-lg font-bold text-foreground leading-relaxed mb-4">
                  {executiveSummary}
                </p>
                <div className="flex gap-4">
                  <div className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                    Workload: Good
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground shadow-sm flex items-center gap-2">
                    <Zap size={12} className="text-muted-foreground" />
                    Focus Score: 85%
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Knowledge Map Thumbnail */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-2">Mind Map</h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-foreground hover:opacity-80 transition-opacity flex items-center gap-1">
                  Full Graph <ChevronRight size={12} />
                </button>
              </div>
              <div className="h-48 rounded-2xl bg-card border border-border shadow-sm relative overflow-hidden flex items-center justify-center p-8 group cursor-pointer hover:border-border transition-all">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)]" />
                <div className="relative flex items-center justify-center gap-8">
                  {/* Mock Knowledge Nodes */}
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-12 h-12 rounded-full bg-black/20 border border-border flex items-center justify-center backdrop-blur-3xl ">
                    <div className="w-2 h-2 rounded-full bg-black" />
                  </motion.div>
                  <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center backdrop-blur-3xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted" />
                  </motion.div>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center backdrop-blur-3xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  </motion.div>
                </div>
                {/* Connection lines mock */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                  <line x1="50%" y1="50%" x2="40%" y2="40%" stroke="var(--primary)" strokeWidth="1" />
                  <line x1="50%" y1="50%" x2="65%" y2="55%" stroke="var(--primary)" strokeWidth="1" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white px-4 py-2 rounded-full bg-black shadow-xl">Refresh Map</span>
                </div>
              </div>
            </section>

            {/* AI Insights */}
            <section>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-2 mb-4">AI Insights</h3>
              <div className="space-y-4">
                {insights.map((insight: BrainInsight) => {
                  const Icon = insightIcons[insight.type] || Sparkles;
                  return (
                    <motion.div 
                      key={insight.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-5 rounded-xl bg-card border border-border hover:border-border shadow-sm transition-all group flex gap-4"
                    >
                      <div className={`mt-1 p-2.5 rounded-xl bg-muted border border-border transition-colors group-hover:border-border ${insight.impact === 'high' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-foreground">{insight.title}</h4>
                          <span className="text-[10px] font-medium text-muted-foreground">{formatDistanceToNow(insight.timestamp, { addSuffix: true })}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {insight.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </section>

            {/* Quick Actions for Brain */}
            <div className="pt-4">
              <button className="w-full p-4 rounded-2xl bg-card border border-dashed border-border shadow-sm hover:border-border hover:bg-black/5 transition-all text-sm font-bold text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
                <Target size={14} />
                Optimize My Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

