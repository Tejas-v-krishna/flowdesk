import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { GlassPanel } from "./GlassPanel";
import { motion } from "framer-motion";
import { Zap, Clock, Target, TrendingUp } from "lucide-react";

const focusData = [
  { hour: "08:00", value: 30 },
  { hour: "10:00", value: 85 },
  { hour: "12:00", value: 45 },
  { hour: "14:00", value: 95 },
  { hour: "16:00", value: 70 },
  { hour: "18:00", value: 25 },
];

const categoryData = [
  { subject: "Engineering", A: 120, fullMark: 150 },
  { subject: "Design", A: 98, fullMark: 150 },
  { subject: "Analysis", A: 86, fullMark: 150 },
  { subject: "Planning", A: 99, fullMark: 150 },
  { subject: "Review", A: 85, fullMark: 150 },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export function OperationalBiometrics() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12"
    >
      {/* Peak Focus Hours */}
      <GlassPanel className="p-8 flex flex-col h-[400px]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-[18px] font-black tracking-normal leading-none mb-1">Peak Focus Velocity</h3>
              <p className="text-[12px] text-muted-foreground font-medium opacity-60 uppercase tracking-widest">Temporal Performance Analysis</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[24px] font-black text-primary">14:00</span>
            <p className="text-[10px] text-muted-foreground uppercase font-black">Peak Hour</p>
          </div>
        </div>

        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={focusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="hour" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(0,0,0,0.8)", 
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "12px"
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[6, 6, 0, 0]}
                fill="url(#focusGrad)"
              >
                <defs>
                  <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassPanel>

      {/* Skills / Category Radar */}
      <GlassPanel className="p-8 flex flex-col h-[400px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground">
            <Target size={20} />
          </div>
          <div>
            <h3 className="text-[18px] font-black tracking-normal leading-none mb-1">Operational Balance</h3>
            <p className="text-[12px] text-muted-foreground font-medium opacity-60 uppercase tracking-widest">Domain Allocation across initiatives</p>
          </div>
        </div>

        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 700 }}
              />
              <PolarRadiusAxis axisLine={false} tick={false} />
              <Radar
                name="Performance"
                dataKey="A"
                stroke="var(--primary)"
                strokeWidth={3}
                fill="var(--primary)"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </GlassPanel>

      {/* Summary Stats Row */}
      <motion.div variants={itemVariants} className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {[
          { label: "Deep Work Ratio", value: "72%", icon: <Zap size={16} />, color: "text-primary" },
          { label: "Execution Velocity", value: "+14%", icon: <TrendingUp size={16} />, color: "text-foreground" },
          { label: "Task Density", value: "4.2/hr", icon: <Target size={16} />, color: "text-foreground" },
          { label: "Focus Score", value: "920", icon: <Zap size={16} />, color: "text-foreground" },
        ].map((stat, i) => (
          <GlassPanel key={i} className="p-4 flex flex-col items-center justify-center text-center">
            <div className={`mb-2 ${stat.color} opacity-80`}>{stat.icon}</div>
            <div className="text-[20px] font-black leading-tight tracking-normal">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1 opacity-50">{stat.label}</div>
          </GlassPanel>
        ))}
      </motion.div>
    </motion.div>
  );
}

