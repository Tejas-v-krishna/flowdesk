import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export const LandingHero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 hero-grid pointer-events-none opacity-50 dark:opacity-100 z-0" />
      <div className="absolute inset-0 noise-overlay z-0" />

      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[120px] pointer-events-none animate-blob z-0" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none animate-blob animation-delay-2000 z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full landing-glass border border-white/10 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium tracking-wide">Flowdesk OS 2.0 is now live</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="block text-foreground">Your Personal</span>
          <span className="block gradient-text italic pr-2">Productivity OS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10"
        >
          Transform complex workflows into seamless deep-work experiences. 
          Manage tasks, strategic goals, finances, and biometrics in one unified ecosystem powered by AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <Link
            to="/login"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-medium shimmer-btn hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(124,58,237,0.3)]"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="px-8 py-4 rounded-xl text-foreground font-medium landing-glass hover:bg-white/10 transition-colors duration-300"
          >
            View Features
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative w-full max-w-5xl mx-auto rounded-2xl md:rounded-[32px] p-2 md:p-4 landing-glass glow-violet"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl md:rounded-[32px] pointer-events-none" />
          
          <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-white/10 bg-background/80 backdrop-blur-xl aspect-[16/9] shadow-2xl flex items-center justify-center">
            <div className="absolute inset-0 p-4 md:p-8 grid grid-cols-12 gap-4 md:gap-6 opacity-70">
              <div className="col-span-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-4 p-4 hidden md:flex">
                <div className="w-full h-8 rounded-lg bg-white/10 mb-8" />
                <div className="w-3/4 h-4 rounded bg-white/10" />
                <div className="w-1/2 h-4 rounded bg-white/10" />
                <div className="w-2/3 h-4 rounded bg-white/10" />
              </div>
              <div className="col-span-12 md:col-span-9 flex flex-col gap-4 md:gap-6">
                <div className="w-full h-16 rounded-xl bg-white/5 border border-white/5 flex items-center px-6">
                  <div className="w-1/3 h-6 rounded bg-white/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 flex-1">
                  <div className="col-span-1 md:col-span-2 rounded-xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20 p-6 flex flex-col justify-end">
                    <div className="w-1/2 h-8 rounded bg-violet-500/20 mb-4" />
                    <div className="flex items-end gap-2 h-32">
                      {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-violet-500/40 rounded-t-sm" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="hidden md:flex col-span-1 rounded-xl bg-white/5 border border-white/5 flex-col gap-4 p-6">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 mx-auto" />
                    <div className="w-3/4 h-4 rounded bg-white/10 mx-auto mt-4" />
                    <div className="w-1/2 h-4 rounded bg-white/10 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div 
              className="absolute z-20 flex items-center justify-center flex-col animate-float"
            >
              <div className="px-6 py-4 rounded-2xl liquid-glass shadow-2xl border border-white/20 flex flex-col items-center">
                <Activity className="w-10 h-10 text-cyan-400 mb-2" />
                <span className="text-xl font-bold">99.8%</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Goal Convergence</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-4xl mx-auto mt-24 pb-10 border-t border-white/10 pt-10"
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-foreground mb-1">500+</span>
            <span className="text-sm text-muted-foreground">High Performers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-foreground mb-1">1M+</span>
            <span className="text-sm text-muted-foreground">Tasks Completed</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-foreground mb-1">$2B+</span>
            <span className="text-sm text-muted-foreground">Assets Tracked</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-foreground mb-1">99.9%</span>
            <span className="text-sm text-muted-foreground">System Uptime</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
