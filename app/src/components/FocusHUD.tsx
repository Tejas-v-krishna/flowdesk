import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Music,
  Wind,
  Volume2
} from "lucide-react";

interface FocusHUDProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FocusHUD({ isOpen, onClose }: FocusHUDProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [activeSound, setActiveSound] = useState<"none" | "lofi" | "rain" | "waves">("none");

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-8 backdrop-blur-3xl"
        >
          {/* Ambient Background Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px] animate-pulse" />
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white"
          >
            <X size={24} />
          </button>

          {/* HUD Content */}
          <div className="relative z-10 flex flex-col items-center max-w-4xl w-full text-center">
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-primary font-black tracking-[0.4em] text-[12px] uppercase mb-12 opacity-40"
            >
              Session Active: deep work protocol
            </motion.p>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="mb-20"
            >
              <h1 className="text-[200px] leading-none font-black tracking-[-0.05em] text-white tabular-nums">
                {formatTime(timeLeft)}
              </h1>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-12"
            >
              <button
                onClick={resetTimer}
                className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white"
              >
                <RotateCcw size={24} />
              </button>

              <button
                onClick={toggleTimer}
                className={`w-24 h-24 rounded-[3rem] flex items-center justify-center transition-all shadow-2xl active:scale-95 ${
                  isActive 
                    ? "bg-card text-black" 
                    : "bg-primary text-primary-foreground shadow-primary/30"
                }`}
              >
                {isActive ? <Pause size={40} className="fill-current" /> : <Play size={40} className="fill-current ml-2" />}
              </button>

              <div className="flex bg-white/5 rounded-2xl border border-white/10 p-1">
                <button 
                  onClick={() => setActiveSound(activeSound === "lofi" ? "none" : "lofi")}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${activeSound === "lofi" ? "bg-primary text-white" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                >
                  <Music size={20} />
                </button>
                <button 
                  onClick={() => setActiveSound(activeSound === "rain" ? "none" : "rain")}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${activeSound === "rain" ? "bg-primary text-white" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                >
                  <Wind size={20} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Subtle Bottom Controls */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 opacity-20 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3 text-white/60">
              <Volume2 size={16} />
              <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-primary" />
              </div>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="text-[11px] font-black uppercase tracking-widest text-white/60">
              Flowdesk Premium • Version 2.0
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
