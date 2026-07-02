import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  Target,
  Zap,
  Activity,
  Shield,
  Sparkles,
  LayoutDashboard,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Calendar,
  BarChart2,
  ListTodo,
  FolderOpen
} from "lucide-react";

import api from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from "../store/useAppStore";
import { useBrainStore } from "../store/useBrainStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function getIconForType(type: string) {
  switch (type) {
    case 'task': return ListTodo;
    case 'goal': return Target;
    case 'project': return FolderOpen;
    default: return CheckCircle2;
  }
}

export function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state: any) => state.user);
  const { isInitialLoadingComplete } = useAppStore();
  const { executiveSummary } = useBrainStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: serverTasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks').then((r: any) => r.data),
  });

  const { data: recentActivity = [] } = useQuery({
    queryKey: ['activity'],
    queryFn: () => api.get('/activity').then((r: any) => r.data),
  });

  const { data: summaryData } = useQuery({
    queryKey: ['analytics_summary'],
    queryFn: () => api.get('/analytics/summary').then(r => r.data)
  });

  const dummyTasks = [
    { title: "Finalize AI Directive Flow", completed: false, priority: "high" },
    { title: "Review Q3 Revenue Metrics", completed: false, priority: "high" },
    { title: "Client Briefing Setup", completed: false, priority: "medium" },
    { title: "Resolve Critical Pipeline Bugs", completed: false, priority: "medium" },
    { title: "Approve New Marketing Assets", completed: true, priority: "low" },
    { title: "Optimize Database Queries", completed: false, priority: "low" },
  ];

  const tasks = serverTasks.length > 0 ? serverTasks : dummyTasks;
  const pendingCount = tasks.filter((t: any) => !t.completed && t.status !== 'Done').length;

  useEffect(() => {
    if (isInitialLoadingComplete && containerRef.current) {
      gsap.fromTo(".dashboard-animate",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.1 }
      );
    }
  }, [isInitialLoadingComplete]);

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-6 w-full max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 dashboard-animate shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Welcome back, {user?.name?.split(' ')[0] || 'Tejas'} 👋
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-foreground animate-pulse inline-block" />
            <span className="font-medium text-foreground">Operational</span>
            {" "}· {pendingCount} tasks pending today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/analytics')}
            className="flex flex-col items-center px-5 py-3 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-border transition-all cursor-pointer"
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Efficiency</span>
            <span className="text-2xl font-bold text-foreground">{summaryData?.stats?.productivityScore || 0}%</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/analytics')}
            className="flex flex-col items-center px-5 py-3 bg-muted border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-border transition-all cursor-pointer"
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">AI Helper</span>
            <span className="text-2xl font-bold text-foreground">98%</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Today's Tip */}
      <motion.div variants={itemVariants} className="dashboard-animate">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-3.5 rounded-xl bg-card border border-border shadow-sm shrink-0">
              <Target size={28} className="text-foreground" />
            </div>
            <div className="flex-1 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground bg-card border border-border px-2.5 py-1 rounded-full">
                Today's Tip
              </span>
              <p className="text-lg font-semibold text-foreground leading-snug">
                {executiveSummary || "Focus on delivering core MVP features for today's release and ensure the timeline stays on schedule."}
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/focus')}
                  className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                >
                  Execute Strategy <ArrowUpRight size={15} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/analytics')}
                  className="px-5 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors shadow-sm"
                >
                  Review
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 dashboard-animate">

        {/* Focus Matrix */}
        <motion.section variants={itemVariants} className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <LayoutDashboard size={15} className="text-muted-foreground" />
              <h3 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-widest">Focus Matrix</h3>
            </div>
            <motion.button
              whileHover={{ x: 2 }}
              onClick={() => navigate('/tasks')}
              className="text-[11px] text-muted-foreground font-semibold flex items-center gap-0.5 hover:text-foreground transition-colors"
            >
              View All <ChevronRight size={13} />
            </motion.button>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <MatrixQuadrant title="Do First" subtitle="Urgent & Important" badgeClass="bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30" tasks={tasks.filter((t: any) => t.priority === 'High' || t.priority === 'Urgent').slice(0, 2)} onClick={() => navigate('/tasks')} />
            <MatrixQuadrant title="Schedule" subtitle="Important" badgeClass="bg-muted text-muted-foreground border-border" tasks={tasks.filter((t: any) => t.priority === 'Medium').slice(0, 2)} onClick={() => navigate('/calendar')} />
            <MatrixQuadrant title="Delegate" subtitle="Urgent" badgeClass="bg-muted text-muted-foreground border-border" tasks={tasks.slice(4, 5)} onClick={() => navigate('/tasks')} />
            <MatrixQuadrant title="Eliminate" subtitle="Backlog" badgeClass="bg-muted text-muted-foreground border-border" tasks={tasks.filter((t: any) => t.status === 'Backlog').slice(0, 2)} onClick={() => navigate('/tasks')} />
          </div>
        </motion.section>

        {/* Focus Pulse */}
        <motion.section variants={itemVariants} className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Shield size={15} className="text-muted-foreground" />
              <h3 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-widest">Focus Pulse</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-foreground animate-pulse inline-block" />
              <span className="text-[11px] font-semibold text-foreground">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <PulseMetric icon={Target} label="Completed Tasks" value={summaryData?.stats?.completedTasks?.toString() || "0"} trend="+2" positive={true} onClick={() => navigate('/analytics')} />
            <PulseMetric icon={Clock} label="Focus Time" value="4.2h" trend="+12%" positive={true} onClick={() => navigate('/analytics')} />
            <PulseMetric icon={Zap} label="Peak Focus" value="89%" trend="+5%" positive={true} onClick={() => navigate('/analytics')} />
            <PulseMetric icon={Sparkles} label="AI Helper" value="98%" trend="Stable" positive={true} onClick={() => navigate('/ai')} />
          </div>
        </motion.section>
      </div>

      {/* Recent Activity */}
      <motion.section variants={itemVariants} className="dashboard-animate flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-muted-foreground" />
            <h3 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-widest">Recent Activity</h3>
          </div>
          <motion.button
            whileHover={{ x: 2 }}
            onClick={() => navigate('/analytics')}
            className="text-[11px] text-muted-foreground font-semibold flex items-center gap-0.5 hover:text-foreground transition-colors"
          >
            View All <ChevronRight size={13} />
          </motion.button>
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden divide-y divide-border">
          {recentActivity.map((item: any, i: number) => {
            const IconComponent = getIconForType(item.type);
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(item.route)}
                className="w-full flex items-center gap-4 px-5 py-4 transition-colors group cursor-pointer text-left hover:bg-muted"
              >
                <div className={`p-2 rounded-xl bg-muted border border-border ${item.color} shrink-0`}>
                  <IconComponent size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{item.action}</span>
                  <p className="text-sm font-semibold text-foreground truncate">{item.item}</p>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <ChevronRight size={14} className="text-muted-foreground group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
              </motion.button>
            )
          })}
        </div>
      </motion.section>

    </motion.div>
  );
}

