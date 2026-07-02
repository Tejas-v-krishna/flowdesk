import { useState } from "react";
import { Plus, FolderOpen, LayoutGrid, List, Trash2, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import { GlassPanel } from "../components/GlassPanel";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuLabel,
} from "../components/ui/context-menu";
import { Archive, Edit3, ExternalLink, Trash } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

interface Project {
  _id: string;
  title: string;
  description: string;
  color: string;
  tasksCount?: number;
  progress?: number;
  createdAt?: string;
}

const projectColors = ["#000000", "#ff4242", "#42ff6b", "#ffffff", "#ffb342", "#42d4ff"];

export function ProjectsPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState("#000000");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (newProject: any) => api.post('/projects', newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setNewName(""); setNewDesc(""); setNewColor("#000000"); setShowForm(false);
      toast.success("Project created");
    },
    onError: () => toast.error("Failed to create project"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['projects'] }); toast.success("Project deleted"); },
    onError: () => toast.error("Failed to delete project"),
  });

  const addProject = () => {
    if (!newName.trim()) return;
    createMutation.mutate({
      title: newName.trim(),
      description: newDesc.trim() || "No description",
      color: newColor,
      status: 'Ongoing'
    });
  };

  const deleteProject = (id: string) => deleteMutation.mutate(id);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex-1 flex flex-col gap-8 p-8 max-w-[1400px] mx-auto w-full">
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex items-end justify-between mb-4">
        <div className="flex flex-col gap-1">
          <p className="text-primary font-black tracking-[0.2em] text-[11px] uppercase ml-1 opacity-70">Portfolio & Initiatives</p>
          <h1 className="text-foreground text-[42px] tracking-[-0.04em] leading-none font-black">
            Projects
          </h1>
          <p className="text-muted-foreground/60 text-[16px] font-medium tracking-normal mt-2">
            Managing {projects.length} active initiatives and their progress.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-muted/20 border border-border/10 rounded-2xl p-1 backdrop-blur-xl">
            <button 
              onClick={() => setViewMode("grid")} 
              className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")} 
              className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List size={18} />
            </button>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-2xl font-black text-[13px] tracking-normal uppercase shadow-[0_8px_20px_rgba(120,76,254,0.3)] hover:shadow-[0_12px_25px_rgba(120,76,254,0.4)] transition-all hover:-translate-y-0.5"
          >
            <Plus size={18} strokeWidth={3} />
            New Project
          </button>
        </div>
      </motion.div>

      {/* Project Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active", value: projects.length, color: "var(--primary)", bg: "bg-primary/5" },
          { label: "Completed", value: projects.filter(p => (p.progress || 0) >= 100).length, color: "#000000", bg: "bg-muted" },
          { label: "High Priority", value: projects.filter(p => (p.progress || 0) < 30).length, color: "#000000", bg: "bg-muted" },
          { label: "Total Tasks", value: projects.reduce((acc, curr) => acc + (curr.tasksCount || 0), 0), color: "#a78bfa", bg: "bg-muted" },
        ].map(stat => (
          <GlassPanel key={stat.label} className="p-5 flex items-center justify-between group hover:border-border/30 transition-colors">
            <div>
              <p className="text-muted-foreground/40 text-[10px] font-black uppercase tracking-[0.1em] mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-foreground tabular-nums">{stat.value}</h4>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`} style={{ color: stat.color }}>
               {/* Visual filler */}
               <div className="w-1.5 h-6 rounded-full opacity-60" style={{ backgroundColor: stat.color }} />
            </div>
          </GlassPanel>
        ))}
      </motion.div>

      {/* Projects Grid/List */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center h-[400px]">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : projects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex-1 flex flex-col items-center justify-center h-[400px] text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted/20 flex items-center justify-center mb-6">
              <FolderOpen size={40} className="text-primary/40" />
            </div>
            <h3 className="text-xl font-black text-foreground mb-2">Workspace Empty</h3>
            <p className="text-muted-foreground/60 max-w-[280px] text-sm font-medium mb-8">
              Start organzing your workflow by creating your first major project.
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-2xl font-black text-[13px] tracking-normal uppercase"
            >
              <Plus size={18} strokeWidth={3} />
              Get Started
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key={viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-3"}
          >
            {projects.map((p) => (
              <ContextMenu key={p._id}>
                <ContextMenuTrigger>
                  <motion.div layout>
                    <GlassPanel
                      className={`group hover:border-primary/30 transition-all duration-300 relative overflow-hidden h-full ${
                        viewMode === 'list' ? 'flex items-center gap-6 py-4 px-6' : 'p-6 flex flex-col'
                      }`}
                    >
                      {/* Top bar for grid view */}
                      {viewMode === 'grid' && (
                        <div className="flex items-start justify-between mb-5">
                          <div 
                            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner relative"
                            style={{ backgroundColor: `${p.color}15`, color: p.color }}
                          >
                            <FolderOpen size={24} />
                            <div className="absolute inset-0 rounded-2xl border border-white/5" />
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteProject(p._id); }} 
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors bg-muted/20 rounded-xl"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}

                      {/* Content block */}
                      <div className={`flex-1 ${viewMode === 'list' ? 'flex items-center gap-6 flex-1' : ''}`}>
                        {viewMode === 'list' && (
                           <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${p.color}15`, color: p.color }}
                          >
                            <FolderOpen size={20} />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-foreground text-[17px] font-black tracking-normal mb-1 group-hover:text-primary transition-colors cursor-default">
                            {p.title}
                          </h4>
                          <p className="text-muted-foreground/60 text-[13px] font-medium line-clamp-2 leading-relaxed">
                            {p.description}
                          </p>
                        </div>

                        {viewMode === 'list' && (
                          <div className="flex items-center gap-10">
                            <div className="flex flex-col items-end min-w-[80px]">
                               <span className="text-foreground font-black text-sm">{p.tasksCount || 0}</span>
                               <span className="text-[10px] text-muted-foreground/50 font-black uppercase tracking-normaler">Tasks</span>
                            </div>
                            <div className="w-[120px]">
                               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1.5">
                                 <span>{p.progress || 0}%</span>
                               </div>
                               <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${p.progress || 0}%` }}
                                   className="h-full rounded-full" 
                                   style={{ backgroundColor: p.color }} 
                                 />
                               </div>
                            </div>
                            <span className="text-muted-foreground/40 text-[11px] font-black tabular-nums">
                              {new Date(p.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress bar for grid view */}
                      {viewMode === 'grid' && (
                        <div className="mt-8 pt-6 border-t border-border/10">
                          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2.5">
                            <span>{p.tasksCount || 0} Tasks</span>
                            <span className="text-foreground">{p.progress || 0}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted/20 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${p.progress || 0}%` }}
                              className="h-full rounded-full " 
                              style={{ 
                                background: `linear-gradient(to right, ${p.color}, ${p.color}dd)`,
                                backgroundColor: p.color 
                              }} 
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Gradient glow */}
                      <div 
                        className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500"
                        style={{ backgroundColor: p.color }}
                      />
                    </GlassPanel>
                  </motion.div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-56 bg-zinc-900/95 backdrop-blur-2xl border-white/10 p-1.5 rounded-2xl shadow-2xl">
                  <ContextMenuLabel className="px-3 py-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground/50 border-b border-white/5 mb-1">{p.title}</ContextMenuLabel>
                  <ContextMenuItem onClick={() => toast.success(`Viewing ${p.title}`)} className="rounded-xl py-2.5 px-3 focus:bg-primary/10">
                    <ExternalLink className="mr-3 h-4 w-4" />
                    Open Project
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => toast.success("Edit mode coming soon!")} className="rounded-xl py-2.5 px-3 focus:bg-primary/10">
                    <Edit3 className="mr-3 h-4 w-4" />
                    Edit Details
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => toast.success("Project Archived")} className="rounded-xl py-2.5 px-3 focus:bg-primary/10">
                    <Archive className="mr-3 h-4 w-4" />
                    Archive Project
                  </ContextMenuItem>
                  <ContextMenuSeparator className="bg-white/5 my-1" />
                  <ContextMenuItem
                    onClick={() => deleteProject(p._id)}
                    className="rounded-xl py-2.5 px-3 text-foreground focus:text-foreground focus:bg-muted cursor-pointer"
                  >
                    <Trash className="mr-3 h-4 w-4" />
                    Delete Project
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Dialog */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-[480px] rounded-2xl bg-zinc-900 border border-white/10 p-8 shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
            >
              <h3 className="text-white text-2xl font-black mb-6 tracking-normal">Create Initiative</h3>
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Initiative Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter project name..." 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    onKeyDown={(e) => e.key === "Enter" && addProject()} 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none text-[15px] font-medium focus:border-primary focus:bg-white/10 transition-all" 
                    autoFocus 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Context / Goal</label>
                  <textarea 
                    placeholder="Brief description..." 
                    value={newDesc} 
                    onChange={(e) => setNewDesc(e.target.value)} 
                    rows={3} 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white outline-none text-[15px] font-medium focus:border-primary focus:bg-white/10 transition-all resize-none" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Aesthetic Key</label>
                  <div className="flex gap-3">
                    {projectColors.map(c => (
                      <button 
                        key={c} 
                        onClick={() => setNewColor(c)} 
                        className={`w-10 h-10 rounded-xl transition-all relative ${newColor === c ? "scale-110 ring-2 ring-white ring-offset-4 ring-offset-zinc-900 shadow-xl" : "hover:scale-105 opacity-60 hover:opacity-100"}`} 
                        style={{ backgroundColor: c }}
                      >
                        {newColor === c && <div className="absolute inset-0 rounded-xl border-2 border-white/20" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-10">
                <button 
                  onClick={() => { setShowForm(false); setNewName(""); setNewDesc(""); }} 
                  className="flex-1 py-4 rounded-2xl bg-white/5 text-zinc-400 font-bold hover:bg-white/10 hover:text-white transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button 
                  onClick={addProject} 
                  disabled={createMutation.isPending || !newName.trim()} 
                  className="flex-[1.5] py-4 rounded-2xl bg-primary text-primary-foreground font-black text-[15px] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {createMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} strokeWidth={3} />}
                  Create Initiative
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
