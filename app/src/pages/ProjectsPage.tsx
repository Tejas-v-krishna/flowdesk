import { useState } from "react";
import { Plus, FolderOpen, LayoutGrid, List, Trash2, Calendar, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { GlassButton } from "../components/ui/glass-button";
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

const projectColors = ["#784cfe", "#ff4242", "#42ff6b", "#ccbaff", "#ffb342", "#42d4ff"];

export function ProjectsPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState("#784cfe");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (newProject: any) => api.post('/projects', newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setNewName(""); setNewDesc(""); setNewColor("#784cfe"); setShowForm(false);
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
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex-1 flex flex-col px-10 py-6">
      <motion.div variants={itemVariants} className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="bg-gradient-to-b from-[#ccbaff] to-[#784cfe] bg-clip-text text-transparent text-[32px] tracking-[-1.5px]" style={{ fontWeight: 700, lineHeight: 1.2 }}>Projects</h1>
            <p className="text-[#784cfe] text-[13px] mt-0.5" style={{ fontWeight: 500 }}>Managing {projects.length} active initiatives</p>
          </div>
          {isLoading && <Loader2 size={18} className="text-[#ccbaff] animate-spin ml-2" />}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[rgba(40,40,40,0.6)] border border-[rgba(80,80,80,0.3)] rounded-lg overflow-hidden backdrop-blur-xl">
            <button onClick={() => setViewMode("grid")} className={`p-2 transition-all ${viewMode === "grid" ? "bg-[rgba(120,76,254,0.4)] text-white" : "text-[#777] hover:text-white"}`}><LayoutGrid size={16} /></button>
            <button onClick={() => setViewMode("list")} className={`p-2 transition-all ${viewMode === "list" ? "bg-[rgba(120,76,254,0.4)] text-white" : "text-[#777] hover:text-white"}`}><List size={16} /></button>
          </div>
          <GlassButton onClick={() => setShowForm(true)} size="sm" contentClassName="flex items-center gap-2 text-[12px] tracking-[0.5px] font-semibold"><Plus size={15} />NEW PROJECT</GlassButton>
        </div>
      </motion.div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[420px] rounded-2xl bg-[rgba(25,25,30,0.95)] border border-[rgba(80,80,80,0.3)] backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-white text-[18px] mb-5" style={{ fontWeight: 600 }}>Create New Project</h3>
            <div className="flex flex-col gap-4">
              <div><label className="text-[#999] text-[11px] mb-1.5 block">PROJECT NAME</label><input type="text" placeholder="Enter project name..." value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addProject()} className="w-full bg-[rgba(40,40,40,0.6)] border border-[rgba(80,80,80,0.3)] rounded-lg px-4 py-2.5 text-white outline-none text-[13px] focus:border-[#784cfe]" autoFocus /></div>
              <div><label className="text-[#999] text-[11px] mb-1.5 block">DESCRIPTION</label><textarea placeholder="Brief description..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={3} className="w-full bg-[rgba(40,40,40,0.6)] border border-[rgba(80,80,80,0.3)] rounded-lg px-4 py-2.5 text-white outline-none text-[13px] focus:border-[#784cfe] resize-none" /></div>
              <div><label className="text-[#999] text-[11px] mb-1.5 block">COLOR</label><div className="flex gap-2">{projectColors.map(c => <button key={c} onClick={() => setNewColor(c)} className={`w-8 h-8 rounded-full transition-all ${newColor === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#191920] scale-110" : ""}`} style={{ backgroundColor: c }} />)}</div></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setNewName(""); setNewDesc(""); }} className="px-5 py-2 rounded-lg bg-[rgba(60,60,60,0.4)] text-[#999] text-[13px] hover:text-white">Cancel</button>
              <GlassButton onClick={addProject} disabled={createMutation.isPending} size="sm" contentClassName="flex items-center gap-1 text-[13px] font-semibold">{createMutation.isPending && <Loader2 size={14} className="animate-spin" />}Create Project</GlassButton>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {projects.length === 0 && !isLoading ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center -mt-10"><div className="w-[64px] h-[64px] rounded-2xl bg-[rgba(40,40,40,0.6)] flex items-center justify-center mb-4"><FolderOpen size={28} className="text-[#784cfe]" /></div><h3 className="text-white text-[16px] mb-1" style={{ fontWeight: 600 }}>No projects yet</h3><div className="mt-5"><GlassButton onClick={() => setShowForm(true)} size="sm" contentClassName="flex items-center gap-2 text-[12px] font-semibold"><Plus size={15} />NEW PROJECT</GlassButton></div></motion.div>
        ) : (
          <motion.div variants={containerVariants} className={viewMode === "grid" ? "grid grid-cols-3 gap-4" : "flex flex-col gap-2"}>
            {projects.map((p) => (
              <ContextMenu key={p._id}>
                <ContextMenuTrigger>
                  <motion.div
                    variants={itemVariants}
                    layout
                  >
                    <GlassPanel
                      blur={40}
                      className={`hover:border-[rgba(120,76,254,0.3)] transition-all group ${viewMode === 'list' ? 'flex items-center gap-4 py-3 px-5' : 'p-5'}`}
                      style={{ height: viewMode === 'grid' ? '100%' : 'auto' }}
                    >
                      {viewMode === 'grid' ? (
                        <>
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center relative z-10" style={{ backgroundColor: `${p.color}20` }}>
                              <FolderOpen size={20} style={{ color: p.color }} />
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); deleteProject(p._id); }} className="opacity-0 group-hover:opacity-100 p-1.5 text-[#ff4242] relative z-20">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <h4 className="text-white text-[15px] font-semibold mb-1 relative z-10">{p.title}</h4>
                          <p className="text-[#ccbaff]/60 text-[12px] line-clamp-2 mb-4 relative z-10">{p.description}</p>
                          <div className="flex items-center justify-between text-[11px] text-[#ccbaff]/40 relative z-10">
                            <div className="flex items-center gap-1">
                              <Calendar size={11} />
                              <span>{new Date(p.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                            </div>
                            <span>{p.tasksCount || 0} tasks</span>
                          </div>
                          <div className="mt-3 h-1 rounded-full bg-[rgba(204,186,255,0.1)] overflow-hidden relative z-10">
                            <div className="h-full transition-all" style={{ width: `${p.progress || 0}%`, backgroundColor: p.color }} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 relative z-10" style={{ backgroundColor: `${p.color}20` }}>
                            <FolderOpen size={18} style={{ color: p.color }} />
                          </div>
                          <div className="flex-1 min-w-0 relative z-10">
                            <h4 className="text-white text-[14px] font-semibold">{p.title}</h4>
                            <p className="text-[#ccbaff]/40 text-[11px] truncate">{p.description}</p>
                          </div>
                          <span className="text-[#666] text-[11px] relative z-10">{p.tasksCount || 0} tasks</span>
                          <div className="w-[80px] h-1 rounded-full bg-[rgba(204,186,255,0.1)] overflow-hidden relative z-10">
                            <div className="h-full" style={{ width: `${p.progress || 0}%`, backgroundColor: p.color }} />
                          </div>
                          <span className="text-[#666] text-[11px] relative z-10">{new Date(p.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          <button onClick={(e) => { e.stopPropagation(); deleteProject(p._id); }} className="opacity-0 group-hover:opacity-100 p-1.5 text-[#ff4242] relative z-20">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </GlassPanel>
                  </motion.div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuLabel>{p.title}</ContextMenuLabel>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => toast.success(`Viewing ${p.title}`)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Project
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => toast.success("Edit mode coming soon!")}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Details
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => toast.success("Project Archived")}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive Project
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    onClick={() => deleteProject(p._id)}
                    className="text-[#ff4242] focus:text-[#ff4242] focus:bg-[#ff4242]/10"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Project
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {projects.length > 0 && <button onClick={() => setShowForm(true)} className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#784cfe] flex items-center justify-center shadow-[0_0_25px_rgba(120,76,254,0.4)] z-50"><Plus size={22} className="text-white" /></button>}
    </motion.div>
  );
}