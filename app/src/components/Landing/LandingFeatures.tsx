import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, LineChart, Target, Zap, LayoutDashboard, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Brain AI & Mission Control",
    description: "Our Intelligence Layer actively analyzes your productivity context, injecting real-time tasks and focus states directly into prompt generation for unparalleled situational awareness.",
    icon: <BrainCircuit className="w-6 h-6 text-violet-400" />,
    className: "bento-lg bg-gradient-to-br from-violet-500/10 to-transparent border-violet-500/20"
  },
  {
    title: "Focus HUD",
    description: "Immerse yourself in deep work with our configurable Pomodoro widget, ambient sound mixer, and distraction-free UI.",
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    className: "bento-sm bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20"
  },
  {
    title: "Finance Pulse",
    description: "Live monitoring of Total Assets, Monthly Burn Rate, and AI Advisory that actively audits metrics.",
    icon: <LineChart className="w-6 h-6 text-emerald-400" />,
    className: "bento-sm bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20"
  },
  {
    title: "Goal Matrix",
    description: "Define and monitor high-level goals with AI convergence analysis to ensure daily tasks align with quarterly KPIs.",
    icon: <Target className="w-6 h-6 text-cyan-400" />,
    className: "bento-lg bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20"
  },
  {
    title: "Omni-Sync Architecture",
    description: "Changes update instantly across all devices. Drag-and-drop Kanban engines and global CMD+K palettes.",
    icon: <LayoutDashboard className="w-6 h-6 text-pink-400" />,
    className: "bento-sm bg-gradient-to-br from-pink-500/10 to-transparent border-pink-500/20"
  },
  {
    title: "Enterprise Grade",
    description: "Built for high-performance individuals who refuse to compromise on security and operational velocity.",
    icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
    className: "bento-sm bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20"
  }
];

export const LandingFeatures = () => {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Simple Steps to <span className="gradient-text italic">Smarter Output</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Automate operational mechanics, map resource distribution, and surface deep insights seamlessly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`feature-card landing-glass p-8 rounded-3xl border flex flex-col gap-4 relative overflow-hidden ${feature.className}`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4 scale-150">
                {feature.icon}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 backdrop-blur-md">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
