import { GlassPanel } from "./GlassPanel";
import { useEffect, useState } from "react";
import api from "../api/client";
import { motion } from "framer-motion";
import { BarChart2, TrendingUp } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
}

interface Props {
  tasks: Task[];
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeeklyDistribution({ tasks = [] }: Props) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Done").length;

  const overdue = tasks.filter((t) => {
    if (t.status === "Done" || !t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const [barHeights, setBarHeights] = useState<number[]>([]);

  useEffect(() => {
    const fetchBarHeights = async () => {
      try {
        const response = await api.get("/analytics/weekly-distribution");
        setBarHeights(response.data);
      } catch (error) {
        console.error("Error fetching weekly distribution data:", error);
      }
    };

    fetchBarHeights();
  }, []);

  return (
    <GlassPanel blur={40} className="p-8 flex flex-col h-full bg-card/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-foreground text-[18px] font-bold tracking-normal flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BarChart2 size={18} className="text-primary" />
          </div>
          Weekly Activity
        </h3>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-foreground text-[10px] font-black uppercase tracking-normal">
          <TrendingUp size={12} />
          <span>Active</span>
        </div>
      </div>

      {/* Chart area */}
      <div className="flex-1 flex items-end justify-center gap-2 px-1 pb-4 relative min-h-[220px]">
        {total === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mb-3">
              <BarChart2 size={24} className="text-muted-foreground/30" />
            </div>
            <p className="text-foreground/60 text-[14px] font-bold tracking-normal mb-1">
              No activity yet
            </p>
            <p className="text-muted-foreground/40 text-[11px] font-medium leading-relaxed max-w-[180px]">
              Complete tasks to see your weekly performance here.
            </p>
          </div>
        )}
        
        {days.map((day, i) => {
          const height = total === 0 ? 10 : (barHeights[i] || 5);
          return (
            <div key={day} className={`flex flex-col items-center gap-3 flex-1 group ${total === 0 ? "opacity-20" : "opacity-100"}`}>
              <div className="relative w-full flex flex-col justify-end h-[160px]">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 1, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full rounded-full relative overflow-hidden group-hover:brightness-110 transition-all border border-primary/20"
                  style={{
                    background: `linear-gradient(to top, var(--primary), #a78bfa)`,
                    boxShadow: `0 4px 12px var(--primary-glow)`,
                  }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
                {/* Background track */}
                <div className="absolute inset-0 w-full h-full bg-muted/20 -z-10 rounded-full" />
              </div>
              <span className="text-muted-foreground/60 text-[10px] font-black uppercase tracking-normaler">
                {day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/10">
        <div className="flex flex-col items-start px-2">
          <span className="text-foreground text-[18px] font-black tracking-normal leading-none mb-1">{total}</span>
          <span className="text-muted-foreground/50 text-[10px] font-black uppercase tracking-[0.05em]">
            Total
          </span>
        </div>
        <div className="flex flex-col items-start px-2">
          <span className="text-green-500 text-[18px] font-black tracking-normal leading-none mb-1">{done}</span>
          <span className="text-muted-foreground/50 text-[10px] font-black uppercase tracking-[0.05em]">
            Done
          </span>
        </div>
        <div className="flex flex-col items-start px-2">
          <span className="text-red-500 text-[18px] font-black tracking-normal leading-none mb-1">{overdue}</span>
          <span className="text-muted-foreground/50 text-[10px] font-black uppercase tracking-[0.05em]">
            Overdue
          </span>
        </div>
      </div>
    </GlassPanel>
  );
}

