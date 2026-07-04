import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Target, LineChart, Focus, Activity } from "lucide-react";

const features = [
  { id: "brain", label: "AI Mission Control", icon: Brain },
  { id: "goals", label: "Goal Matrix", icon: Target },
  { id: "finance", label: "Finance Pulse", icon: LineChart },
  { id: "focus", label: "Focus HUD", icon: Focus },
  { id: "tasks", label: "Task Ecosystem", icon: Activity },
];

export const LandingFeatures = () => {
  const [activeTab, setActiveTab] = useState("brain");

  return (
    <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-background relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Autonomous execution. <br/> Total control.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Flowdesk centralizes your entire operational stack. From cognitive biometrics to runway management.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeTab === feature.id;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  isActive 
                    ? "bg-foreground text-background shadow-lg scale-105" 
                    : "bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-background" : "text-foreground/50"}`} />
                {feature.label}
              </button>
            );
          })}
        </div>

        {/* Bento Grid Showcase */}
        <div className="w-full max-w-5xl aspect-video rounded-[2.5rem] bg-white/5 border border-white/10 p-2 overflow-hidden mb-32 relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-cyan-500/10 opacity-50 transition-opacity group-hover:opacity-100" />
          <div className="w-full h-full rounded-[2rem] bg-black/60 backdrop-blur-3xl border border-white/5 flex items-center justify-center p-12 relative overflow-hidden">
            {/* Abstract visual representation based on tab */}
            {activeTab === "brain" && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(16,185,129,0.3)] border border-emerald-500/30">
                  <Brain className="w-12 h-12 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Claude-Powered Insights</h3>
                <p className="text-white/60 max-w-md">Real-time analysis of your productivity momentum, burn rate, and strategic alignment.</p>
              </motion.div>
            )}
            {activeTab === "goals" && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(6,182,212,0.3)] border border-cyan-500/30">
                  <Target className="w-12 h-12 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Convergence Analysis</h3>
                <p className="text-white/60 max-w-md">Track quarterly KPIs with AI-driven scores comparing actual output against objectives.</p>
              </motion.div>
            )}
            {/* Fallback for others just to show interaction */}
            {["finance", "focus", "tasks"].includes(activeTab) && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                 <h3 className="text-3xl font-bold mb-4 capitalize">{activeTab} module operational</h3>
                 <div className="flex gap-4 justify-center">
                    <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-emerald-400 w-3/4" /></div>
                 </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Global Scale Section */}
        <div id="autonomous" className="w-full text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Engineered for High Performance.<br/>Execute Without Friction.
          </h2>
          
          <div className="flex justify-center gap-12 md:gap-32 mt-12 mb-16">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-black text-foreground">100+</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mt-2">Integrations</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-black text-foreground">Sub-50ms</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mt-2">Latency Sync</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-black text-foreground">99.99%</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mt-2">OS Uptime</div>
            </div>
          </div>

          {/* Dotted Map / Node Graph representation */}
          <div className="w-full max-w-4xl mx-auto opacity-30 invert dark:invert-0 relative h-64 mb-16">
             {/* Using a stylized grid to represent nodes */}
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent z-10" />
             <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
             {/* Highlight Nodes */}
             <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981] animate-pulse" />
             <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_20px_#06b6d4] animate-pulse" style={{ animationDelay: '1s' }} />
             <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-violet-500 rounded-full shadow-[0_0_20px_#8b5cf6] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        {/* 3 Column Feature Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/10 transition-colors group">
             <div className="h-40 w-full rounded-2xl bg-black/40 border border-white/10 mb-6 flex items-center justify-center overflow-hidden">
                <div className="w-full h-1/2 bg-gradient-to-r from-emerald-500/20 to-transparent flex items-center px-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/40 flex items-center justify-center"><Activity className="w-4 h-4 text-emerald-400" /></div>
                </div>
             </div>
             <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">Frictionless Task Routing</h3>
             <p className="text-muted-foreground text-sm leading-relaxed">Streamline projects with instant Kanban drag-and-drop. Our intelligent routing dynamically reprioritizes your stack.</p>
          </div>
          
          <div className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/10 transition-colors group">
             <div className="h-40 w-full rounded-2xl bg-black/40 border border-white/10 mb-6 flex items-center justify-center overflow-hidden">
                <div className="w-24 h-24 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin-slow flex items-center justify-center">
                  <Focus className="w-6 h-6 text-cyan-400" />
                </div>
             </div>
             <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">Deploy Custom Focus States</h3>
             <p className="text-muted-foreground text-sm leading-relaxed">Enter deep work instantly. Built-in Pomodoro, ambient mixers, and biometric tracking to keep you in flow.</p>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/10 transition-colors group">
             <div className="h-40 w-full rounded-2xl bg-black/40 border border-white/10 mb-6 p-4 flex flex-col gap-2">
                <div className="w-full h-8 bg-white/5 rounded-lg flex items-center px-3"><div className="w-1/2 h-2 bg-white/20 rounded-full" /></div>
                <div className="w-full h-8 bg-white/5 rounded-lg flex items-center px-3"><div className="w-3/4 h-2 bg-violet-400/50 rounded-full" /></div>
                <div className="w-full h-8 bg-white/5 rounded-lg flex items-center px-3"><div className="w-1/3 h-2 bg-white/20 rounded-full" /></div>
             </div>
             <h3 className="text-xl font-bold mb-3 group-hover:text-violet-400 transition-colors">Autonomous Goal Alignment</h3>
             <p className="text-muted-foreground text-sm leading-relaxed">The AI constantly measures your daily output against long-term strategic objectives, correcting your trajectory.</p>
          </div>
        </div>

      </div>
    </section>
  );
};
