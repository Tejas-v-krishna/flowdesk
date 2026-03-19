import { useState } from "react";
import { Plus, ClipboardList, Search, Trash2, Check, ChevronRight, Flag, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { GlassButton } from "../components/ui/glass-button";

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

interface Task {
  _id: string;
  title: string;
  priority: string;
  status: string;
  createdAt: string;
}

const priorityColors: Record<string, string> = {
  High: "#ff4242",
  Urgent: "#ff0000",
  Medium: "#ffb342",
  Low: "#42ff6b",
};

export function TasksPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks').then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (newTask: any) => api.post('/tasks', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setNewTitle("");
      setShowForm(false);
      toast.success("Task created");
    },
    onError: () => toast.error("Failed to create task"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => api.put(`/tasks/${id}`, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task deleted");
    },
    onError: () => toast.error("Failed to delete task"),
  });

  const addTask = () => {
    if (!newTitle.trim()) return;
    createMutation.mutate({ title: newTitle.trim(), status: "Todo", priority: newPriority });
  };

  const toggleTask = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Done" ? "Todo" : "Done";
    updateMutation.mutate({ id, updates: { status: nextStatus } });
  };

  const deleteTask = (id: string) => deleteMutation.mutate(id);

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = tasks.filter((t) => t.status !== "Done").length;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex-1 flex flex-col px-10 py-6">
      <motion.div variants={itemVariants} className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="bg-gradient-to-b from-[#ccbaff] to-[#784cfe] bg-clip-text text-transparent text-[32px] tracking-[-1.5px]" style={{ fontWeight: 700, lineHeight: 1.2 }}>Tasks</h1>
            <p className="text-[#784cfe] text-[13px] tracking-[-0.3px] mt-0.5" style={{ fontWeight: 500 }}>Tracking {activeCount} active work items</p>
          </div>
          {isLoading && <Loader2 size={18} className="text-[#ccbaff] animate-spin ml-2" />}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[rgba(40,40,40,0.6)] border border-[rgba(80,80,80,0.3)] backdrop-blur-xl rounded-lg px-3 py-2 w-[180px] hover:border-[rgba(120,76,254,0.3)] transition-all">
            <Search size={13} className="text-[#666] shrink-0" />
            <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-[#ccc] placeholder-[#555] outline-none w-full text-[12px]" />
          </div>
          <GlassButton onClick={() => setShowForm(true)} size="sm" contentClassName="flex items-center gap-2 text-[12px] tracking-[0.5px] font-semibold">
            <Plus size={15} />NEW TASK
          </GlassButton>
        </div>
      </motion.div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[420px] rounded-2xl bg-[rgba(25,25,30,0.95)] border border-[rgba(80,80,80,0.3)] backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-white text-[18px] tracking-[-0.5px] mb-5" style={{ fontWeight: 600 }}>Create New Task</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[#999] text-[11px] tracking-[0.5px] mb-1.5 block" style={{ fontWeight: 500 }}>TASK NAME</label>
                <input type="text" placeholder="What needs to be done?" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} className="w-full bg-[rgba(40,40,40,0.6)] border border-[rgba(80,80,80,0.3)] rounded-lg px-4 py-2.5 text-white placeholder-[#555] outline-none text-[13px] focus:border-[#784cfe] transition-colors" autoFocus disabled={createMutation.isPending} />
              </div>
              <div>
                <label className="text-[#999] text-[11px] tracking-[0.5px] mb-1.5 block" style={{ fontWeight: 500 }}>PRIORITY</label>
                <div className="flex gap-2">
                  {(["Low", "Medium", "High"] as const).map((p) => (
                    <button key={p} onClick={() => setNewPriority(p)} className={`flex-1 py-2 rounded-lg text-[12px] tracking-[0.3px] transition-all cursor-pointer border ${newPriority === p ? "border-[rgba(120,76,254,0.5)] bg-[rgba(120,76,254,0.15)]" : "border-[rgba(80,80,80,0.3)] bg-[rgba(40,40,40,0.4)] hover:bg-[rgba(60,60,60,0.4)]"}`} style={{ fontWeight: 500 }}><span style={{ color: priorityColors[p] || '#ccc' }}>{p}</span></button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setNewTitle(""); }} className="px-5 py-2 rounded-lg bg-[rgba(60,60,60,0.4)] border border-[rgba(80,80,80,0.3)] text-[#999] text-[13px] hover:text-white hover:bg-[rgba(80,80,80,0.4)] transition-all cursor-pointer">Cancel</button>
              <GlassButton onClick={addTask} disabled={createMutation.isPending} size="sm" contentClassName="flex items-center gap-2 text-[13px] font-semibold">{createMutation.isPending && <Loader2 size={14} className="animate-spin" />}Create Task</GlassButton>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {filteredTasks.length === 0 && tasks.length === 0 && !isLoading ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex-1 flex flex-col items-center justify-center -mt-10">
            <div className="w-[64px] h-[64px] rounded-2xl bg-[rgba(40,40,40,0.6)] border border-[rgba(80,80,80,0.25)] backdrop-blur-xl flex items-center justify-center mb-4"><ClipboardList size={28} className="text-[#784cfe]" /></div>
            <h3 className="text-white text-[16px] tracking-[-0.3px] mb-1" style={{ fontWeight: 600 }}>No tasks yet</h3>
            <p className="text-[#777] text-[13px] tracking-[-0.2px] mb-5">Create your first task to get started</p>
            <div className="mt-2"><GlassButton onClick={() => setShowForm(true)} size="sm" contentClassName="flex items-center gap-2 text-[12px] tracking-[0.5px] font-semibold"><Plus size={15} />NEW TASK</GlassButton></div>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} className="flex flex-col gap-2">
            {filteredTasks.map((task) => (
              <motion.div key={task._id} variants={itemVariants} layout className="flex items-center gap-4 rounded-xl bg-[rgba(30,30,35,0.7)] border border-[rgba(80,80,80,0.2)] backdrop-blur-xl px-5 py-3.5 hover:border-[rgba(120,76,254,0.3)] transition-all group">
                <button onClick={() => toggleTask(task._id, task.status)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${task.status === 'Done' ? "bg-[#784cfe] border-[#784cfe]" : "border-[rgba(100,100,100,0.5)] hover:border-[#784cfe]"}`}>{task.status === 'Done' && <Check size={12} className="text-white" />}</button>
                <Flag size={13} style={{ color: priorityColors[task.priority] || '#ccc' }} className="shrink-0" />
                <span className={`flex-1 text-[14px] tracking-[-0.3px] transition-all ${task.status === 'Done' ? "text-[#555] line-through" : "text-white"}`}>{task.title}</span>
                <span className="text-[#555] text-[11px] shrink-0">{new Date(task.createdAt || new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <button onClick={() => deleteTask(task._id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-[rgba(255,66,66,0.15)] transition-all cursor-pointer"><Trash2 size={14} className="text-[#ff4242]" /></button>
                <ChevronRight size={14} className="text-[#444] shrink-0" />
              </motion.div>
            ))}
            {filteredTasks.length === 0 && searchQuery && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12"><p className="text-[#666] text-[13px]">No tasks matching "{searchQuery}"</p></motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {tasks.length > 0 && (
        <button onClick={() => setShowForm(true)} className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#784cfe] hover:bg-[#8d66fe] flex items-center justify-center shadow-[0_0_25px_rgba(120,76,254,0.4)] transition-all cursor-pointer hover:scale-110 z-50"><Plus size={22} className="text-white" /></button>
      )}
    </motion.div>
  );
}