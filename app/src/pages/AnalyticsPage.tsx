import { useState, useEffect } from "react";
import {
  CheckSquare,
  Clock,
  TrendingUp,
  Copy,
  Target,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { toast } from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const heatColors = ["transparent", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#4b5563"];

function DonutChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;
  return (
    <PieChart width={160} height={160}>
      <Pie
        data={data}
        cx={80}
        cy={80}
        innerRadius={52}
        outerRadius={72}
        dataKey="valueRaw"
        strokeWidth={0}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  );
}

export function AnalyticsPage() {
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['analytics_summary'],
    queryFn: () => api.get('/analytics/summary').then(r => r.data)
  });

  const { data: heatmapDataRaw } = useQuery({
    queryKey: ['analytics_heatmap'],
    queryFn: () => api.get('/analytics/heatmap').then(r => r.data)
  });

  const stats = [
    {
      label: "TASKS COMPLETED",
      value: summaryData?.stats?.completedTasks?.toString() || "0",
      sub: "Total all time",
      icon: CheckSquare,
    },
    {
      label: "TOTAL TASKS",
      value: summaryData?.stats?.totalTasks?.toString() || "0",
      sub: "All statuses",
      icon: Target,
    },
    {
      label: "ACTIVE PROJECTS",
      value: summaryData?.stats?.activeProjects?.toString() || "0",
      sub: "Currently ongoing",
      icon: Clock,
    },
    {
      label: "PRODUCTIVITY SCORE",
      value: (summaryData?.stats?.productivityScore || "0") + "%",
      sub: "Completion rate",
      icon: TrendingUp,
    },
  ];

  const velocityData = summaryData?.velocityData || [];
  
  // Transform portfolio data for Recharts (needs number for value)
  const portfolioData = (summaryData?.portfolioData || []).map((d: any) => ({
    ...d,
    valueRaw: parseInt(d.value) || 0
  }));

  // Generate heatmap grid
  const heatmap = [];
  const today = new Date();
  for (let w = 0; w < 12; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + d));
      const dateStr = date.toISOString().split('T')[0];
      const count = heatmapDataRaw ? heatmapDataRaw[dateStr] || 0 : 0;
      week.push(Math.min(count, 5));
    }
    heatmap.unshift(week.reverse());
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex-1 flex flex-col p-6 md:p-8 max-w-6xl mx-auto w-full gap-8 bg-background overflow-y-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-normal text-foreground">
            Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Operational Performance Report /{" "}
            <span className="text-foreground font-medium">Last 7 Days</span>
          </p>
        </div>
        <button
          onClick={() => toast.success("Data exported to clipboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-transparent border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          Export Data
          <Copy size={12} />
        </button>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={itemVariants}
            className="p-5 flex flex-col bg-card border border-border rounded-xl shadow-sm hover:border-muted-foreground/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-foreground">
                <s.icon size={18} />
              </div>
              <button
                className="w-7 h-7 rounded-xl border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted text-muted-foreground"
                onClick={() => toast.success(`${s.label}: ${s.value}`)}
              >
                <Copy size={12} />
              </button>
            </div>
            <span className="text-3xl font-semibold tracking-normal text-foreground mb-1">
              {s.value}
            </span>
            <span className="text-[10px] font-medium tracking-normal text-muted-foreground uppercase mb-1">
              {s.label}
            </span>
            <span className="text-[11px] text-muted-foreground/70">
              {s.sub}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        {/* Productivity Velocity */}
        <motion.div variants={itemVariants} className="p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-medium tracking-normal text-muted-foreground uppercase">
              Productivity Velocity
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-foreground" />
              <span className="text-[10px] tracking-normal font-medium text-muted-foreground uppercase">
                Completed Tasks
              </span>
            </div>
          </div>
          <div className="h-[220px]">
            <svg width={0} height={0} style={{ position: "absolute" }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--foreground)" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="var(--foreground)" stopOpacity={0} />
                </linearGradient>
              </defs>
            </svg>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "currentColor", opacity: 0.5, fontSize: 10, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "currentColor", opacity: 0.5, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--foreground)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="#71717a" 
                  strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--foreground)", stroke: "var(--background)", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Project Portfolio */}
        <motion.div variants={itemVariants} className="p-6 bg-card border border-border rounded-xl shadow-sm flex flex-col">
          <h3 className="text-xs font-medium tracking-normal text-muted-foreground uppercase mb-6">
            Project Portfolio
          </h3>
          <div className="flex-1 flex items-center justify-center mb-6">
            <DonutChart data={portfolioData} />
          </div>
          <div className="flex flex-col gap-3">
            {portfolioData.map((d: any) => (
              <div key={d.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-xl"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {d.label}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground tabular-nums">
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Productivity Heatmap */}
      <motion.div variants={itemVariants} className="p-8 bg-card border border-border rounded-xl shadow-sm flex flex-col items-center">
        <h3 className="text-xs font-medium tracking-normal text-muted-foreground uppercase mb-6">
          Productivity Heatmap
        </h3>
        <div className="flex justify-center gap-[4px] overflow-x-auto max-w-full pb-2">
          {heatmap.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[4px]">
              {week.map((level, di) => (
                <div
                  key={di}
                  className="w-4 h-4 rounded-xl border border-border hover:border-foreground/50 transition-colors cursor-pointer"
                  style={{ 
                    backgroundColor: level === 0 ? "transparent" : heatColors[level] ?? heatColors[5] 
                  }}
                  title={`${level} tasks`}
                />
              ))}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-6 font-medium">
          Visualizing consistency patterns and operational focus
        </p>
      </motion.div>
    </motion.div>
  );
}