function MatrixQuadrant({
  title, subtitle, tasks, badgeClass, onClick
}: {
  title: string; subtitle: string; tasks: any[]; badgeClass: string; onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-none p-4 flex flex-col gap-3 min-h-[160px] cursor-pointer transition-all"
    >
      <div className="space-y-1.5">
        <h4 className="text-[14px] font-bold text-foreground">{title}</h4>
        <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
          {subtitle}
        </span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {tasks.length > 0 ? tasks.map((t, i) => (
          <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-muted border border-border text-[12px] text-foreground truncate group">
            <Circle size={12} className="text-muted-foreground shrink-0" />
            <span className="truncate">{t.title}</span>
          </div>
        )) : (
          <div className="h-full flex items-center justify-center text-[12px] text-muted-foreground border border-dashed border-border rounded-xl min-h-[60px]">
            All clear ✓
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PulseMetric({
  icon: Icon, label, value, trend, positive, onClick
}: {
  icon: any; label: string; value: string; trend: string; positive: boolean; onClick: () => void;
}) {
  const TrendIcon = trend === "Stable" ? Minus : positive ? TrendingUp : TrendingDown;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-none p-4 flex flex-col justify-between min-h-[120px] cursor-pointer transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-xl bg-muted border border-border text-muted-foreground">
          <Icon size={16} />
        </div>
        <span className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-full ${
          trend === "Stable"
            ? "text-muted-foreground bg-muted border border-border"
            : positive
              ? "text-green-600 bg-green-50 border border-green-100 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400"
              : "text-red-500 bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400"
        }`}>
          <TrendIcon size={11} />
          {trend}
        </span>
      </div>
      <div className="mt-3">
        <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{label}</span>
        <span className="block text-2xl font-bold text-foreground tracking-tight">{value}</span>
      </div>
    </motion.div>
  );
}
