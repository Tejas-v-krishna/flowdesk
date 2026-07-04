import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is Flowdesk a task manager?",
    answer: "Flowdesk is a Personal Productivity OS. It moves beyond simple task management by integrating your strategic goals, financial tracking, and operational biometrics into one cohesive environment, overseen by an AI."
  },
  {
    question: "How does the AI Mission Control work?",
    answer: "Our AI continuously analyzes your workflow, completed tasks, and stated goals to provide real-time strategic advice, re-prioritize your tasks, and summarize your daily momentum."
  },
  {
    question: "Can I connect my bank accounts for the Finance Pulse?",
    answer: "Yes, Flowdesk integrates securely with Plaid to provide real-time updates on your runway, burn rate, and asset allocation, all visible alongside your daily tasks."
  },
  {
    question: "What is the Focus HUD?",
    answer: "The Focus HUD is a specialized, distraction-free environment that combines Pomodoro timers, ambient soundscapes, and biometric tracking to keep you in a state of deep work."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We employ bank-level encryption (AES-256) for all data at rest and in transit. Your strategic data is your own."
  },
  {
    question: "How long does it take to deploy my workspace?",
    answer: "Deployment is instant. Once you sign up, your unified infrastructure is ready immediately."
  }
];

export const LandingFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Clear Answers.<br/>Complete Transparency.
          </h2>
          <p className="text-muted-foreground text-sm">
            Can't find what you're looking for? Reach out to our dedicated team for personalized assistance.
          </p>
          <button className="mt-6 px-6 py-2 rounded-full bg-foreground text-background text-sm font-bold hover:scale-105 transition-transform">
            Contact Support
          </button>
        </div>

        <div className="w-full flex flex-col gap-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-white/10 last:border-0">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-6 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-bold group-hover:text-emerald-400 transition-colors">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 text-emerald-400" : ""
                  }`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
