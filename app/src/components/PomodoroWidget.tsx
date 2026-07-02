import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap, Timer as TimerIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

type Mode = 'work' | 'short' | 'long';

const CONFIG = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

export function PomodoroWidget() {
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState(CONFIG.work);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const timerRef = useRef<number | null>(null);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(CONFIG[mode]);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(CONFIG[newMode]);
    setIsActive(false);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (isActive) {
        toast.success(mode === 'work' ? 'Time for a break!' : 'Resuming focus session.');
        if (mode === 'work') setSessions(s => s + 1);
        setIsActive(false);
        // Auto-switch logic
        if (mode === 'work') {
          switchMode(sessions > 0 && sessions % 3 === 0 ? 'long' : 'short');
        } else {
          switchMode('work');
        }
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, sessions]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = (timeLeft / CONFIG[mode]) * 100;

  return (
    <div className="w-full px-4 py-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TimerIcon size={16} className="text-primary" />
          <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Logic Timer</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i < (sessions % 4) ? 'bg-primary' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="white"
              strokeOpacity="0.05"
              strokeWidth="6"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={251}
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: 251 * (1 - progress / 100) }}
              transition={{ ease: "linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-foreground tabular-nums">{formatTime(timeLeft)}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">{mode}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetTimer}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground transition-all active:scale-95"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={toggleTimer}
            className="p-3 rounded-2xl bg-primary shadow-lg shadow-primary/20 text-white hover:scale-105 transition-all active:scale-95"
          >
            {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>
          <button
            onClick={() => switchMode(mode === 'work' ? 'short' : 'work')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground transition-all active:scale-95"
          >
             {mode === 'work' ? <Coffee size={16} /> : <Zap size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
