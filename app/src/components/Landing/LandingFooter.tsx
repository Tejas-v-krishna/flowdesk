import React from "react";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

export const LandingFooter = () => {
  return (
    <footer className="relative mt-24 border-t border-white/10 pt-20 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black/50">
      <div className="absolute inset-0 noise-overlay z-0" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-violet-500/10 blur-[100px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between gap-16 mb-16">
        <div className="md:w-1/3 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Flowdesk<span className="text-violet-400">®</span></span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your personal OS for strategic alignment, cognitive optimization, and deep work execution. Build the future, faster.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full landing-glass flex items-center justify-center hover:bg-white/10 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.961H5.078z" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full landing-glass flex items-center justify-center hover:bg-white/10 transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-violet-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-violet-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-violet-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Manifesto</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
        <p>© 2026 Flowdesk Technologies. All rights reserved.</p>
        <p className="mt-4 md:mt-0">Designed for High Performers.</p>
      </div>

      {/* Giant Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center overflow-hidden pointer-events-none opacity-5 flex items-end justify-center pt-20">
        <span className="text-[15vw] font-black tracking-tighter leading-none text-white whitespace-nowrap">Flowdesk OS</span>
      </div>
    </footer>
  );
};
