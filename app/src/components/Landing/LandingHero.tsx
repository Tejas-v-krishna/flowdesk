import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Zap, BarChart3, Target } from "lucide-react";
import { Link } from "react-router-dom";

export const LandingHero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Landscape Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700" 
          style={{ backgroundImage: "url('/hero_landscape.png')" }}
        />
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background z-0" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Premium Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-[6.5rem] leading-[1.1] font-bold tracking-tight mb-6 text-white drop-shadow-lg"
        >
          <span className="block">Deep Work,</span>
          <span className="block opacity-90">Total Control.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="max-w-2xl text-lg md:text-2xl text-white/90 mb-10 drop-shadow-md font-medium"
        >
          Personal OS driven by AI. Manage tasks, finances, and operational biometrics in one unified ecosystem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <Link
            to="/login"
            className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Deploy Workspace
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg transition-all hover:-translate-y-1"
          >
            Explore AI
          </Link>
        </motion.div>

        {/* Floating Glass Panel Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 50 }}
          className="w-full max-w-4xl relative"
        >
          {/* Main Card */}
          <div className="relative z-20 aspect-video md:aspect-[2/1] rounded-3xl overflow-hidden border border-white/20 bg-background/40 backdrop-blur-2xl shadow-2xl p-1 md:p-2">
            <div className="w-full h-full rounded-2xl bg-black/40 border border-white/10 flex flex-col overflow-hidden relative">
              {/* Header */}
              <div className="h-12 border-b border-white/10 flex items-center px-4 justify-between bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <div className="text-xs font-medium text-white/50 tracking-widest uppercase">Mission Control</div>
                <div className="w-16"></div>
              </div>
              
              {/* Body */}
              <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* AI Executive Summary */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">AI Executive Brief</div>
                      <div className="text-xs text-emerald-400">Systems Operational</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-sm text-white/80 leading-relaxed">
                      "Your focus momentum is up 14% this week. I recommend shifting your deep work block to 9:00 AM based on your biometrics. The SaaS release is on track for Friday."
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[75%] rounded-full" />
                    </div>
                    <div className="text-xs font-bold text-white">75% Velocity</div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="col-span-1 flex flex-col gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white/60">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-xs font-medium">Burn Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-white">$4,200</div>
                    <div className="text-xs text-emerald-400">-12% vs last month</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white/60">
                      <Target className="w-4 h-4" />
                      <span className="text-xs font-medium">Goal Alignment</span>
                    </div>
                    <div className="text-2xl font-bold text-white">94%</div>
                    <div className="text-xs text-emerald-400">Highly Aligned</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Floating UI elements behind */}
          <div className="absolute -top-10 -right-10 w-64 h-32 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl z-10 rotate-6 shadow-xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-72 h-40 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl z-10 -rotate-3 shadow-xl animate-pulse" style={{ animationDelay: "1s" }} />

        </motion.div>
      </div>

      {/* Integrations Bar */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center opacity-70">
        <div className="flex items-center gap-8 md:gap-16 text-white/50 text-sm font-bold uppercase tracking-widest mix-blend-overlay">
          <span>Stripe</span>
          <span>GitHub</span>
          <span>OpenAI</span>
          <span>Plaid</span>
          <span>Figma</span>
        </div>
      </div>
    </section>
  );
};
