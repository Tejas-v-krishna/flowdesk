import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Flowdesk has completely streamlined my daily operations. The AI executive briefing gives me an edge I didn't know I needed.",
    author: "Sarah Jenkins",
    role: "Founder, TechNova",
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    quote: "Managing my portfolio and deep-work sessions in one ecosystem eliminated my context switching. A true game-changer.",
    author: "David Chen",
    role: "Independent Consultant",
    image: "https://i.pravatar.cc/150?u=david"
  }
];

export const LandingSocialProof = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/40 border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay z-0" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
            >
              Real Stories Shared by <span className="italic gradient-text">Our Customers</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Over 50,000 high performers trust Flowdesk to optimize their strategic alignment and operational velocity.
            </motion.p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="landing-glass p-8 rounded-3xl border-white/10 hover:border-violet-500/30 transition-colors flex flex-col gap-6"
              >
                <Quote className="w-8 h-8 text-violet-400 opacity-50" />
                <p className="text-lg leading-relaxed text-foreground flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-4 mt-4 pt-6 border-t border-white/10">
                  <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full border-2 border-white/10" />
                  <div>
                    <h4 className="font-semibold">{t.author}</h4>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trusted By Logos (Mock) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-24 pt-10 border-t border-white/5"
        >
          <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest">Trusted by elite teams at</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Acme Corp', 'Quantum', 'Nebula', 'Zenith', 'Vortex'].map((company) => (
              <span key={company} className="text-xl md:text-2xl font-bold tracking-tighter text-foreground/80 hover:text-foreground transition-colors">
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
