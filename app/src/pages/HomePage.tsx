import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Brain, Zap, Target, CheckCircle2, BarChart3,
  Sparkles, TrendingUp, DollarSign, Layers, Command,
  ChevronDown, Star, Shield, Globe, Menu, X, CheckCheck,
  Activity, LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ===================== SUBCOMPONENTS ===================== */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs mb-6" style={{ fontFamily: "'Google Sans', sans-serif" }}>
      {children}
    </div>
  );
}

function NavBar({ onGetStarted }: { onGetStarted: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const links = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#workflow' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
  ];
  return (
    <motion.header initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className={`max-w-6xl mx-auto rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-[#050508]/90 backdrop-blur-xl border border-white/10 shadow-2xl' : 'bg-transparent border border-white/5'}`}>
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-xl shimmer-btn flex items-center justify-center"><Layers size={16} className="text-white" /></div>
          <span className="text-white font-semibold text-lg tracking-tight" style={{ fontFamily: "'Google Sans', sans-serif" }}>Flowdesk</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a key={link.name} href={link.href} className="text-sm text-white/60 hover:text-white transition-colors duration-200" style={{ fontFamily: "'Google Sans', sans-serif" }}>{link.name}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="text-sm text-white/70 hover:text-white px-4 py-2 rounded-xl transition-colors" style={{ fontFamily: "'Google Sans', sans-serif" }}>Sign In</button>
          <button onClick={onGetStarted} className="shimmer-btn text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity" style={{ fontFamily: "'Google Sans', sans-serif" }}>Get Started Free</button>
        </div>
        <button className="md:hidden text-white/70" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden mt-2 mx-4 bg-[#0d0d14]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
            {links.map((link) => (
              <a key={link.name} href={link.href} className="block text-white/70 hover:text-white py-3 text-sm border-b border-white/5 last:border-0" onClick={() => setMenuOpen(false)} style={{ fontFamily: "'Google Sans', sans-serif" }}>{link.name}</a>
            ))}
            <div className="flex gap-3 mt-4">
              <button onClick={() => navigate('/login')} className="flex-1 text-sm text-white/70 border border-white/10 py-2.5 rounded-xl" style={{ fontFamily: "'Google Sans', sans-serif" }}>Sign In</button>
              <button onClick={onGetStarted} className="flex-1 shimmer-btn text-white text-sm font-medium py-2.5 rounded-xl" style={{ fontFamily: "'Google Sans', sans-serif" }}>Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const stats = [
    { value: '10K+', label: 'Power Users' },
    { value: '7', label: 'Core Modules' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9★', label: 'Avg Rating' },
  ];
  const dashboardModules = [
    { icon: LayoutDashboard, label: 'Dashboard', color: '#7c3aed' },
    { icon: Brain, label: 'Brain AI', color: '#6366f1' },
    { icon: Activity, label: 'Analytics', color: '#22d3ee' },
    { icon: Target, label: 'Goals', color: '#34d399' },
    { icon: DollarSign, label: 'Finance', color: '#f59e0b' },
    { icon: Zap, label: 'Focus HUD', color: '#ec4899' },
  ];
  return (
    <div ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050508]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] animate-blob" />
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[30%] w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[120px] animate-blob animation-delay-4000" />
      </div>
      <div className="absolute inset-0 hero-grid opacity-100 pointer-events-none animate-grid-pulse" />
      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-32 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm mb-8" style={{ fontFamily: "'Google Sans', sans-serif" }}>
          <Sparkles size={14} />
          <span>Powered by Anthropic Claude AI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-white leading-[1.05] mb-6" style={{ fontFamily: "'Google Sans Display', 'Google Sans', sans-serif" }}>
          Your Personal<br /><span className="gradient-text">Productivity OS</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ fontFamily: "'Google Sans', sans-serif" }}>
          Flowdesk unifies your tasks, projects, finances, focus sessions, AI intelligence, and strategic goals into one seamless, high-performance workspace built for the ambitious few.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button onClick={onGetStarted} className="shimmer-btn text-white font-medium px-8 py-4 rounded-2xl text-base flex items-center gap-2 hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-xl shadow-violet-500/20" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            Start for Free <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/login')} className="text-white/60 hover:text-white border border-white/10 hover:border-white/20 px-8 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 bg-white/5" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            Sign In →
          </button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }} className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-semibold text-white mb-1" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>{stat.value}</div>
              <div className="text-sm text-white/40" style={{ fontFamily: "'Google Sans', sans-serif" }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 60, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative max-w-4xl mx-auto">
          <div className="animate-float">
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/20 to-cyan-500/10 blur-3xl rounded-3xl" />
            <div className="relative landing-glass p-6 rounded-3xl border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-white/30 text-xs" style={{ fontFamily: "'Google Sans', sans-serif" }}>flowdesk.app/dashboard</span>
                </div>
                <span className="text-xs text-emerald-400 flex items-center gap-1" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Live
                </span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {dashboardModules.map((mod, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.08 }} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: mod.color + '22' }}>
                      <mod.icon size={18} style={{ color: mod.color }} />
                    </div>
                    <span className="text-white/50 text-xs group-hover:text-white/80 transition-colors" style={{ fontFamily: "'Google Sans', sans-serif" }}>{mod.label}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: 'Tasks Today', value: '14 / 18', bar: 78, color: '#7c3aed' },
                  { label: 'Focus Time', value: '4h 23m', bar: 62, color: '#22d3ee' },
                  { label: 'Goal Alignment', value: '84%', bar: 84, color: '#34d399' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="text-white/40 text-xs mb-1.5" style={{ fontFamily: "'Google Sans', sans-serif" }}>{item.label}</div>
                    <div className="text-white text-sm font-medium mb-2" style={{ fontFamily: "'Google Sans', sans-serif" }}>{item.value}</div>
                    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ backgroundColor: item.color }} initial={{ width: 0 }} animate={{ width: `${item.bar}%` }} transition={{ delay: 1.2 + i * 0.1, duration: 0.8 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-xs" style={{ fontFamily: "'Google Sans', sans-serif" }}>Scroll to explore</span>
        <ChevronDown size={16} className="animate-bounce" />
      </motion.div>
    </div>
  );
}

