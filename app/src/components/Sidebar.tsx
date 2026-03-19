import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Calendar,
  Target,
  FileText,
  Bot,
  BarChart3,
  Keyboard,
  LogOut,
  User,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";
import { GlassPanel } from "./GlassPanel";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: FolderOpen, label: "Projects", path: "/projects" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: Target, label: "Focus", path: "/focus" },
  { icon: FileText, label: "Notes", path: "/notes" },
  { icon: Bot, label: "AI Assistant", path: "/ai" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <GlassPanel
      as="aside"
      rounded="0 0 30px 0"
      className="fixed left-0 top-0 h-screen w-[200px] flex flex-col items-center py-6 z-50 transition-all duration-500"
      style={{
        borderTop: 'none',
        borderLeft: 'none',
        borderBottom: 'none',
      }}
    >

      {/* Logo */}
      <div
        className="relative z-10 flex items-center justify-center mb-8 px-4 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src="/Group 5.svg" alt="FlowDesk" className="w-[150px] h-auto transition-transform duration-300 hover:scale-[1.02]" />
      </div>

      {/* Nav items */}
      <div className="relative z-10 flex-1 w-[170px] flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`relative flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer group ${isActive
                ? "bg-primary/15 border border-primary/30 text-foreground shadow-[0_0_20px_rgba(120,76,254,0.1)]"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-transparent"
                }`}
            >
              {/* Active glow indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[5px] h-[28px] rounded-r-full bg-primary shadow-[0_0_20px_var(--primary)]"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className={`shrink-0 transition-colors duration-300 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
              />
              <span
                className={`text-[14px] font-bold tracking-tight transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div className="relative z-10 w-[170px] mt-3 flex flex-col gap-1">
        <button
          onClick={() => setShowShortcuts(true)}
          className="flex items-center justify-between w-full px-4 py-2 rounded-xl transition-all cursor-pointer text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
        >
          <div className="flex items-center gap-2.5">
            <Keyboard size={16} />
            <span className="text-[13px] font-medium tracking-tight">
              Shortcuts
            </span>
          </div>
          <span
            className="text-[10px] rounded px-1.5 py-0.5 bg-muted/50 text-muted-foreground/60"
          >
            /
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-4 py-2 rounded-xl hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-all cursor-pointer border border-transparent"
        >
          <LogOut size={16} />
          <span className="text-[13px] font-medium tracking-tight">LogOut</span>
        </button>
        {showShortcuts && <KeyboardShortcutsModal open={showShortcuts} onClose={() => setShowShortcuts(false)} />}
      </div>
    </GlassPanel>
  );
}
