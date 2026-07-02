import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Brain, Zap, Target, CheckCircle2, BarChart3, Clock, CheckSquare, Sparkles, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function MarqueeRow({ icons, direction }: { icons: any[], direction: 'left' | 'right' }) {
  const duplicated = [...icons, ...icons, ...icons, ...icons];
  return (
    <div className="flex w-max">
      <motion.div
        initial={{ x: direction === 'left' ? 0 : '-50%' }}
        animate={{ x: direction === 'left' ? '-50%' : 0 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex gap-3 pr-3"
      >
        {duplicated.map((Icon, i) => (
          <div key={i} className="h-14 w-14 md:h-16 md:w-16 shrink-0 rounded-xl liquid-glass flex items-center justify-center text-white shadow-sm border border-white/5 bg-white/5">
            <Icon size={24} className="opacity-80" strokeWidth={1.5} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const navLinks = [
    { name: t('home.nav_features'), href: '#features' },
    { name: t('home.nav_workflow'), href: '#workflow' },
    { name: t('home.nav_testimonials'), href: '#testimonials' },
    { name: t('home.nav_pricing'), href: '#pricing' },
  ];

  const testimonials = [
    {
      quote: t('home.testimonial_sarah_quote'),
      author: t('home.testimonial_sarah_author'),
      role: t('home.testimonial_sarah_role'),
    },
    {
      quote: t('home.testimonial_michael_quote'),
      author: t('home.testimonial_michael_author'),
      role: t('home.testimonial_michael_role'),
    },
    {
      quote: t('home.testimonial_elena_quote'),
      author: t('home.testimonial_elena_author'),
      role: t('home.testimonial_elena_role'),
    }
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 relative"
    >

      {/* TOP VIEWPORT (Navbar + Hero) */}
      <div className="relative w-full min-h-screen flex flex-col">

        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px] mix-blend-multiply animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] rounded-full bg-foreground blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
        </div>

        {/* NAVBAR */}
        <div className="px-6 md:px-12 lg:px-16 pt-6 fixed top-0 w-full z-50">
          <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between"
          >
            <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
              <span className="text-2xl font-semibold tracking-tight text-white">
                Flowdesk
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-white hover:text-gray-300 transition-colors cursor-pointer hidden sm:block"
              >
                {t('home.log_in')}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-black px-5 py-2 rounded-2xl text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer shadow-sm"
              >
                {t('home.sign_up')}
              </button>
            </div>
          </motion.nav>
        </div>

        {/* HERO CONTENT */}
        <section className="px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-end pb-12 lg:pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ y: heroY, opacity: heroOpacity }}
            className="w-full lg:grid lg:grid-cols-2 lg:items-end gap-12"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-xs font-medium text-muted-foreground mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {t('home.badge_live')}
              </div>

              <h1 className="text-4xl md:text-4xl lg:text-[90px] leading-[1.15] font-normal tracking-tight mb-4 text-foreground">
                {t('home.hero_headline')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground italic pr-2">{t('home.hero_headline_one')}</span>
              </h1>
            </div>

            <div className="flex flex-col items-start lg:pl-10">
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                {t('home.hero_sub')}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 rounded-full bg-foreground text-background text-base font-medium hover:bg-primary transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
                >
                  {t('home.cta_start_free')} <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 rounded-full bg-transparent border border-border text-foreground text-base font-medium hover:bg-muted transition-all flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
                >
                  {t('home.cta_see_how')}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-6 font-medium">{t('home.no_credit_card')}</p>
            </div>
          </motion.div>
        </section>
      </div>

      <main className="relative z-10 pb-20">

        {/* SECTION 2: DASHBOARD PREVIEW MOCKUP */}
        <section className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto mb-32 perspective-1000">
          <motion.div
            initial={{ opacity: 0, rotateX: 10, y: 40 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full aspect-[16/9] rounded-2xl md:rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Mock Header */}
            <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
              </div>
              <div className="mx-auto h-6 w-48 bg-background border border-border rounded-xl" />
            </div>
            {/* Mock Body */}
            <div className="flex-1 flex p-4 gap-4 bg-muted/10">
              <div className="w-48 hidden md:flex flex-col gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-8 rounded-xl bg-muted/50 border border-border/50" />
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex-1 h-24 rounded-xl bg-card border border-border shadow-sm flex items-center px-6 gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center"><CheckSquare className="text-primary" size={20} /></div>
                    <div><div className="w-16 h-4 bg-muted rounded mb-2" /><div className="w-8 h-6 bg-foreground rounded" /></div>
                  </div>
                  <div className="flex-1 h-24 rounded-xl bg-card border border-border shadow-sm flex items-center px-6 gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center"><Clock className="text-primary" size={20} /></div>
                    <div><div className="w-20 h-4 bg-muted rounded mb-2" /><div className="w-12 h-6 bg-foreground rounded" /></div>
                  </div>
                  <div className="flex-1 h-24 rounded-xl bg-card border border-border shadow-sm hidden lg:flex items-center px-6 gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center"><BarChart3 className="text-primary" size={20} /></div>
                    <div><div className="w-16 h-4 bg-muted rounded mb-2" /><div className="w-10 h-6 bg-foreground rounded" /></div>
                  </div>
                </div>
                <div className="flex-1 rounded-xl bg-card border border-border shadow-sm p-6 flex flex-col gap-4">
                  <div className="w-32 h-5 bg-foreground/20 rounded mb-2" />
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 w-full rounded-2xl border border-border bg-muted/30 flex items-center px-4 gap-4">
                      <div className="w-4 h-4 rounded-xl border border-muted-foreground/30" />
                      <div className="h-3 w-1/3 bg-muted-foreground/30 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 3: NEW BENTO GRID */}
        <section id="features" className="bg-background text-foreground w-full flex flex-col px-4 sm:px-6 md:px-10 lg:px-14 py-16 sm:py-24 my-20">

          <div className="max-w-[1400px] mx-auto w-full">
            {/* Top Header Row */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 lg:mb-12 w-full shrink-0">
              <div className="max-w-3xl">
                <h2 className="text-[28px] sm:text-3xl md:text-4xl lg:text-[44px] leading-[1.15] font-normal tracking-tight mb-4 text-foreground">
                  {t('home.features_headline')}
                </h2>
                <p className="text-sm md:text-[15px] leading-[1.6] text-muted-foreground max-w-3xl">
                  {t('home.features_sub')}
                </p>
              </div>
            </header>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 min-h-[600px]">

              {/* Column 1 - Background card */}
              <div className="rounded-2xl bg-black relative overflow-hidden flex flex-col justify-between p-6">
                <video src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_150203_44a5bd32-516a-47ce-a077-8acbf9aa8991.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none" />
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <Sparkles className="h-3 w-3 stroke-[1.5] text-white/70" />
                  <span className="uppercase tracking-[0.22em] text-[11px] text-white/70 font-medium">{t('home.integrated_system')}</span>
                  <Sparkles className="h-3 w-3 stroke-[1.5] text-white/70" />
                </div>
                <div className="relative z-10 w-full mt-auto pt-20">
                  <div className="grid grid-cols-[auto_auto_1fr_auto] gap-x-3 gap-y-3 items-center text-xs text-white/80">
                    <span>{t('home.phase_1')}</span> <Sparkles className="h-3 w-3 text-white/60" /> <span className="truncate">{t('home.plan_goals')}</span> <span className="text-white/40 text-[10px]">MATRIX</span>
                    <span>{t('home.phase_2')}</span> <Sparkles className="h-3 w-3 text-white/60" /> <span className="truncate">{t('home.execute_tasks')}</span> <span className="text-white/40 text-[10px]">FOCUS</span>
                    <span>{t('home.phase_3')}</span> <Sparkles className="h-3 w-3 text-white/60" /> <span className="truncate">{t('home.analyze_data')}</span> <span className="text-white/40 text-[10px]">PULSE</span>
                    <span>{t('home.phase_4')}</span> <Sparkles className="h-3 w-3 text-white/60" /> <span className="truncate">{t('home.ai_optimizations')}</span> <span className="text-white/40 text-[10px]">CTRL</span>
                  </div>
                </div>
              </div>

              {/* Column 2 - Stacked rows */}
              <div className="grid grid-rows-1 md:grid-rows-[auto_1fr] gap-4 md:gap-5 h-full">
                {/* Top Client Voice */}
                <div className="rounded-2xl bg-[#324444] p-5 md:p-6 relative overflow-hidden flex flex-col gap-4">
                  <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
                  <div className="relative z-10 flex items-center gap-2 text-white/70">
                    <Sparkles className="h-3 w-3" />
                    <span className="text-[11px] uppercase tracking-wider font-medium">{t('home.user_voice')}</span>
                  </div>
                  <p className="relative z-10 text-[13px] sm:text-[13.5px] leading-[1.6] text-white/85">
                    {t('home.bento_quote')}
                  </p>
                  <div className="relative z-10 mt-auto pt-2 text-[12px] text-white/60">
                    <strong className="text-white/90 font-medium">{t('home.testimonial_sarah_author')}</strong> — {t('home.sarah_attribution')}
                  </div>
                </div>
                {/* Bottom 10x */}
                <div className="rounded-2xl bg-black relative overflow-hidden flex flex-col items-center justify-center p-6 min-h-[200px]">
                  <video src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_154543_d5b83fc1-9cea-44f3-b5e8-8f325935211a.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none" />
                  <div className="relative z-10 text-center">
                    <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-light tracking-tight drop-shadow-2xl text-white">10x</h2>
                    <p className="text-white/85 mt-2 text-sm">{t('home.productivity_multiplier')}</p>
                  </div>
                </div>
              </div>

              {/* Column 3 - Stacked rows */}
              <div className="grid grid-rows-[1fr_auto] gap-4 md:gap-5 h-full">
                {/* Top Daily Software */}
                <div className="rounded-2xl bg-black relative overflow-hidden flex flex-col justify-between p-5 md:p-6 min-h-[240px]">
                  <video src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_153148_d7a3e1dd-e5d0-4ce6-8306-00d7522ecc44.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none" />
                  <div className="relative z-10 flex items-center gap-2 text-white/70 mb-6">
                    <Sparkles className="h-3 w-3" />
                    <span className="text-[11px] uppercase tracking-wider font-medium">{t('home.core_arsenal')}</span>
                  </div>

                  {/* Marquee area */}
                  <div className="relative z-10 w-full overflow-hidden mt-auto" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
                    <div className="flex flex-col gap-3">
                      <MarqueeRow icons={[Target, Zap, Clock, BarChart3, CheckSquare, Brain]} direction="left" />
                      <MarqueeRow icons={[Brain, BarChart3, Clock, Zap, Target, CheckSquare]} direction="right" />
                    </div>
                  </div>
                </div>

                {/* Bottom Reach Me */}
                <div className="rounded-2xl bg-[#324444] p-5 md:p-6 relative overflow-hidden flex items-center justify-between group cursor-pointer" onClick={() => navigate('/login')}>
                  <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-white/70 mb-3">
                      <Sparkles className="h-3 w-3" />
                      <span className="text-[11px] uppercase tracking-wider font-medium">{t('home.start_now')}</span>
                    </div>
                    <p className="text-white text-[15px] font-medium">{t('home.free_forever_plan')}</p>
                    <p className="text-white/60 text-[13px] mt-1">{t('home.no_credit_card_required')}</p>
                  </div>
                  <button className="relative z-10 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white text-[#324444] flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg cursor-pointer">
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* WORKFLOW / HOW IT WORKS */}
        <section id="workflow" className="py-24 px-6 max-w-5xl mx-auto border-t border-border">
          <div className="text-center mb-16">
            <h2 className="text-[28px] sm:text-3xl md:text-4xl lg:text-[44px] leading-[1.15] font-normal tracking-tight mb-4 text-foreground">{t('home.workflow_title')}</h2>
            <p className="text-lg text-muted-foreground">{t('home.workflow_sub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: t('home.step_plan_title'), desc: t('home.step_plan_desc') },
              { icon: Zap, title: t('home.step_execute_title'), desc: t('home.step_execute_desc') },
              { icon: BarChart3, title: t('home.step_analyze_title'), desc: t('home.step_analyze_desc') },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-6 text-foreground">
                  <step.icon size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-24 px-6 bg-muted/20 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-semibold mb-4 text-foreground">{t('home.testimonials_title')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t_item, i) => (
                <div key={i} className="p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between gap-6">
                  <p className="text-foreground leading-relaxed">"{t_item.quote}"</p>
                  <div>
                    <p className="font-semibold text-sm">{t_item.author}</p>
                    <p className="text-xs text-muted-foreground">{t_item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-24 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold mb-4 text-foreground">{t('home.pricing_title')}</h2>
            <p className="text-lg text-muted-foreground">{t('home.pricing_sub')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl bg-card border border-border flex flex-col">
              <h3 className="text-2xl font-semibold mb-2">{t('home.plan_starter')}</h3>
              <p className="text-muted-foreground mb-6">{t('home.plan_starter_desc')}</p>
              <div className="text-4xl font-semibold mb-8">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
              <ul className="flex flex-col gap-4 mb-8 flex-1">
                {[t('home.plan_starter_feature_1'), t('home.plan_starter_feature_2'), t('home.plan_starter_feature_3')].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle2 size={16} className="text-muted-foreground" /> {feat}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-full bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors cursor-pointer"
              >
                {t('home.get_started')}
              </button>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-2xl bg-foreground text-background flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-8 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-b-lg">
                {t('home.most_popular')}
              </div>
              <h3 className="text-2xl font-semibold mb-2">{t('home.plan_pro')}</h3>
              <p className="text-muted-foreground/80 mb-6">{t('home.plan_pro_desc')}</p>
              <div className="text-4xl font-semibold mb-8">$12<span className="text-lg text-muted-foreground/80 font-normal">/mo</span></div>
              <ul className="flex flex-col gap-4 mb-8 flex-1">
                {[t('home.plan_pro_feature_1'), t('home.plan_pro_feature_2'), t('home.plan_pro_feature_3'), t('home.plan_pro_feature_4')].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 size={16} className="text-muted-foreground/80" /> {feat}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-full bg-background text-foreground font-medium hover:bg-background/90 transition-colors cursor-pointer"
              >
                {t('home.upgrade_to_pro')}
              </button>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-6 text-center max-w-3xl mx-auto border-t border-border">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-foreground">{t('home.cta_title')}</h2>
          <p className="text-lg text-muted-foreground mb-10">{t('home.cta_sub')}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-5 rounded-full bg-foreground text-background text-lg font-medium hover:bg-primary transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2 mx-auto cursor-pointer"
          >
            {t('home.create_free_account')} <ArrowRight size={20} />
          </button>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-border bg-card">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-xs">
              F
            </div>
            <span className="font-medium text-foreground">FlowDesk</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">{t('home.footer_privacy')}</a>
            <a href="#" className="hover:text-foreground transition-colors">{t('home.footer_terms')}</a>
            <a href="#" className="hover:text-foreground transition-colors">{t('home.footer_twitter')}</a>
            <a href="#" className="hover:text-foreground transition-colors">{t('home.footer_github')}</a>
          </div>
          <p className="text-sm text-muted-foreground">{t('home.footer_copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
