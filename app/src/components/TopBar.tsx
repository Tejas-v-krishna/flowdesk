import { Search, Sun, Moon, CalendarDays, Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { toast } from "react-hot-toast";
import { GlassPanel } from "./GlassPanel";

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const searchRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleBellClick = () => {
    toast("No new notifications", { icon: "🔔" });
  };

  const handleCalendarClick = () => {
    navigate("/calendar?today=1");
  };

  const rightIcons = [
    { Icon: theme === "light" ? Moon : Sun, isToggle: true, onClick: toggleTheme },
    { Icon: CalendarDays, isToggle: false, onClick: handleCalendarClick },
    { Icon: Bell, isToggle: false, onClick: handleBellClick },
  ];

  return (
    <GlassPanel
      as="header"
      rounded="0"
      className="relative flex items-center justify-between px-6 py-3 z-20 transition-all duration-500"
      style={{
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
      }}
    >

      {/* Search Bar - Anchored Left */}
      <div className="flex-1 px-4">
        <div
          className="relative flex items-center gap-3 rounded-[14px] px-4 py-2.5 max-w-[440px] transition-all duration-300 group ring-1 ring-border/50 focus-within:ring-primary/40 focus-within:bg-muted/80 backdrop-blur-md"
          style={{
            background: "rgba(10, 10, 11, 0.4)",
          }}
        >
          <Search size={18} className="text-muted-foreground/60 shrink-0 group-focus-within:text-primary transition-colors" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search tasks, projects, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-[14px] font-medium text-foreground placeholder-muted-foreground/40"
          />
          <div className="flex items-center gap-1.5 shrink-0 opacity-30 group-focus-within:opacity-60 transition-opacity">
            <span className="text-[10px] font-bold border border-foreground/30 rounded px-1.5 py-0.5">⌘</span>
            <span className="text-[10px] font-bold border border-foreground/30 rounded px-1.5 py-0.5">K</span>
          </div>
        </div>
      </div>

      {/* Right icons + User Profile */}
      <div className="flex items-center gap-3">
        {rightIcons.map((item, i) => {
          const { Icon, onClick } = item;
          return (
            <button
              key={i}
              onClick={onClick}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary border border-border"
            >
              <Icon size={18} />
            </button>
          );
        })}

        <div className="flex items-center gap-2 ml-2">
          <div className="flex flex-col items-end">
            <span
              className={`text-[12px] tracking-[-0.3px] transition-colors duration-500 ${theme === "light" ? "text-[#1a1a2e]" : "text-[#ddd]"}`}
              style={{ fontWeight: 500 }}
            >
              {user?.name || "User"}
            </span>
            <span
              className={`text-[10px] tracking-[-0.2px] transition-colors duration-500 ${isLight ? "text-[#784cfe]" : "text-[#777]"}`}
            >
              PERSONAL
            </span>
          </div>
          <div
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, #784cfe, #ccbaff)",
              boxShadow: "0 0 12px rgba(120,76,254,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="white" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}