import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Activity, Menu, X } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { LandingHero } from "../components/Landing/LandingHero";
import { LandingFeatures } from "../components/Landing/LandingFeatures";
import { LandingSocialProof } from "../components/Landing/LandingSocialProof";
import { LandingFAQ } from "../components/Landing/LandingFAQ";
import { LandingFooter } from "../components/Landing/LandingFooter";

export const HomePage = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30 font-sans relative">
      
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-sm' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center transition-transform group-hover:scale-105">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Flowdesk</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors">Features</a>
              <a href="#autonomous" className="text-foreground/70 hover:text-foreground transition-colors">Autonomous</a>
              <a href="#customers" className="text-foreground/70 hover:text-foreground transition-colors">Customers</a>
              <a href="#faq" className="text-foreground/70 hover:text-foreground transition-colors">FAQ</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-foreground/70 hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/login" className="hidden md:block text-sm font-medium hover:text-emerald-500 transition-colors">
              Log in
            </Link>
            <Link to="/login" className="hidden md:flex px-5 py-2.5 text-sm font-medium bg-foreground text-background rounded-full hover:scale-105 transition-transform hover:shadow-lg">
              Sign up
            </Link>
            <button className="md:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-white/10 p-6 flex flex-col gap-4 shadow-xl">
            <a href="#features" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#autonomous" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Autonomous</a>
            <a href="#customers" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Customers</a>
            <a href="#faq" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <div className="h-px bg-white/10 w-full my-2"></div>
            <Link to="/login" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
            <Link to="/login" className="py-3 text-center text-sm font-medium bg-foreground text-background rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              Sign up
            </Link>
          </div>
        )}
      </nav>

      <main className="flex-1 w-full relative">
        <LandingHero />
        <LandingFeatures />
        <LandingSocialProof />
        <LandingFAQ />
      </main>

      <LandingFooter />
    </div>
  );
};
