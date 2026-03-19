import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Copy } from "lucide-react";
import { GlassPanel } from "../components/GlassPanel";
import { GlassButton } from "../components/ui/glass-button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

interface VelocityData {
  day: string;
  tasks: number;
}

interface PortfolioData {
  label: string;
  value: number;
  color: string;
}

interface Stat {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  sub: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const heatColors = ["#0d0d0d", "#1a3a1a", "#2d5a2d", "#42ff6b"];

function DonutChart() {
  return (
    <svg viewBox="0 0 100 100" width="120" height="120">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#333" strokeWidth="20" />
      <text x="50" y="55" textAnchor="middle" fill="#999" fontSize="12" fontWeight="bold">
        DATA
      </text>
    </svg>
  );
}

const AnalyticsPage = () => {
  const [velocityData, setVelocityData] = useState<VelocityData[]>([]);
  const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([]);
  const [heatmap, setHeatmap] = useState<number[][]>([]);
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const velocityResponse = await axios.get("/api/analytics/velocity");
        setVelocityData(velocityResponse.data);

        const portfolioResponse = await axios.get("/api/analytics/portfolio");
        setPortfolioData(portfolioResponse.data);

        const heatmapResponse = await axios.get("/api/analytics/heatmap");
        setHeatmap(heatmapResponse.data);

        const statsResponse = await axios.get("/api/analytics/stats");
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-5 p-6 overflow-y-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-end justify-between px-2">
        <div>
          <h1
            className="bg-gradient-to-b from-[#ccbaff] to-[#784cfe] bg-clip-text text-transparent text-[32px] tracking-[-1.5px]"
            style={{ fontWeight: 700, lineHeight: 1.2 }}
          >
            Analytics
          </h1>
          <p className="text-[#777] text-[13px] tracking-[-0.3px] mt-0.5">
            Operational Performance Report /{" "}
            <span className="text-[#784cfe]" style={{ fontWeight: 500 }}>
              Last 7 Days
            </span>
          </p>
        </div>
        <GlassButton size="sm" contentClassName="flex items-center gap-2 text-[12px] font-semibold">
          Export Data
          <Copy size={12} />
        </GlassButton>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-4 gap-4 px-2">
        {stats.map((s) => (
          <GlassPanel
            key={s.label}
            as={motion.div}
            variants={itemVariants}
            className="p-5 flex flex-col hover:shadow-[0_0_20px_rgba(120,76,254,0.1)] transition-all group"
            rounded="20px"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: s.iconBg }}
              >
                <s.icon size={20} style={{ color: s.iconColor }} />
              </div>
              <button className="w-7 h-7 rounded-lg border border-[rgba(80,80,80,0.25)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:border-[rgba(120,76,254,0.4)]">
                <Copy size={11} className="text-[#666]" />
              </button>
            </div>
            <span
              className="text-white text-[28px] tracking-[-1.5px]"
              style={{ fontWeight: 700, lineHeight: 1.1 }}
            >
              {s.value}
            </span>
            <span
              className="text-[#666] text-[9px] tracking-[1px] mt-1"
              style={{ fontWeight: 700 }}
            >
              {s.label}
            </span>
            <span className="text-[#555] text-[11px] mt-0.5">{s.sub}</span>
          </GlassPanel>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-[1.6fr_1fr] gap-4 px-2">
        {/* Productivity Velocity */}
        <GlassPanel as={motion.div} variants={itemVariants} className="p-5" rounded="20px">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-[#999] text-[10px] tracking-[1px]"
              style={{ fontWeight: 700 }}
            >
              PRODUCTIVITY VELOCITY
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#784cfe]" />
              <span className="text-[#666] text-[10px] tracking-[0.5px]" style={{ fontWeight: 600 }}>
                COMPLETED TASKS
              </span>
            </div>
          </div>
          <div className="h-[220px]">
            <svg width={0} height={0} style={{ position: "absolute" }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#784cfe" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#784cfe" stopOpacity={0.02} />
                </linearGradient>
              </defs>
            </svg>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#666", fontSize: 10, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#555", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(25,25,30,0.95)",
                    border: "1px solid rgba(80,80,80,0.3)",
                    borderRadius: 10,
                    fontSize: 12,
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#784cfe" }}
                />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="#784cfe"
                  strokeWidth={2.5}
                  fill="url(#areaGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#784cfe", stroke: "#ccbaff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        {/* Project Portfolio */}
        <GlassPanel as={motion.div} variants={itemVariants} className="p-5 flex flex-col" rounded="20px">
          <h3
            className="text-[#999] text-[10px] tracking-[1px] mb-4"
            style={{ fontWeight: 700 }}
          >
            PROJECT PORTFOLIO
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <DonutChart />
          </div>
          <div className="flex flex-col gap-2.5 mt-4">
            {portfolioData.map((d) => (
              <div key={d.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span
                    className="text-[#777] text-[9px] tracking-[0.5px]"
                    style={{ fontWeight: 600 }}
                  >
                    {d.label}
                  </span>
                </div>
                <span
                  className="text-white text-[12px] tabular-nums"
                  style={{ fontWeight: 600 }}
                >
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Productivity Heatmap */}
      <GlassPanel as={motion.div} variants={itemVariants} className="p-5 mx-2 mb-6" rounded="20px">
        <h3
          className="text-[#666] text-[10px] tracking-[1px] text-center mb-4"
          style={{ fontWeight: 700 }}
        >
          PRODUCTIVITY HEATMAP
        </h3>
        <div className="flex justify-center gap-[3px]">
          {heatmap.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((level, di) => (
                <div
                  key={di}
                  className="w-[14px] h-[14px] rounded-[3px] hover:scale-125 transition-transform cursor-pointer"
                  style={{ backgroundColor: heatColors[level] }}
                />
              ))}
            </div>
          ))}
        </div>
        <p className="text-[#555] text-[10px] text-center mt-3 tracking-[-0.2px]">
          Visualizing consistency patterns and operational focus
        </p>
      </GlassPanel>
    </motion.div>
  );
};

export { AnalyticsPage };
export default AnalyticsPage;