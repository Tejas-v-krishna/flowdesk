import { useState } from "react";
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
  DollarSign,
  Trello,
  Crosshair,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FolderOpen, label: "Projects", path: "/projects" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: Trello, label: "Kanban", path: "/kanban" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: Target, label: "Focus", path: "/focus" },
  { icon: FileText, label: "Notes", path: "/notes" },
  { icon: Bot, label: "AI Assistant", path: "/ai" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Crosshair, label: "Goals", path: "/goals" },
  { icon: DollarSign, label: "Finance", path: "/finance" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state: any) => state.logout);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[240px] flex flex-col py-6 z-50 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-colors duration-300"
    >
      {/* Logo */}
      <div
        className="flex items-center px-6 mb-8 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span className="text-xl font-medium tracking-normal">FlowDesk.</span>
      </div>

      {/* Nav items */}
      <div className="flex-1 flex flex-col gap-1 overflow-y-auto px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors duration-200 cursor-pointer ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="text-[14px]">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col gap-1 px-4 mt-4">
        <button
          onClick={() => setShowShortcuts(true)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors cursor-pointer text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
        >
          <Keyboard size={18} />
          <span className="text-[14px]">Shortcuts</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors cursor-pointer text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={18} />
          <span className="text-[14px]">Log Out</span>
        </button>
        {showShortcuts && (
          <KeyboardShortcutsModal
            open={showShortcuts}
            onClose={() => setShowShortcuts(false)}
          />
        )}
      </div>
    </aside>
  );
}

