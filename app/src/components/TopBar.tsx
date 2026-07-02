import { Search, Sun, Moon, CalendarDays, Bell, CheckSquare, FolderOpen, FileText, X, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  label: string;
  sublabel?: string;
  type: "task" | "project" | "note";
  path: string;
}

function useSearchResults(query: string) {
  const { data: tasks = [] } = useQuery<any[]>({
    queryKey: ["tasks"],
    queryFn: () => api.get("/tasks").then((r) => r.data),
    enabled: query.length > 0,
    staleTime: 30_000,
  });
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ["projects"],
    queryFn: () => api.get("/projects").then((r) => r.data),
    enabled: query.length > 0,
    staleTime: 30_000,
  });
  const { data: notes = [] } = useQuery<any[]>({
    queryKey: ["notes"],
    queryFn: () => api.get("/notes").then((r) => r.data),
    enabled: query.length > 0,
    staleTime: 30_000,
  });

  if (!query.trim()) return [];

  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  tasks
    .filter((t: any) => t.title?.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach((t: any) =>
      results.push({
        id: t._id,
        label: t.title,
        sublabel: `${t.status} · ${t.priority}`,
        type: "task",
        path: "/tasks",
      })
    );

  projects
    .filter((p: any) => p.title?.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach((p: any) =>
      results.push({
        id: p._id,
        label: p.title,
        sublabel: p.description || "Project",
        type: "project",
        path: "/projects",
      })
    );

  notes
    .filter(
      (n: any) =>
        n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)
    )
    .slice(0, 3)
    .forEach((n: any) =>
      results.push({
        id: n._id,
        label: n.title || "Untitled Note",
        sublabel: n.content?.slice(0, 60) || "Note",
        type: "note",
        path: "/notes",
      })
    );

  return results;
}

const typeConfig = {
  task: { icon: CheckSquare, label: "Task" },
  project: { icon: FolderOpen, label: "Project" },
  note: { icon: FileText, label: "Note" },
};

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const results = useSearchResults(searchQuery);
  const showDropdown = isSearchFocused && searchQuery.length > 0;

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !searchRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigateToResult(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
      setSearchQuery("");
    }
  };

  const navigateToResult = (result: SearchResult) => {
    navigate(result.path);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const handleBellClick = () => {
    toast("No new notifications", { icon: "🔔" });
  };

  const handleCalendarClick = () => {
    navigate("/calendar");
  };

  const rightIcons = [
    { Icon: theme === "light" ? Moon : Sun, onClick: toggleTheme },
    { Icon: CalendarDays, onClick: handleCalendarClick },
    { Icon: Bell, onClick: handleBellClick },
  ];

  return (
    <header className="relative flex items-center justify-between px-8 py-4 z-20 bg-background border-b border-border transition-colors duration-300">
      {/* Search Bar */}
      <div className="flex-1 max-w-[440px] relative">
        <div
          className={`relative flex items-center gap-3 rounded-xl px-4 py-2 transition-all duration-300 group border ${
            isSearchFocused
              ? "border-primary bg-background"
              : "border-border bg-muted/30 focus-within:border-primary"
          }`}
        >
          <Search
            size={18}
            className={`shrink-0 transition-colors ${
              isSearchFocused ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search tasks, projects, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none w-full text-[14px] text-foreground placeholder-muted-foreground"
          />
          {searchQuery ? (
            <button
              onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0 opacity-50 group-focus-within:opacity-100 transition-opacity">
              <span className="text-[10px] font-medium border border-border rounded px-1.5 py-0.5">⌘</span>
              <span className="text-[10px] font-medium border border-border rounded px-1.5 py-0.5">K</span>
            </div>
          )}
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-full z-50 rounded-xl bg-card border border-border shadow-lg overflow-hidden"
            >
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center text-[13px] text-muted-foreground">
                  No results for "{searchQuery}"
                </div>
              ) : (
                <div className="py-2">
                  {results.map((result, i) => {
                    const { icon: Icon, label } = typeConfig[result.type];
                    return (
                      <button
                        key={result.id}
                        onClick={() => navigateToResult(result)}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                          i === selectedIndex ? "bg-muted text-foreground" : "hover:bg-muted"
                        }`}
                      >
                        <div className="w-8 h-8 rounded flex items-center justify-center shrink-0 bg-muted text-muted-foreground">
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-medium text-foreground truncate">
                            {result.label}
                          </p>
                          {result.sublabel && (
                            <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                              {result.sublabel}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] uppercase tracking-normal text-muted-foreground font-medium shrink-0">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right icons + User Profile */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {rightIcons.map((item, i) => {
            const { Icon, onClick } = item;
            return (
              <button
                key={i}
                onClick={onClick}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="flex flex-col items-end">
            <span className="text-[13px] font-medium text-foreground">
              {user?.name || "User"}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Personal
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
             <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}

