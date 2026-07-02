import { Clock, CheckCircle, AlertCircle, PlusCircle } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { motion } from "framer-motion";

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
  updatedAt?: string;
  createdAt?: string;
}

interface Props {
  tasks: Task[];
}

export function Activity({ tasks = [] }: Props) {
  // Compute recent activity based on task dates, mapping to the visual representation
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
    .slice(0, 5);

  const activities = recentTasks.map(t => {
    let icon = Clock;
    let color = "#ffffff";
    let textStr = `Updated: ${t.title}`;

    if (t.status === 'Done') {
      icon = CheckCircle;
      color = '#42ff6b';
      textStr = `Completed: ${t.title}`;
    } else if (t.status === 'Todo') {
      icon = PlusCircle;
      color = '#000000';
      textStr = `Created: ${t.title}`;
    } else if (t.priority === 'High' || t.priority === 'Urgent') {
      icon = AlertCircle;
      color = '#ff4242';
    }

    // simplistic relative time formatting
    const date = new Date(t.updatedAt || t.createdAt || new Date());
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    const timeStr = diff < 60 ? `${diff}m ago` : diff < 1440 ? `${Math.floor(diff / 60)}h ago` : `${Math.floor(diff / 1440)}d ago`;

    return {
      id: t._id,
      icon,
      text: textStr,
      time: timeStr,
      color,
    }
  });

  // fallback empty state
  if (activities.length === 0) {
    activities.push({
      id: 'init',
      icon: CheckCircle,
      text: "System ready & listening",
      time: "Just now",
      color: "#42ff6b",
    })
  }

  return (
    <GlassPanel
      blur={40}
      className="p-8 flex flex-col h-full bg-card/10"
    >
      <h3 className="text-foreground text-[18px] font-bold tracking-normal flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Clock size={18} className="text-primary" />
        </div>
        Recent Activity
      </h3>

      <div className="flex flex-col gap-5 flex-1 relative">
        {/* Timeline line */}
        <div className="absolute left-[21px] top-4 bottom-4 w-[2px] bg-border/20 -z-10 rounded-full" />
        
        {activities.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-5 group"
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-lg border-2 border-background"
                style={{ 
                  backgroundColor: `${item.color}15`, 
                  borderColor: 'var(--card-bg)', // Using card-bg as spacer
                  color: item.color 
                }}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <p className="text-foreground text-[15px] font-bold tracking-normal truncate group-hover:text-primary transition-colors cursor-default">
                  {item.text}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-muted-foreground/40 text-[10px] font-black uppercase tracking-widest leading-none">
                    {item.time}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-border/40" />
                  <span className="text-[10px] font-bold text-primary/50 uppercase tracking-normaler">System Log</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