function WhatIsFlowdesk() {
  const points = [
    { icon: Layers, text: 'A unified Personal Productivity OS for ambitious individuals' },
    { icon: Brain, text: 'Claude AI integration for strategic insights and briefings' },
    { icon: Activity, text: 'Deep analytics with focus heatmaps and velocity tracking' },
    { icon: Shield, text: 'Secure, real-time sync across all your devices' },
    { icon: Globe, text: 'Built for remote-first, high-performance workflows' },
  ];
  return (
    <section className="py-24 px-4 bg-[#08080f] border-y border-white/5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <SectionLabel><Star size={12} /> What is Flowdesk?</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-medium text-white mb-6" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>
            More than a task manager.<br /><span className="gradient-text">It's your operational OS.</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-8" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            Flowdesk was built for founders, engineers, creatives, and high-performers who need more than a simple to-do list. It is a <strong className="text-white/80">fully integrated command center</strong> that combines strategic planning, AI intelligence, deep work facilitation, financial monitoring, and real-time analytics — all in one elegantly designed environment.
          </p>
          <div className="flex flex-col gap-4">
            {points.map((pt, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <pt.icon size={16} className="text-violet-400" />
                </div>
                <span className="text-white/70 text-sm" style={{ fontFamily: "'Google Sans', sans-serif" }}>{pt.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 blur-3xl rounded-3xl" />
          <div className="relative landing-glass p-8 rounded-3xl">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>84<span className="text-2xl text-violet-400">%</span></div>
              <p className="text-white/40 text-sm" style={{ fontFamily: "'Google Sans', sans-serif" }}>Average Goal Convergence Score</p>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Task Completion Rate', val: 91, color: '#7c3aed' },
                { label: 'Focus Session Success', val: 78, color: '#22d3ee' },
                { label: 'Strategic Alignment', val: 84, color: '#34d399' },
                { label: 'AI Insight Accuracy', val: 96, color: '#f59e0b' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-white/60 text-xs" style={{ fontFamily: "'Google Sans', sans-serif" }}>{item.label}</span>
                    <span className="text-white/80 text-xs font-medium" style={{ fontFamily: "'Google Sans', sans-serif" }}>{item.val}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: item.color }} initial={{ width: 0 }} whileInView={{ width: `${item.val}%` }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1, duration: 0.9 }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-white/40 text-xs" style={{ fontFamily: "'Google Sans', sans-serif" }}>Avg across all Flowdesk users</span>
              <span className="text-emerald-400 text-xs flex items-center gap-1" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                <TrendingUp size={12} /> +12% MoM
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureBento() {
  const features = [
    { icon: Brain, title: 'Brain AI — Mission Control', desc: 'Anthropic Claude deeply integrated into your workflow. Get executive briefings, strategic insights, and real-time context-aware recommendations. Your personal AI Chief of Staff.', color: '#7c3aed', badge: 'AI-Powered', span: true },
    { icon: Activity, title: 'Strategic Analytics', desc: 'Productivity velocity maps, focus heatmaps, and biometric dashboards track your operational consistency.', color: '#22d3ee', badge: 'Insights' },
    { icon: Zap, title: 'Focus HUD', desc: 'Pomodoro timers, ambient sound mixers, and immersive deep-work protocols eliminate distractions.', color: '#ec4899', badge: 'Deep Work' },
    { icon: DollarSign, title: 'Finance Pulse', desc: 'Monitor assets, burn rate, revenue, and runway. AI-driven financial advisory detects anomalies automatically.', color: '#f59e0b', badge: 'Capital Matrix' },
    { icon: Target, title: 'Goal Matrix', desc: 'Set quarterly objectives, track convergence scores, and receive AI-recommended action plans to stay aligned.', color: '#34d399', badge: 'Strategy' },
    { icon: Layers, title: 'Task & Project Engine', desc: 'Real-time Kanban boards, sub-tasks, priority toggling, and Socket.io live sync across all your devices simultaneously.', color: '#6366f1', badge: 'Real-Time', span: true },
    { icon: Command, title: 'OmniCommand', desc: 'CMD+K global palette for instant actions and navigation without lifting your hands off the keyboard.', color: '#a78bfa', badge: '⌘K' },
  ];
  return (
    <section id="features" className="py-24 px-4 bg-[#050508]">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <SectionLabel><Sparkles size={12} /> Everything you need</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-4" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>
            7 powerful modules.<br /><span className="gradient-text">One unified workspace.</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            Every feature is purpose-built for high-performance individuals who refuse to settle for average tools.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }} className={`feature-card landing-glass p-6 cursor-pointer ${feat.span ? 'lg:col-span-2' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: feat.color + '22' }}>
                  <feat.icon size={22} style={{ color: feat.color }} />
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full border font-medium" style={{ color: feat.color, borderColor: feat.color + '40', backgroundColor: feat.color + '15', fontFamily: "'Google Sans', sans-serif" }}>{feat.badge}</span>
              </div>
              <h3 className="text-white font-medium text-lg mb-2" style={{ fontFamily: "'Google Sans', sans-serif" }}>{feat.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Google Sans', sans-serif" }}>{feat.desc}</p>
              <div className="mt-5 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${feat.color}60, transparent)` }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Target, title: 'Plan with Precision', desc: 'Set quarterly goals, break them into projects and tasks. Use AI convergence analysis to ensure every action aligns with your strategic vision.', color: '#7c3aed' },
    { icon: Zap, title: 'Execute in Flow', desc: 'Enter deep work mode with Focus HUD. Use OmniCommand to navigate instantly. Track progress on your Kanban boards in real-time.', color: '#22d3ee' },
    { icon: BarChart3, title: 'Analyze & Optimize', desc: 'Review your productivity velocity, focus heatmap, and biometric stats. Let the Brain AI surface insights and recommend your next best actions.', color: '#34d399' },
  ];
  return (
    <section id="workflow" className="py-24 px-4 bg-[#050508]">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <SectionLabel><CheckCheck size={12} /> How Flowdesk Works</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-4" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>
            Three steps to<span className="gradient-text"> peak performance.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }} className="relative text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center border" style={{ borderColor: step.color + '40', backgroundColor: step.color + '15' }}>
                    <step.icon size={28} style={{ color: step.color }} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: step.color, fontFamily: "'Google Sans', sans-serif" }}>{i + 1}</div>
                </div>
              </div>
              <h3 className="text-xl font-medium text-white mb-3" style={{ fontFamily: "'Google Sans', sans-serif" }}>{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Google Sans', sans-serif" }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureDeepDive() {
  const sections = [
    {
      tag: 'Brain AI', title: 'Your AI-powered Chief of Staff',
      desc: "Flowdesk's Brain AI, powered by Anthropic Claude, reads your entire workspace context to generate tailored strategic insights. Get an executive briefing every morning. Ask complex questions. Let AI reverse-engineer your goals into daily action items.",
      points: ['Real-time context injection into every AI prompt', 'Streaming SSE responses — zero wait time', 'Knowledge graph visualization of ideas', 'Strategy, Productivity & Wellness insights'],
      color: '#7c3aed', reversed: false,
      visual: (
        <div className="landing-glass p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center"><Brain size={16} className="text-violet-400" /></div>
            <span className="text-white/70 text-sm" style={{ fontFamily: "'Google Sans', sans-serif" }}>Executive Briefing</span>
            <span className="ml-auto text-xs text-emerald-400 flex items-center gap-1" style={{ fontFamily: "'Google Sans', sans-serif" }}><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Live</span>
          </div>
          {['Your Project 4.0 is 78% complete — excellent momentum.', 'SaaS burn rate increased 4% — audit recommended.', '3 tasks due today align with Q4 goals.'].map((msg, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3 text-white/60 text-xs leading-relaxed" style={{ fontFamily: "'Google Sans', sans-serif" }}>💡 {msg}</div>
          ))}
          <div className="flex gap-2 mt-4">
            {['Strategy', 'Productivity', 'Rest'].map((tag, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20" style={{ fontFamily: "'Google Sans', sans-serif" }}>{tag}</span>
            ))}
          </div>
        </div>
      ),
    },
    {
      tag: 'Focus HUD', title: 'Deep work starts here.',
      desc: 'Enter a distraction-free immersive mode with Focus HUD. Configure Pomodoro sessions, mix ambient sounds to trigger flow states, and let the global operation ghost broadcast your focus status to the entire app.',
      points: ['Configurable Pomodoro (25/5/15 min)', 'Multi-layer ambient sound mixer', 'Global focus state broadcast across the OS', 'Distraction-free immersive visual mode'],
      color: '#ec4899', reversed: true,
      visual: (
        <div className="landing-glass p-5 rounded-2xl text-center">
          <div className="mb-4"><span className="text-xs text-pink-400 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/20" style={{ fontFamily: "'Google Sans', sans-serif" }}>🔴 Focus Session Active</span></div>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <motion.circle cx="60" cy="60" r="54" fill="none" stroke="#ec4899" strokeWidth="8" strokeLinecap="round" strokeDasharray={339.3} initial={{ strokeDashoffset: 339.3 }} whileInView={{ strokeDashoffset: 339.3 * 0.35 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: 'easeOut' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>17:32</div>
              <div className="text-pink-400 text-xs" style={{ fontFamily: "'Google Sans', sans-serif" }}>Focus Mode</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['🌧️ Rain', '☕ Café', '🌊 Ocean'].map((s, i) => (
              <div key={i} className={`text-xs py-2 rounded-lg ${i === 0 ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-white/5 text-white/40'}`} style={{ fontFamily: "'Google Sans', sans-serif" }}>{s}</div>
            ))}
          </div>
        </div>
      ),
    },
    {
      tag: 'Finance Pulse', title: 'Capital Matrix: Your financial command center.',
      desc: "Monitor your financial health in real-time. Track total assets, monthly burn rate, revenue, and runway all in one dashboard. Flowdesk's AI financial advisor detects anomalies and alerts you before they become problems.",
      points: ['Live Total Assets & Monthly Burn tracking', 'AI-powered anomaly detection & alerts', 'Extensible Stripe & Plaid architecture', 'Detailed transaction ledger with search & filter'],
      color: '#f59e0b', reversed: false,
      visual: (
        <div className="landing-glass p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-xs" style={{ fontFamily: "'Google Sans', sans-serif" }}>Net Liquid Assets</span>
            <span className="text-emerald-400 text-xs" style={{ fontFamily: "'Google Sans', sans-serif" }}>↑ 3.2%</span>
          </div>
          <div className="text-3xl font-bold text-white" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>$96,482.30</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Monthly Burn', val: '$4,200', color: '#ef4444' },
              { label: 'Revenue', val: '$11,800', color: '#34d399' },
              { label: 'Runway', val: '22.9mo', color: '#f59e0b' },
            ].map((m, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-2.5 text-center">
                <div className="text-xs text-white/40 mb-1" style={{ fontFamily: "'Google Sans', sans-serif" }}>{m.label}</div>
                <div className="text-sm font-medium" style={{ color: m.color, fontFamily: "'Google Sans', sans-serif" }}>{m.val}</div>
              </div>
            ))}
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <div className="text-amber-400 text-xs" style={{ fontFamily: "'Google Sans', sans-serif" }}>💡 AI Advisory: SaaS spend increased 4% this month. Review subscriptions.</div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <section className="py-24 px-4 bg-[#08080f]">
      <div className="max-w-5xl mx-auto space-y-24">
        {sections.map((sec, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${sec.reversed ? 'lg:grid-flow-dense' : ''}`}>
            <div className={sec.reversed ? 'lg:col-start-2' : ''}>
              <span className="text-xs font-medium px-3 py-1.5 rounded-full border mb-4 inline-block" style={{ color: sec.color, borderColor: sec.color + '40', backgroundColor: sec.color + '15', fontFamily: "'Google Sans', sans-serif" }}>{sec.tag}</span>
              <h3 className="text-2xl md:text-3xl font-medium text-white mb-4" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>{sec.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6" style={{ fontFamily: "'Google Sans', sans-serif" }}>{sec.desc}</p>
              <ul className="space-y-2.5">
                {sec.points.map((pt, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-white/60" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: sec.color + '30' }}><CheckCircle2 size={12} style={{ color: sec.color }} /></div>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div className={sec.reversed ? 'lg:col-start-1 lg:row-start-1' : ''}>
              <div className="relative">
                <div className="absolute inset-0 blur-3xl rounded-3xl" style={{ backgroundColor: sec.color + '15' }} />
                <div className="relative">{sec.visual}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { quote: "Flowdesk replaced 4 apps for me. The Brain AI briefings every morning are insane — it's like having a personal COO that knows everything about my work.", author: 'Sarah Chen', role: 'Startup Founder', company: 'TechVentures AI', initials: 'SC', color: '#7c3aed' },
    { quote: "The Focus HUD with ambient sounds is a game changer. I'm doing 6-hour deep work sessions regularly now. My output tripled in two months.", author: 'Marcus Williams', role: 'Lead Engineer', company: 'FinStack Corp', initials: 'MW', color: '#22d3ee' },
    { quote: "Finance Pulse caught a $800/mo SaaS subscription I forgot about. The ROI on Flowdesk Pro paid for itself in the first week.", author: 'Elena Rodriguez', role: 'Product Manager', company: 'ScaleOps', initials: 'ER', color: '#34d399' },
  ];
  return (
    <section id="testimonials" className="py-24 px-4 bg-[#050508] border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <SectionLabel><Star size={12} /> Testimonials</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-medium text-white" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>Loved by high-performers.</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="landing-glass p-6 rounded-2xl flex flex-col gap-5 feature-card">
              <div className="flex gap-1">{Array.from({ length: 5 }).map((_, j) => (<Star key={j} size={14} fill={t.color} style={{ color: t.color }} />))}</div>
              <p className="text-white/70 text-sm leading-relaxed flex-1" style={{ fontFamily: "'Google Sans', sans-serif" }}>"{t.quote}"</p>
              <div className="flex items-center gap-3 border-t border-white/8 pt-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0" style={{ backgroundColor: t.color + '30', color: t.color, fontFamily: "'Google Sans', sans-serif" }}>{t.initials}</div>
                <div>
                  <div className="text-white font-medium text-sm" style={{ fontFamily: "'Google Sans', sans-serif" }}>{t.author}</div>
                  <div className="text-white/40 text-xs" style={{ fontFamily: "'Google Sans', sans-serif" }}>{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ onGetStarted }: { onGetStarted: () => void }) {
  const navigate = useNavigate();
  const plans = [
    {
      name: 'Starter', price: '$0', period: '/month', desc: 'For individuals exploring a better workflow.',
      features: ['Up to 3 active projects', 'Basic task management & Kanban', 'Calendar & notes', '5 AI queries/month', 'Community support'],
      cta: 'Get Started Free', action: onGetStarted, highlight: false, color: '#a1a1aa',
    },
    {
      name: 'Pro', price: '$12', period: '/month', desc: 'For high-performers who refuse to compromise.',
      features: ['Unlimited projects & tasks', 'Full Brain AI (Claude) access', 'Focus HUD & Ambient Mixer', 'Finance Pulse dashboard', 'Goal Matrix + AI convergence', 'Real-time sync (Socket.io)', 'OmniCommand (⌘K)', 'Priority support'],
      cta: 'Upgrade to Pro', action: () => navigate('/login'), highlight: true, color: '#7c3aed', badge: 'Most Popular',
    },
  ];
  return (
    <section id="pricing" className="py-24 px-4 bg-[#08080f] border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <SectionLabel><DollarSign size={12} /> Pricing</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-4" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>Simple, transparent pricing.</h2>
          <p className="text-white/50" style={{ fontFamily: "'Google Sans', sans-serif" }}>No hidden fees. No gotchas. Cancel anytime.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className={`relative landing-glass p-8 rounded-3xl flex flex-col ${plan.highlight ? 'border-violet-500/40 glow-violet' : ''}`}>
              {(plan as any).badge && (
                <div className="absolute top-6 right-6"><span className="text-xs px-3 py-1 rounded-full bg-violet-500 text-white font-medium" style={{ fontFamily: "'Google Sans', sans-serif" }}>{(plan as any).badge}</span></div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-medium text-white mb-1" style={{ fontFamily: "'Google Sans', sans-serif" }}>{plan.name}</h3>
                <p className="text-white/40 text-sm mb-4" style={{ fontFamily: "'Google Sans', sans-serif" }}>{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>{plan.price}</span>
                  <span className="text-white/40 text-sm" style={{ fontFamily: "'Google Sans', sans-serif" }}>{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-white/60" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: plan.color + '25' }}><CheckCircle2 size={12} style={{ color: plan.color }} /></div>
                    {feat}
                  </li>
                ))}
              </ul>
              <button onClick={plan.action} className={`w-full py-3.5 rounded-2xl font-medium text-sm transition-all hover:-translate-y-0.5 ${plan.highlight ? 'shimmer-btn text-white shadow-lg shadow-violet-500/20' : 'bg-white/8 text-white hover:bg-white/12 border border-white/10'}`} style={{ fontFamily: "'Google Sans', sans-serif" }}>{plan.cta}</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { question: 'What exactly is Flowdesk?', answer: "Flowdesk is a Personal Productivity OS — a unified workspace combining task management, project planning, AI intelligence (via Claude), focus tools, financial monitoring, and strategic goal tracking. It's designed for ambitious individuals who need more than a simple to-do list." },
    { question: 'How does the Brain AI feature work?', answer: "Brain AI is powered by Anthropic Claude and integrates directly with your workspace data. It reads your tasks, projects, goals, and focus patterns, then generates personalized insights, executive briefings, and strategic recommendations using Server-Sent Events for real-time streaming." },
    { question: 'Is Flowdesk suitable for teams?', answer: "Flowdesk is currently optimized for individual high-performers and solo operators. Team features including shared workspaces, collaborative boards, and multi-user projects are on our roadmap for a future release." },
    { question: 'What does real-time sync mean?', answer: "Flowdesk uses Socket.io for live synchronization. Any change you make — creating a task, updating a project, completing a goal — instantly appears across all your open browser tabs and devices without needing to refresh." },
    { question: 'Can I cancel my Pro subscription anytime?', answer: "Absolutely. There are no lock-in contracts. You can downgrade to the Starter plan at any time from your Profile settings. Your data is always yours and you can export it whenever you want." },
  ];
  return (
    <section className="py-24 px-4 bg-[#050508] border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-medium text-white" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>Common questions.</h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="landing-glass rounded-2xl overflow-hidden">
              <button className="w-full text-left px-6 py-5 flex items-center justify-between gap-4" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <span className="text-white font-medium text-base" style={{ fontFamily: "'Google Sans', sans-serif" }}>{faq.question}</span>
                <ChevronDown size={18} className={`text-white/40 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-6 pb-5 text-white/50 text-sm leading-relaxed border-t border-white/5 pt-4" style={{ fontFamily: "'Google Sans', sans-serif" }}>{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-24 px-4 bg-[#08080f] border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-indigo-900/80 to-cyan-900/60" />
          <div className="absolute inset-0 hero-grid opacity-30" />
          <div className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-500/30 blur-[100px]" />
          <div className="absolute bottom-[-30%] left-[-10%] w-[300px] h-[300px] rounded-full bg-cyan-500/20 blur-[80px]" />
          <div className="relative z-10 text-center p-12 md:p-20">
            <h2 className="text-4xl md:text-5xl font-medium text-white mb-6" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>Start your flow today.</h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: "'Google Sans', sans-serif" }}>
              Join thousands of high-performers who use Flowdesk to operate at their absolute peak. Free to start. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={onGetStarted} className="bg-white text-gray-900 font-medium px-8 py-4 rounded-2xl text-base flex items-center gap-2 hover:bg-gray-100 transition-all hover:-translate-y-0.5 shadow-2xl" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                Create Free Account <ArrowRight size={18} />
              </button>
              <div className="flex items-center gap-2 text-white/50 text-sm" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                <CheckCircle2 size={14} /><span>No credit card · Cancel anytime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const navigate = useNavigate();
  const columns = [
    { title: 'Product', links: [{ name: 'Features', href: '#features' }, { name: 'Pricing', href: '#pricing' }, { name: 'Changelog', href: '#' }, { name: 'Roadmap', href: '#' }] },
    { title: 'Modules', links: [{ name: 'Brain AI', href: '#features' }, { name: 'Focus HUD', href: '#features' }, { name: 'Analytics', href: '#features' }, { name: 'Finance Pulse', href: '#features' }] },
    { title: 'Company', links: [{ name: 'About', href: '#' }, { name: 'Blog', href: '#' }, { name: 'Privacy Policy', href: '#' }, { name: 'Terms of Service', href: '#' }] },
    { title: 'Connect', links: [{ name: 'Twitter / X', href: '#' }, { name: 'GitHub', href: '#' }, { name: 'Discord', href: '#' }, { name: 'Contact Us', href: '#' }] },
  ];
  return (
    <footer className="bg-[#050508] border-t border-white/5 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 cursor-pointer mb-4" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-xl shimmer-btn flex items-center justify-center"><Layers size={16} className="text-white" /></div>
              <span className="text-white font-semibold text-lg" style={{ fontFamily: "'Google Sans', sans-serif" }}>Flowdesk</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed" style={{ fontFamily: "'Google Sans', sans-serif" }}>Your Personal Productivity OS. Built for the ambitious.</p>
          </div>
          {columns.map((col, i) => (
            <div key={i}>
              <h4 className="text-white font-medium text-sm mb-4" style={{ fontFamily: "'Google Sans', sans-serif" }}>{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link, j) => (
                  <li key={j}><a href={link.href} className="text-white/40 hover:text-white/80 text-sm transition-colors" style={{ fontFamily: "'Google Sans', sans-serif" }}>{link.name}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm" style={{ fontFamily: "'Google Sans', sans-serif" }}>© {new Date().getFullYear()} Flowdesk. All rights reserved.</p>
          <div className="flex items-center gap-2 text-white/20 text-xs" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            <span>Powered by</span><span className="text-violet-400">Anthropic Claude</span><span>·</span><span>Built with React + Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ===================== MAIN PAGE ===================== */
export function HomePage() {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/login');
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden" style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}>
      <NavBar onGetStarted={handleGetStarted} />
      <HeroSection onGetStarted={handleGetStarted} />
      <WhatIsFlowdesk />
      <FeatureBento />
      <HowItWorks />
      <FeatureDeepDive />
      <TestimonialsSection />
      <PricingSection onGetStarted={handleGetStarted} />
      <FAQSection />
      <CTABanner onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
}
