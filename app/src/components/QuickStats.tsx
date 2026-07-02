import { GlassPanel } from "./GlassPanel";
import { CheckCircle2, Clock, AlertCircle, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
}

interface Project {
  _id: string;
  name: string;
  status: string;
}

interface Props {
  tasks: Task[];
  projects?: Project[];
}

export function QuickStats({ tasks = [] }: Props) {
  const active = tasks.filter(t => t.status === 'Todo' || t.status === 'In Progress').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Done').length;
  const overdue = tasks.filter(t => {
    if (t.status === 'Done' || !t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const stats = [
    { label: "Active", value: active, color: "var(--primary)", icon: Clock, bg: "bg-primary/10" },
    { label: "In Progress", value: inProgress, color: "#a78bfa", icon: PlayCircle, bg: "bg-muted" },
    { label: "Overdue", value: overdue, color: "#ef4444", icon: AlertCircle, bg: "bg-muted" },
    { label: "Completed", value: completed, color: "#10b981", icon: CheckCircle2, bg: "bg-muted" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="group"
        >
          <GlassPanel className="p-6 flex flex-col gap-4 relative overflow-hidden group-hover:border-primary/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg} text-primary shadow-inner`}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[32px] font-black tracking-normal leading-none text-foreground">
                  {stat.value}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-muted-foreground/60 text-[12px] font-black tracking-[0.1em] uppercase">
                {stat.label}
              </p>
              <div className="h-1.5 w-full bg-muted/30 rounded-full mt-3 overflow-hidden border border-border/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stat.value / Math.max(...stats.map(s => s.value), 1)) * 100, 100)}%` }}
                  className="h-full rounded-full"
                  style={{ 
                    backgroundColor: stat.color,
                    boxShadow: `0 0 8px ${stat.color}40`
                  }}
                />
              </div>
            </div>
            
            {/* Subtle background glow */}
            <div 
              className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-[40px] opacity-20 transition-opacity group-hover:opacity-40"
              style={{ backgroundColor: stat.color }}
            />
          </GlassPanel>
        </motion.div>
      ))}
    </div>
  );
}

