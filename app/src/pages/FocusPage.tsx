import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassButton } from "../components/ui/glass-button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

type TimerMode = "pomodoro" | "short" | "long";

const MODE_DURATIONS: Record<TimerMode, number> = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};

export function FocusPage() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODE_DURATIONS.pomodoro);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft]);

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex-1 flex flex-col px-10 py-6 items-center justify-center font-['DM_Sans']"
    >
      <motion.div variants={itemVariants} className="mb-10 text-center">
        <h1 className="bg-gradient-to-b from-[#ccbaff] to-[#784cfe] bg-clip-text text-transparent text-[42px] tracking-[-2px] font-bold">
          Focus Protocol
        </h1>
        <p className="text-[#784cfe] text-[14px] mt-1 font-medium italic opacity-80">
          Eliminate distractions. Execute the objective.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-3 mb-12 bg-[rgba(30,30,35,0.5)] p-1.5 rounded-2xl border border-[rgba(255,255,255,0.05)] backdrop-blur-xl">
        {(["pomodoro", "short", "long"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`px-6 py-2 rounded-xl text-[11px] tracking-[1px] font-bold transition-all ${mode === m
              ? "bg-[#784cfe] text-white shadow-[0_0_20px_rgba(120,76,254,0.3)]"
              : "text-[#666] hover:text-[#999] hover:bg-white/5"
              }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="relative w-[340px] h-[340px] rounded-full bg-[rgba(20,20,25,0.6)] border border-[rgba(255,255,255,0.05)] backdrop-blur-3xl flex flex-col items-center justify-center shadow-[0_0_80px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0 rounded-full border-2 border-[#784cfe] border-t-transparent animate-[spin_4s_linear_infinite] opacity-30" />
        <div className="absolute inset-4 rounded-full border border-[#784cfe]/10" />
        <span className="text-[84px] text-white tracking-[-4px] font-bold font-mono">
          {formatTime(timeLeft)}
        </span>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center gap-8 mt-12">
        <button
          onClick={resetTimer}
          className="w-14 h-14 rounded-2xl bg-[rgba(60,60,60,0.2)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] hover:border-[#784cfe]/30 transition-all text-[#666] hover:text-[#784cfe]"
        >
          <RotateCcw size={22} />
        </button>

        <GlassButton
          onClick={toggleTimer}
          size="lg"
          className="!rounded-[32px]"
          contentClassName="flex items-center justify-center w-24 h-24"
        >
          {isActive ? (
            <Pause size={40} className="text-white fill-white" />
          ) : (
            <Play size={40} className="text-white fill-white ml-2" />
          )}
        </GlassButton>

        <button
          className="w-14 h-14 rounded-2xl bg-[rgba(60,60,60,0.2)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] hover:border-[#784cfe]/30 transition-all text-[#666] hover:text-[#784cfe]"
        >
          <Target size={22} />
        </button>
      </motion.div>
    </motion.div>
  );
}