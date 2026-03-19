import { Clock, CheckCircle, AlertCircle, PlusCircle } from "lucide-react";
import { GlassPanel } from "./GlassPanel";

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
    let color = "#ccbaff";
    let textStr = `Updated: ${t.title}`;

    if (t.status === 'Done') {
      icon = CheckCircle;
      color = '#42ff6b';
      textStr = `Completed: ${t.title}`;
    } else if (t.status === 'Todo') {
      icon = PlusCircle;
      color = '#784cfe';
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
      className="p-6 flex flex-col h-full min-h-[400px]"
    >
      <h3 className="text-foreground text-[16px] font-semibold tracking-tight mb-6">
        Recent Activity
      </h3>

      <div className="flex flex-col gap-4 flex-1">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 rounded-2xl bg-card/40 border border-card-border/50 hover:bg-card/60 transition-all relative z-10 transition-transform hover:-translate-x-1"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}20` }}
              >
                <Icon size={16} style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-[14px] font-bold tracking-tight truncate">{item.text}</p>
                <p className="text-muted-foreground text-[11px] mt-0.5 font-bold uppercase tracking-wider opacity-60">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
