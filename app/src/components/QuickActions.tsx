import { Bot, Calendar, StickyNote } from "lucide-react";
import { useNavigate } from "react-router";
import { GlassButton } from "./ui/glass-button";

const actions = [
  { icon: Bot, label: "AI Assistant", subtitle: "Ask Your Workspace Anything", path: "/ai" },
  { icon: Calendar, label: "Calendar", subtitle: "View Your Schedule", path: "/calendar" },
  { icon: StickyNote, label: "Quick Note", subtitle: "Capture An Idea Fast", path: "/notes" },
];

export function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4">
      {actions.map((action, i) => {
        const isPrimary = action.label === "AI Assistant";
        return (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className={`flex flex-col items-center gap-1.5 px-6 py-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer ring-1 ${isPrimary
              ? "bg-primary text-primary-foreground ring-primary/20"
              : "bg-card/30 backdrop-blur-md text-foreground ring-border/50 hover:bg-card/50"
              }`}
          >
            <action.icon size={isPrimary ? 24 : 20} className={isPrimary ? "text-primary-foreground" : "text-primary"} />
            <div className="flex flex-col items-center text-center">
              <span className={`text-[15px] font-bold tracking-tight ${isPrimary ? "text-primary-foreground" : "text-foreground"}`}>
                {action.label}
              </span>
              <span className={`text-[10px] font-medium opacity-60 tracking-tight ${isPrimary ? "text-primary-foreground" : "text-muted-foreground"}`}>
                {action.subtitle}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  );
}
