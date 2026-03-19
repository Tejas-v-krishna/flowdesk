import { GlassPanel } from "./GlassPanel";
import { useEffect, useState } from "react";
import axios from "axios";

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

  // Basic overdue calculation
  const overdue = tasks.filter((t) => {
    if (t.status === "Done" || !t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const [barHeights, setBarHeights] = useState([]);

  useEffect(() => {
    const fetchBarHeights = async () => {
      try {
        const response = await axios.get(
          "/api/analytics/weekly-distribution"
        );
        setBarHeights(response.data);
      } catch (error) {
        console.error("Error fetching weekly distribution data:", error);
      }
    };

    fetchBarHeights();
  }, []);

  return (
    <GlassPanel blur={40} className="p-6 flex flex-col h-full">
      {/* Header */}
      <h3 className="text-foreground text-[16px] font-semibold tracking-tight mb-4">
        Weekly Distribution
      </h3>

      {/* Chart area */}
      <div className={`flex-1 flex items-end justify-center gap-3 px-2 pb-2 relative transition-all duration-500 ${total === 0 ? "min-h-[120px]" : "min-h-[180px]"}`}>
        {total === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center">
            <p className="text-foreground/80 text-[14px] font-bold tracking-tight mb-1">
              Your progress starts here
            </p>
            <p className="text-muted-foreground/60 text-[12px] font-medium leading-relaxed">
              Completed tasks will populate this weekly distribution chart.
            </p>
          </div>
        )}
        {days.map((day, i) => (
          <div key={day} className={`flex flex-col items-center gap-2 flex-1 transition-opacity duration-500 ${total === 0 ? "opacity-20" : "opacity-100"}`}>
            <div
              className="relative w-full rounded-xl overflow-hidden transition-all duration-300 group"
              style={{
                height: `${total === 0 ? 15 : barHeights[i]}%`,
                background: "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              {/* hover glow */}
              {total > 0 && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/20"
                />
              )}
            </div>
            <span className="text-muted-foreground text-[10px] font-semibold tracking-wide">
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex justify-between mt-3 pt-4 border-t border-border/50">
        <div className="flex flex-col items-center">
          <span className="text-foreground text-[14px] font-bold">{total}</span>
          <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
            Total
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-foreground text-[14px] font-bold">{done}</span>
          <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
            Done
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-destructive/80 text-[14px] font-bold">{overdue}</span>
          <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
            Overdue
          </span>
        </div>
      </div>
    </GlassPanel>
  );
}
