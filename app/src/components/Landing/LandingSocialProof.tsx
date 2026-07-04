import React from "react";
import { motion } from "framer-motion";

export const LandingSocialProof = () => {
  return (
    <section id="customers" className="py-24 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 max-w-2xl mx-auto leading-tight">
            Built for those who refuse to work conventionally.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          {/* Testimonial 1 */}
          <div className="flex flex-col gap-6">
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground/90">
              "Managing operations for a global white-label studio means constant context switching. Flowdesk eliminates the friction, boosting our operational biometrics and keeping the team in deep focus."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-500">
                SJ
              </div>
              <div>
                <div className="font-bold text-foreground">Sarah Jenkins</div>
                <div className="text-sm text-muted-foreground">Founder @ Whiteledge</div>
              </div>
            </div>
            <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Caterine</div>
          </div>

          {/* Testimonial 2 */}
          <div className="flex flex-col gap-6">
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground/90">
              "Whether I'm shipping projects to overseas clients or managing a global merchant matrix, liquidity is crucial. Flowdesk's instant goal alignment and exceptionally clean interface makes executing effortless."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center font-bold text-cyan-500">
                MS
              </div>
              <div>
                <div className="font-bold text-foreground">Marcus Smith</div>
                <div className="text-sm text-muted-foreground">Independent Developer</div>
              </div>
            </div>
            <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Procore</div>
          </div>
        </div>

      </div>
    </section>
  );
};
