import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Activity } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { LandingHero } from "../components/Landing/LandingHero";
import { LandingFeatures } from "../components/Landing/LandingFeatures";
import { LandingSocialProof } from "../components/Landing/LandingSocialProof";
import { LandingFAQ } from "../components/Landing/LandingFAQ";
import { LandingFooter } from "../components/Landing/LandingFooter";

export const HomePage = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-violet-500/30 font-sans flex flex-col relative overflow-hidden">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 border-b border-white/5 bg-background/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Flowdesk</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link to="/login" className="text-sm font-medium hover:text-violet-400 transition-colors hidden sm:block">
            Log in
          </Link>
          <Link to="/login" className="px-5 py-2 text-sm font-medium bg-foreground text-background rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Sign up
          </Link>
        </div>
      </nav>

      <main className="flex-1 w-full pt-16">
        <LandingHero />
        <LandingFeatures />
        <LandingSocialProof />
        <LandingFAQ />
      </main>

      <LandingFooter />
    </div>
  );
};
