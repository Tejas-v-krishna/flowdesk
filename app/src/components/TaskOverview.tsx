import { MoreHorizontal, FolderOpen, X, MoreVertical, Layers, ChevronRight, Eye, Edit2, Archive, Trash2, ExternalLink, Edit3 } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuLabel,
} from "./ui/context-menu";
import { toast } from "react-hot-toast";

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
}

interface Project {
  _id: string;
  title: string;
  status: string;
  color?: string;
  progress?: number; // Added progress property
}

interface Props {
  tasks?: Task[];
  projects?: Project[];
}

export function TaskOverview({ projects = [] }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Removed ongoing, completed, paused, archived calculations and stats array
  // as they are no longer used for the progress bars in this component.

  return (
    <>
      <GlassPanel blur={40} className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-foreground text-[16px] font-semibold tracking-tight flex items-center gap-2">
            <FolderOpen size={18} className="text-primary" />
            Project Overview
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-7 h-7 rounded-full bg-[rgba(204,186,255,0.1)] flex items-center justify-center hover:bg-[rgba(204,186,255,0.2)] transition-colors cursor-pointer"
          >
            <MoreHorizontal size={14} className="text-[#ccbaff]" />
          </button>
        </div>

        {/* Project List */}
        <div className="flex flex-col gap-3 flex-1">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 h-full opacity-60">
              <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <FolderOpen size={28} className="text-muted-foreground/30" />
              </div>
              <p className="text-foreground font-medium text-[15px] tracking-tight">No active projects</p>
              <p className="text-muted-foreground text-[12px] mt-1">Start a new initiative to track progress</p>
            </div>
          ) : (
            projects.map((p) => (
              <ContextMenu key={p._id}>
                <ContextMenuTrigger>
                  <div
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[rgba(3,0,12,0.3)] border border-[rgba(159,159,159,0.08)] hover:border-[rgba(204,186,255,0.25)] transition-all cursor-pointer group relative overflow-hidden"
                    onClick={() => navigate("/projects")}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${p.color}20` }}
                      >
                        <Layers size={18} style={{ color: p.color }} />
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="text-foreground text-[14px] font-bold tracking-tight truncate w-full">
                          {p.title}
                        </h4>
                        <p className="text-muted-foreground text-[11px] truncate">
                          {p.status || "Ongoing"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="text-right">
                        <div className="text-[#ccbaff] text-[12px]" style={{ fontWeight: 600 }}>
                          {p.progress || 0}%
                        </div>
                        <div className="w-[60px] h-[3px] rounded-full bg-[rgba(255,255,255,0.05)] mt-1 overflow-hidden">
                          <div
                            className="h-full transition-all duration-1000"
                            style={{
                              width: `${p.progress || 0}%`,
                              backgroundColor: p.color,
                              boxShadow: `0 0 8px ${p.color}60`,
                            }}
                          />
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-[#ccbaff]/20 group-hover:text-[#ccbaff]/60 transition-colors" />
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                  <ContextMenuLabel className="text-[#ccbaff]/80">{p.title}</ContextMenuLabel>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => navigate("/projects")}>
                    <Eye className="mr-2 h-4 w-4 text-[#784cfe]" />
                    View Project
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => toast.success("Edit mode coming soon!")}>
                    <Edit2 className="mr-2 h-4 w-4 text-[#ccbaff]" />
                    Edit Project
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => toast.success("Project Archived")}>
                    <Archive className="mr-2 h-4 w-4 text-[#ff4242]" />
                    Archive Project
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    onClick={() => toast.success("Delete feature in Projects page")}
                    className="text-[#ff4242] focus:text-[#ff4242] focus:bg-[#ff4242]/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[rgba(204,186,255,0.1)] flex items-center justify-between">
          <span className="text-[#ccbaff]/60 text-[11px] font-medium tracking-[1px] uppercase">
            Total Initiatives
          </span>
          <span className="text-white text-[16px] font-bold">
            {projects.length}
          </span>
        </div>
      </GlassPanel>

      {/* Management Modal using Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-hidden">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-[400px] rounded-3xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] bg-[rgba(25,25,30,0.85)] border border-[rgba(204,186,255,0.2)] backdrop-blur-2xl"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-white text-[24px] tracking-[-1px] font-bold">Project Management</h2>
                      <p className="text-[#ccbaff]/60 text-[13px] mt-1 font-medium">Quick actions for your initiatives</p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/50 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {[
                      { label: "View All Projects", icon: ExternalLink, color: "#784cfe", description: "Open full project overview" },
                      { label: "Edit Projects", icon: Edit3, color: "#ccbaff", description: "Modify existing project details" },
                      { label: "Delete Archive", icon: Trash2, color: "#ff4242", description: "Cleanup old or archived data" }
                    ].map((action) => (
                      <button
                        key={action.label}
                        onClick={() => {
                          setIsModalOpen(false);
                          navigate('/projects');
                        }}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-card/40 border border-card-border/50 hover:bg-card/60 transition-all cursor-pointer group/item"
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center glass-effect" style={{ backgroundColor: `${action.color}20` }}>
                          <action.icon size={20} style={{ color: action.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-[15px] font-semibold tracking-[-0.3px] group-hover:text-[#ccbaff] transition-colors">
                            {action.label}
                          </div>
                          <div className="text-[#ccbaff]/40 text-[11px] font-medium leading-none mt-1 uppercase tracking-[0.5px]">
                            {action.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-[#784cfe] to-[#ccbaff] text-white font-bold text-[15px] shadow-[0_10px_20px_-5px_rgba(120,76,254,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Close Manager
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
