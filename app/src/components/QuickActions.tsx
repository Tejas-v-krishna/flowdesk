import { Bot, Calendar, StickyNote } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const actions = [
  { icon: Bot, label: "AI Assistant", subtitle: "Ask Workspace", path: "/ai", color: "var(--primary)" },
  { icon: Calendar, label: "Calendar", subtitle: "View Schedule", path: "/calendar", color: "white" },
  { icon: StickyNote, label: "Quick Note", subtitle: "Capture Idea", path: "/notes", color: "white" },
];

export function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4">
      {actions.map((action, i) => {
        const isPrimary = action.label === "AI Assistant";
        return (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            onClick={() => navigate(action.path)}
            className={`group relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 active:scale-[0.98] cursor-pointer overflow-hidden ${
              isPrimary 
                ? "bg-primary text-primary-foreground  hover:" 
                : "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20"
            }`}
          >
            <div className={`p-2.5 rounded-xl ${isPrimary ? "bg-white/20" : "bg-primary/10"}`}>
              <action.icon size={20} className={isPrimary ? "text-white" : "text-primary"} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[14px] font-black tracking-normal leading-tight">
                {action.label}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-widest opacity-60`}>
                {action.subtitle}
              </span>
            </div>
            
            {/* Hover effect light */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </motion.button>
        )
      })}
    </div>
  );
}

