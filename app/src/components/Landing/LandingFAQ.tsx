import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "What is Flowdesk?",
    a: "Flowdesk is an advanced Personal Productivity OS designed to unify your task management, financial tracking, and deep-work sessions into one highly aesthetic, AI-powered ecosystem."
  },
  {
    q: "Is Flowdesk safe to use?",
    a: "Absolutely. We use enterprise-grade encryption for all data, and our active nodes for financial tracking rely on secure, read-only API integrations (like Plaid and Stripe)."
  },
  {
    q: "Can I sync my data across multiple devices?",
    a: "Yes. Flowdesk utilizes an Omni-Sync architecture powered by Socket.io, meaning any changes you make on one device instantly reflect everywhere else without needing a refresh."
  },
  {
    q: "Does Flowdesk provide AI insights?",
    a: "Yes, our Brain AI acts as your Mission Control. It analyzes your daily productivity, focus momentum, and goals to provide you with actionable executive briefings."
  },
  {
    q: "Is there a free trial?",
    a: "We offer a 14-day unrestricted free trial so you can experience the full power of Flowdesk before committing to a plan."
  }
];

export const LandingFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
      <div className="md:w-1/3">
        <div className="sticky top-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-4"
          >
            <HelpCircle className="text-violet-400 w-6 h-6" />
            <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">FAQ</h2>
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold mb-6"
          >
            Frequently Asked <span className="italic gradient-text">Questions</span>
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Still have questions? Can't find what you're looking for? Reach out to our concierge support team for personalized assistance.
          </motion.p>
        </div>
      </div>

      <div className="md:w-2/3 flex flex-col gap-4">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="landing-glass rounded-2xl border border-white/5 overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(idx)}
              className="w-full px-6 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-medium text-lg pr-4">{faq.q}</span>
              <ChevronDown 
                className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-violet-400' : ''}`} 
              />
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 pt-2 text-muted-foreground leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
