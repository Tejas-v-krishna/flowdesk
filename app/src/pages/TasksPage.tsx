import { useState, useEffect } from "react";
import {
  Plus,
  ClipboardList,
  Search,
  Trash2,
  Check,
  Flag,
  Loader2,
  X,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
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
  High: "text-red-500",
  Urgent: "text-red-600",
  Medium: "text-foreground",
  Low: "text-green-500",
};



type PriorityFilter = "All" | "High" | "Medium" | "Low";
type StatusFilter = "All" | "Todo" | "Done";

export function TasksPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => api.get("/tasks").then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (newTask: any) => api.post("/tasks", newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setNewTitle("");
      setShowForm(false);
      toast.success("Task created");
    },
    onError: () => toast.error("Failed to create task"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      api.patch(`/tasks/${id}`, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    onError: () => toast.error("Failed to update task"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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

  // ── Escape to close modal ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showForm) {
        setShowForm(false);
        setNewTitle("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showForm]);

  // ── Filtering ───────────────────────────────────────────────────────────
  const filteredTasks = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPriority = priorityFilter === "All" || t.priority === priorityFilter;
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Done" ? t.status === "Done" : t.status !== "Done");
    return matchSearch && matchPriority && matchStatus;
  });

  const activeCount = tasks.filter((t) => t.status !== "Done").length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex-1 flex flex-col p-6 md:p-8 max-w-5xl mx-auto w-full"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-medium text-foreground tracking-normal">
              Tasks
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Tracking {activeCount} active work items
            </p>
          </div>
          {isLoading && <Loader2 size={18} className="text-muted-foreground animate-spin ml-2" />}
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-xl px-3 py-2 flex-1 md:w-[220px]">
            <Search size={14} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-foreground placeholder-muted-foreground outline-none w-full text-sm"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-foreground/90 shrink-0"
          >
            <Plus size={16} />
            New Task
          </button>
        </div>
      </motion.div>

      {/* Filter Pills */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-normal">Priority:</span>
        {(["All", "High", "Medium", "Low"] as PriorityFilter[]).map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`px-3 py-1 rounded border text-[12px] transition-colors ${
              priorityFilter === p
                ? "bg-muted border-border text-foreground"
                : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {p}
          </button>
        ))}
        
        <div className="w-px h-4 bg-border mx-2" />
        
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-normal">Status:</span>
        {(["All", "Todo", "Done"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded border text-[12px] transition-colors ${
              statusFilter === s
                ? "bg-muted border-border text-foreground"
                : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {s}
          </button>
        ))}
        
        {(priorityFilter !== "All" || statusFilter !== "All" || searchQuery) && (
          <button
            onClick={() => {
              setPriorityFilter("All");
              setStatusFilter("All");
              setSearchQuery("");
            }}
            className="ml-auto flex items-center gap-1 px-3 py-1 rounded text-[12px] text-foreground hover:bg-muted transition-colors"
          >
            <X size={12} /> Clear
          </button>
        )}
      </motion.div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowForm(false);
                setNewTitle("");
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-foreground">
                  Create New Task
                </h3>
                <button
                  onClick={() => { setShowForm(false); setNewTitle(""); }}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-normal">
                    Task Name
                  </label>
                  <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground placeholder-muted-foreground outline-none text-sm focus:border-primary transition-colors"
                    autoFocus
                    disabled={createMutation.isPending}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-normal">
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {(["Low", "Medium", "High"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setNewPriority(p)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors border ${
                          newPriority === p
                            ? "border-border bg-muted text-foreground"
                            : "border-transparent bg-background text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => { setShowForm(false); setNewTitle(""); }}
                  className="px-4 py-2 rounded-xl bg-transparent text-muted-foreground hover:bg-muted transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  disabled={createMutation.isPending || !newTitle.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {createMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                  Create Task
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <AnimatePresence mode="wait">
        {filteredTasks.length === 0 && tasks.length === 0 && !isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 rounded-xl bg-muted border border-border flex items-center justify-center mb-4 text-muted-foreground">
              <ClipboardList size={32} />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              No tasks yet
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first task to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium transition-colors hover:bg-foreground/90"
            >
              <Plus size={16} />
              New Task
            </button>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} className="flex flex-col gap-3 pb-24">
            {filteredTasks.map((task) => (
              <motion.div
                key={task._id}
                variants={itemVariants}
                layout
                className="flex items-center gap-4 rounded-2xl bg-card border border-border px-5 py-4 hover:border-muted-foreground/30 transition-all group shadow-sm"
              >
                <button
                  onClick={() => toggleTask(task._id, task.status)}
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors border ${
                    task.status === "Done"
                      ? "bg-foreground border-foreground text-background"
                      : "bg-transparent border-border hover:border-foreground"
                  }`}
                >
                  {task.status === "Done" && <Check size={12} />}
                </button>
                <Flag
                  size={14}
                  className={`shrink-0 ${priorityColors[task.priority] || "text-muted-foreground"}`}
                />
                <span
                  className={`flex-1 text-sm transition-colors ${
                    task.status === "Done" ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {task.title}
                </span>
                <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                  {new Date(task.createdAt || new Date()).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded hover:bg-muted text-foreground transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
            
            {filteredTasks.length === 0 && tasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-sm text-muted-foreground">No tasks match your current filters</p>
                <button
                  onClick={() => {
                    setPriorityFilter("All");
                    setStatusFilter("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-sm font-medium text-foreground hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB (Mobile Only) */}
      {tasks.length > 0 && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 md:hidden w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg transition-transform active:scale-95 z-50"
        >
          <Plus size={24} />
        </button>
      )}
    </motion.div>
  );
}

