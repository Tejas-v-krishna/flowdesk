import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useThemeStore } from "../store/useThemeStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const lightThemeCSS = `
  /* ===== Light theme text color overrides ===== */
  .light-theme .text-white { color: #1a1a2e !important; }

  .light-theme [class*="text-[#ccbaff]"]:not([class*="bg-clip-text"]) { color: #4a3a6e !important; }
  .light-theme [class*="text-[#ccc]"] { color: #333 !important; }
  .light-theme [class*="text-[#ddd]"] { color: #1a1a2e !important; }
  .light-theme [class*="text-[#999]"] { color: #666 !important; }
  .light-theme [class*="text-[#777]"] { color: #784cfe !important; }
  .light-theme [class*="text-[#666]"] { color: #888 !important; }
  .light-theme [class*="text-[#555]"] { color: #999 !important; }

  /* Placeholder overrides */
  .light-theme [class*="placeholder-[#666]"]::placeholder { color: #aaa !important; }
  .light-theme [class*="placeholder-[#ccbaff]"]::placeholder { color: rgba(74, 58, 110, 0.4) !important; }
  .light-theme [class*="placeholder-[#999]"]::placeholder { color: #bbb !important; }

  /* Inner card dark backgrounds lighten */
  .light-theme [class*="bg-[rgba(3,0,12,"] { background-color: rgba(120, 76, 254, 0.04) !important; }
  .light-theme [class*="bg-[rgba(46,29,97,"] { background-color: rgba(120, 76, 254, 0.06) !important; }
  .light-theme [class*="bg-[#2e1d61]"] { background-color: rgba(120, 76, 254, 0.1) !important; }
  .light-theme [class*="bg-[rgba(40,40,40,"] { background-color: rgba(120, 76, 254, 0.05) !important; }
  .light-theme [class*="bg-[rgba(107,107,107,"] { background-color: rgba(255, 255, 255, 0.5) !important; }
  .light-theme [class*="bg-[rgba(204,186,255,0.1"] { background-color: rgba(120, 76, 254, 0.08) !important; }
  .light-theme [class*="bg-[rgba(204,186,255,0.15"] { background-color: rgba(120, 76, 254, 0.1) !important; }
  .light-theme [class*="bg-[rgba(60,60,60,"] { background-color: rgba(120, 76, 254, 0.04) !important; }
  .light-theme [class*="bg-[rgba(80,80,80,"] { background-color: rgba(120, 76, 254, 0.04) !important; }
  .light-theme [class*="bg-[rgba(25,25,30,"] { background-color: rgba(255, 255, 255, 0.95) !important; }
  .light-theme [class*="bg-[rgba(20,20,25,"] { background-color: rgba(255, 255, 255, 0.95) !important; }
  .light-theme [class*="bg-[rgba(30,30,35,"] { background-color: rgba(255, 255, 255, 0.9) !important; }
  .light-theme [class*="bg-[#0d0d0d]"] { background-color: #f4f2f7 !important; }
  .light-theme [class*="bg-[#1a1a20]"] { background-color: rgba(255,255,255,0.8) !important; }
  .light-theme [class*="bg-[#111115]"] { background-color: rgba(255,255,255,0.7) !important; }
  .light-theme [class*="bg-[#15151a]"] { background-color: rgba(255,255,255,0.75) !important; }

  /* Border overrides for light mode */
  .light-theme [class*="border-[rgba(159,159,159,"] { border-color: rgba(120, 76, 254, 0.08) !important; }
  .light-theme [class*="border-[rgba(80,80,80,"] { border-color: rgba(120, 76, 254, 0.08) !important; }
  .light-theme [class*="border-[rgba(204,186,255,0.2"] { border-color: rgba(120, 76, 254, 0.12) !important; }
  .light-theme [class*="border-[rgba(204,186,255,0.3"] { border-color: rgba(120, 76, 254, 0.15) !important; }
  .light-theme [class*="border-[rgba(204,186,255,0.4"] { border-color: rgba(120, 76, 254, 0.2) !important; }
  .light-theme [class*="border-[rgba(255,255,255,"] { border-color: rgba(120, 76, 254, 0.06) !important; }

  /* Hover overrides */
  .light-theme [class*="hover:bg-[rgba(120,76,254,"]:hover { background-color: rgba(120, 76, 254, 0.12) !important; }
  .light-theme [class*="hover:border-[rgba(120,76,254,"]:hover { border-color: rgba(120, 76, 254, 0.2) !important; }
  .light-theme [class*="hover:border-[rgba(204,186,255,"]:hover { border-color: rgba(120, 76, 254, 0.18) !important; }

  /* Scrollbar */
  .light-theme ::-webkit-scrollbar-thumb { background: rgba(120, 76, 254, 0.15) !important; }
  .light-theme ::-webkit-scrollbar-track { background: rgba(120, 76, 254, 0.03) !important; }

  /* Recharts tooltip override */
  .light-theme .recharts-default-tooltip { background: rgba(255,255,255,0.95) !important; border-color: rgba(120,76,254,0.1) !important; }
`;

function LayoutInner() {
  const theme = useThemeStore((state) => state.theme);
  const location = useLocation();

  useEffect(() => {
    // Inject light theme CSS when in light mode
    if (theme === "light") {
      if (!document.getElementById("light-theme-styles")) {
        const style = document.createElement("style");
        style.id = "light-theme-styles";
        style.textContent = lightThemeCSS;
        document.head.appendChild(style);
      }
    } else {
      // Remove light theme CSS when in dark mode
      const style = document.getElementById("light-theme-styles");
      if (style) {
        style.remove();
      }
    }
  }, [theme]);

  return (
    <div
      className={`min-h-screen overflow-auto relative transition-colors duration-500 ${theme === "light" ? "light-theme" : ""}`}
      style={{
        background: "transparent",
        color: theme === "light" ? "#1a1a2e" : "#ffffff",
      }}
    >
      {/* 
          Z-Index Stacking (Positive indices prevent body overlay issues):
          - z-[1]: Base Background Color
          - z-[2]: Global Background Image (Group 7.png)
          - z-[3]: Ambient Glass Orbs
          - z-[10]: Main Content (Sidebar, TopBar, Page Content)
      */}

      {/* 3. Ambient background orbs for refraction (kept for depth) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[3]">
        {/* ... existing orbs ... */}
      </div>

      <Sidebar />
      <main className="ml-[200px] flex flex-col min-h-screen relative z-[10]">
        <TopBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export function Layout() {
  return <LayoutInner />;
}
