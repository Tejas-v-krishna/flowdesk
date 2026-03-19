import { GlassPanel } from "./GlassPanel";

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

export function QuickStats({ tasks = [], projects = [] }: Props) {
  const active = tasks.filter(t => t.status === 'Todo' || t.status === 'In Progress').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Done').length;
  const overdue = tasks.filter(t => {
    if (t.status === 'Done' || !t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const stats = [
    { label: "Active Tasks", value: active, color: "var(--chart-1)" },
    { label: "In Progress", value: inProgress, color: "var(--chart-2)" },
    { label: "Overdue", value: overdue, color: "var(--destructive)" },
    { label: "Completed", value: completed, color: "oklch(0.7 0.1 160)" },
  ];

  return (
    <GlassPanel blur={40} className="p-6 flex flex-col h-full">
      {/* Header */}
      <h3 className="text-foreground text-[16px] font-semibold tracking-tight mb-6">
        Quick Stats
      </h3>

      {/* Stats list */}
      <div className="flex flex-col gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2 group cursor-default">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-4 rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
                <span className="text-muted-foreground text-[13px] font-semibold tracking-tight">
                  {stat.label}
                </span>
              </div>
              <span className="text-foreground text-[16px] font-black tracking-tight">
                {stat.value}
              </span>
            </div>
            {/* Mini progress bar */}
            <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${Math.min((stat.value / Math.max(...stats.map(s => s.value), 1)) * 100, 100)}%`,
                  backgroundColor: stat.color,
                  opacity: 0.6
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
