import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

type TimerMode = "pomodoro" | "short" | "long";

const MODE_DURATIONS: Record<TimerMode, number> = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const MODE_LABELS: Record<TimerMode, string> = {
  pomodoro: "Focus Session",
  short: "Short Break",
  long: "Long Break",
};

export function FocusPage() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODE_DURATIONS.pomodoro);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer completed
      setIsActive(false);
      setSessionsCompleted((prev) => prev + 1);

      // Show toast notification
      const label = MODE_LABELS[mode];
      toast.success(`${label} complete! 🎯`, {
        duration: 5000,
      });

      // Browser notification (if permission granted)
      if (Notification.permission === "granted") {
        new Notification("Flowdesk Focus", {
          body: `${label} complete! Time for ${mode === "pomodoro" ? "a break" : "focus"}.`,
          icon: "/Group 5.svg",
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = timeLeft / MODE_DURATIONS[mode];
  const circumference = 2 * Math.PI * 190;
  const strokeOffset = circumference * progress;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex-1 flex flex-col p-8 items-center justify-center font-sans bg-background overflow-hidden"
    >
      <motion.div variants={itemVariants} className="mb-10 text-center">
        <p className="text-muted-foreground font-medium tracking-widest text-xs uppercase mb-2">
          Focus Timer
        </p>
        <h1 className="text-foreground text-5xl tracking-normal leading-none font-semibold mb-3">
          Deep Work
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Eliminate distractions. Execute the objective.
        </p>
        {sessionsCompleted > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="px-3 py-1 rounded bg-muted text-xs font-medium text-foreground">
              {sessionsCompleted} session{sessionsCompleted !== 1 ? "s" : ""} completed today
            </div>
          </div>
        )}
      </motion.div>

      {/* Mode Selector */}
      <motion.div
        variants={itemVariants}
        className="flex gap-2 mb-12 p-1.5 rounded-full bg-muted/50 border border-border"
      >
        {(["pomodoro", "short", "long"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`px-6 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              mode === m
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {m === "pomodoro" ? "Focus" : m === "short" ? "Short Break" : "Long Break"}
          </button>
        ))}
      </motion.div>

      {/* Timer Ring */}
      <motion.div
        variants={itemVariants}
        className="relative w-[360px] h-[360px] md:w-[400px] md:h-[400px] rounded-full flex flex-col items-center justify-center"
      >
        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="190"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-border"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="190"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            transition={{ duration: 0.5, ease: "linear" }}
            className="text-foreground"
          />
        </svg>

        <div className="relative z-10 flex flex-col items-center justify-center translate-y-2">
          <span className="text-7xl md:text-[100px] text-foreground tracking-normaler font-semibold tabular-nums leading-none">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-6">
            {MODE_LABELS[mode]}
          </span>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div variants={itemVariants} className="flex items-center gap-8 mt-12">
        <button
          onClick={resetTimer}
          className="group w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground active:scale-95"
        >
          <RotateCcw size={20} className="group-hover:-rotate-45 transition-transform" />
        </button>

        <button
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 ${
            isActive
              ? "bg-muted text-foreground border border-border"
              : "bg-foreground text-background"
          }`}
        >
          {isActive ? (
            <Pause size={32} className="fill-current" />
          ) : (
            <Play size={32} className="fill-current ml-1" />
          )}
        </button>

        <button
          onClick={() => {
            if (Notification.permission !== "granted") {
              Notification.requestPermission().then((perm) => {
                if (perm === "granted") toast.success("Notifications enabled!");
              });
            } else {
              toast("Notifications are already enabled", { icon: "🔔" });
            }
          }}
          className="group w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground active:scale-95"
          title="Enable notifications"
        >
          <Bell size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      </motion.div>
    </motion.div>
  );
}

