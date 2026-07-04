import React from "react";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

export const LandingFooter = () => {
  return (
    <footer className="relative z-20">
      
      {/* Pre-footer Call to Action */}
      <div className="w-full relative py-32 overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity transition-opacity duration-700" style={{ backgroundImage: "url('/hero_landscape.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <div className="relative z-10 max-w-3xl px-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 drop-shadow-md">
            Your Gateway to Frictionless <br/> Deep Work.
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            An entire native OS ecosystem running securely on your machine. Start managing tasks, goals, and finances today without friction.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link
              to="/login"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-bold text-sm transition-all shadow-lg hover:-translate-y-1"
            >
              Deploy Workspace
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full font-bold text-sm transition-all hover:-translate-y-1"
            >
              Explore API
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full bg-background pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          
          <div className="col-span-2 md:col-span-2 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-foreground text-background flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight uppercase">Flowdesk</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Global infrastructure for frictionless deep work. Manage tasks, finances, and operational goals with enterprise-grade autonomy.
            </p>
            <div className="flex items-center gap-2 mt-auto">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-xs font-bold text-emerald-500 tracking-widest uppercase">All Systems Operational</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground">Products</h4>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Pricing</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Use Cases</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Product Roadmap</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Changelog</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground">Resources</h4>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Documentation</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Help Center</Link>
            <div className="flex items-center gap-2">
              <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">API Reference</Link>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase font-bold">New</span>
            </div>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Community Forum</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground">Company</h4>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">About Us</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Careers</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Blog</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Contact</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground">Legal</h4>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Terms of Service</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">Cookie Policy</Link>
          </div>

        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-xs text-muted-foreground">
          <p>&copy; 2026 Flowdesk Technologies. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <Link to="#" className="hover:text-foreground transition-colors">Twitter</Link>
             <Link to="#" className="hover:text-foreground transition-colors">LinkedIn</Link>
             <Link to="#" className="hover:text-foreground transition-colors">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
