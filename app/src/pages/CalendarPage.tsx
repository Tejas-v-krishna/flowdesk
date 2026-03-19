import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router";
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Video, Pencil, Coffee, Dumbbell } from "lucide-react";
import { GlassPanel } from "../components/GlassPanel";
import { GlassButton } from "../components/ui/glass-button";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const pad = (n: number) => String(n).padStart(2, "0");
const dateKey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

const CATEGORY_COLORS: Record<string, any> = {
  meeting: { bg: "rgba(120,76,254,0.12)", text: "#ccbaff", dot: "#784cfe", border: "rgba(120,76,254,0.25)" },
  focus: { bg: "rgba(59,191,255,0.1)", text: "#7dd3fc", dot: "#3bbfff", border: "rgba(59,191,255,0.2)" },
  social: { bg: "rgba(251,146,60,0.1)", text: "#fdba74", dot: "#fb923c", border: "rgba(251,146,60,0.2)" },
  health: { bg: "rgba(52,211,153,0.1)", text: "#6ee7b7", dot: "#34d399", border: "rgba(52,211,153,0.2)" },
  deadline: { bg: "rgba(251,113,133,0.1)", text: "#fda4af", dot: "#fb7185", border: "rgba(251,113,133,0.2)" },
};

const EVENT_ICON_MAP: Record<string, any> = { video: Video, pencil: Pencil, coffee: Coffee, dumbbell: Dumbbell };

export function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [searchParams, setSearchParams] = useSearchParams();
  const events = useMemo(() => {
    const y = now.getFullYear(); const m = now.getMonth(); const d = now.getDate();
    return {
      [dateKey(y, m, d)]: [{ id: "1", title: "Standup", time: "09:00", category: "meeting", icon: "video" }],
      [dateKey(y, m, d + 1)]: [{ id: "2", title: "Design Review", time: "11:00", category: "meeting", icon: "video" }]
    };
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => month === 0 ? (setMonth(11), setYear(year - 1)) : setMonth(month - 1);
  const nextMonth = () => month === 11 ? (setMonth(0), setYear(year + 1)) : setMonth(month + 1);

  const selectedKey = dateKey(year, month, selectedDay);
  const selectedEvents = events[selectedKey] ?? [];

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) currentWeek.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push(d);
    if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = []; }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex-1 flex flex-col px-8 py-5 gap-5">
      <div className="flex items-center justify-between">
        <h1 className="bg-gradient-to-b from-[#ccbaff] to-[#784cfe] bg-clip-text text-transparent text-[30px] font-bold">{MONTH_NAMES[month]} {year}</h1>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 bg-[rgba(40,40,40,0.6)] rounded-lg"><ChevronLeft size={16} className="text-[#999]" /></button>
          <GlassButton onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); setSelectedDay(now.getDate()); }} size="sm" contentClassName="text-[11px] font-semibold">TODAY</GlassButton>
          <button onClick={nextMonth} className="p-2 bg-[rgba(40,40,40,0.6)] rounded-lg"><ChevronRight size={16} className="text-[#999]" /></button>
        </div>
      </div>
      <div className="flex-1 flex gap-5">
        <GlassPanel as={motion.div} className="flex-[1.6] p-5">
          <div className="grid grid-cols-7 mb-4">{DAYS.map(d => <div key={d} className="text-center text-[10px] text-[#777] font-semibold">{d}</div>)}</div>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 h-16">
              {week.map((day, di) => (
                <div key={di} onClick={() => day && setSelectedDay(day)} className={`flex flex-col items-center justify-center rounded-xl cursor-pointer ${day === selectedDay ? "bg-[rgba(120,76,254,0.15)]" : ""}`}>
                  {day && <span className={`text-[13px] ${day === now.getDate() && month === now.getMonth() && year === now.getFullYear() ? "text-[#784cfe] font-bold" : "text-[#999]"}`}>{day}</span>}
                </div>
              ))}
            </div>
          ))}
        </GlassPanel>
        <GlassPanel as={motion.div} className="flex-1 p-5 overflow-y-auto">
          <h2 className="text-[24px] font-bold text-[#ccbaff] mb-4">{pad(selectedDay)} {MONTH_NAMES[month]}</h2>
          <AnimatePresence>
            {selectedEvents.map(ev => (
              <motion.div key={ev.id} variants={itemVariants} className="p-4 rounded-xl mb-3 border border-[rgba(80,80,80,0.2)] bg-[rgba(40,40,40,0.4)]">
                <div className="flex items-center justify-between"><span className="text-[11px] text-[#784cfe] font-bold">{ev.time}</span></div>
                <h4 className="text-[14px] text-white font-semibold">{ev.title}</h4>
              </motion.div>
            ))}
          </AnimatePresence>
        </GlassPanel>
      </div>
    </motion.div>
  );
}