import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const pad = (n: number) => String(n).padStart(2, "0");
const dateKey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

export function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  const events = useMemo(() => {
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    return {
      [dateKey(y, m, d)]: [
        { id: "1", title: "Standup", time: "09:00", category: "meeting" },
      ],
      [dateKey(y, m, d + 1)]: [
        { id: "2", title: "Design Review", time: "11:00", category: "meeting" },
      ],
    };
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () =>
    month === 0 ? (setMonth(11), setYear(year - 1)) : setMonth(month - 1);
  const nextMonth = () =>
    month === 11 ? (setMonth(0), setYear(year + 1)) : setMonth(month + 1);

  const selectedKey = dateKey(year, month, selectedDay);
  const selectedEvents = events[selectedKey] ?? [];

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) currentWeek.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  const isToday = (day: number | null) =>
    day !== null &&
    day === now.getDate() &&
    month === now.getMonth() &&
    year === now.getFullYear();

  const isSelected = (day: number | null) => day !== null && day === selectedDay;
  const hasEvent = (day: number | null) =>
    day !== null && !!events[dateKey(year, month, day)];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex-1 flex flex-col p-6 md:p-8 w-full max-w-6xl mx-auto gap-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-normal text-foreground">
            {MONTH_NAMES[month]} {year}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 bg-transparent border border-border rounded-xl hover:bg-muted text-muted-foreground transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => {
              setYear(now.getFullYear());
              setMonth(now.getMonth());
              setSelectedDay(now.getDate());
            }}
            className="px-4 py-2 bg-foreground text-background text-xs font-medium rounded-xl hover:bg-foreground/90 transition-colors"
          >
            TODAY
          </button>
          <button
            onClick={nextMonth}
            className="p-2 bg-transparent border border-border rounded-xl hover:bg-muted text-muted-foreground transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Calendar Grid */}
        <div className="flex-[2] bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-4">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground uppercase tracking-normal">
                {d}
              </div>
            ))}
          </div>
          {/* Week rows */}
          <div className="flex-1 flex flex-col">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 flex-1 min-h-[80px]">
                {week.map((day, di) => (
                  <div
                    key={di}
                    onClick={() => day && setSelectedDay(day)}
                    className={`flex flex-col items-center p-2 rounded-2xl cursor-pointer relative transition-all ${
                      isSelected(day)
                        ? "bg-muted border border-border"
                        : day
                        ? "hover:bg-muted/50 border border-transparent"
                        : ""
                    }`}
                  >
                    {day && (
                      <>
                        <span
                          className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                            isToday(day)
                              ? "bg-foreground text-background"
                              : isSelected(day)
                              ? "text-foreground font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {day}
                        </span>
                        {/* Event dot */}
                        {hasEvent(day) && (
                          <div className="absolute bottom-3 w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Event Panel */}
        <div className="flex-1 bg-card border border-border rounded-xl p-6 shadow-sm overflow-y-auto">
          <h2 className="text-xl font-medium text-foreground mb-1">
            {pad(selectedDay)} {MONTH_NAMES[month]}
          </h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-normal mb-6">
            {isToday(selectedDay) ? "Today" : year !== now.getFullYear() ? String(year) : ""}
          </p>
          
          <AnimatePresence mode="wait">
            {selectedEvents.length > 0 ? (
              <motion.div
                key={selectedKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {selectedEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl border border-border bg-muted/30 hover:border-muted-foreground/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-foreground">{ev.time}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium px-2 py-0.5 rounded bg-muted">
                        {ev.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-foreground">{ev.title}</h4>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={selectedKey + "-empty"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center opacity-60"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                  <CalendarIcon size={20} />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No events scheduled</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

