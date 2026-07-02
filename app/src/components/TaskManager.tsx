import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ClipboardList, X, Check, Trash2, Loader2 } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { toast } from "react-hot-toast";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuLabel,
} from "./ui/context-menu";
import { CalendarDays, Archive, Edit, Trash } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
}

export function TaskManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"Low" | "Medium" | "High">("Medium");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks').then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (newTask: any) => api.post('/tasks', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setNewTaskTitle("");
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
    if (!newTaskTitle.trim()) return;
    createMutation.mutate({
      title: newTaskTitle.trim(),
      status: "Todo",
      priority: newTaskPriority,
    });
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Todo" ? "In Progress" : currentStatus === "In Progress" ? "Done" : "Todo";
    updateMutation.mutate({ id, updates: { status: nextStatus } });
  };

  const deleteTask = (id: string) => {
    deleteMutation.mutate(id);
  };

  const priorityColors: Record<string, string> = {
    Low: "#42ff6b",
    Medium: "#ffffff",
    High: "#ff4242",
    Urgent: "#ff0000",
  };

  const statusLabels: Record<string, string> = {
    Todo: "To Do",
    "In Progress": "In Progress",
    Done: "Done",
    Backlog: "Backlog"
  };

  return (
    <GlassPanel
      className="p-6 flex flex-col h-full min-h-[400px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-foreground text-[16px] font-semibold tracking-normal">
            Task Manager
          </h3>
          {isLoading && <Loader2 size={14} className="text-primary animate-spin" />}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus size={16} />
          <span className="text-[13px] font-semibold tracking-normal">
            Add Task
          </span>
        </button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-2xl bg-card border border-border/50 shadow-lg backdrop-blur-xl"
        >
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="w-full bg-muted/30 border border-border/30 rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/50 outline-none text-[14px] mb-4 focus:border-primary/50 transition-all focus:ring-1 focus:ring-primary/20"
            autoFocus
            disabled={createMutation.isPending}
          />
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              {(["Low", "Medium", "High"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setNewTaskPriority(p)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all cursor-pointer border ${newTaskPriority === p
                    ? "bg-primary/20 border-primary shadow-sm"
                    : "bg-muted/50 border-transparent hover:border-border text-muted-foreground"
                    }`}
                  style={{ color: newTaskPriority === p ? undefined : priorityColors[p] }}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-full bg-muted/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all cursor-pointer border border-transparent hover:border-destructive/20"
              >
                <X size={16} />
              </button>
              <button
                onClick={addTask}
                disabled={createMutation.isPending}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <>
                  <Check size={16} />
                  <span className="text-[12px] font-bold">CREATE</span>
                </>}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Task List or Empty State */}
      {tasks.length === 0 && !isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 opacity-60">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <ClipboardList size={24} className="text-muted-foreground/30" />
          </div>
          <p className="text-foreground font-bold text-[15px] tracking-normal">Focus on what matters</p>
          <p className="text-muted-foreground text-[12px] mt-1 text-center max-w-[200px]">Add a task to start tracking your daily progress.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 px-5 py-2 rounded-xl bg-muted border border-border hover:bg-muted/80 text-foreground transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus size={14} />
            <span className="text-[13px] font-semibold">Add First Task</span>
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
          {tasks.map((task) => (
            <ContextMenu key={task._id}>
              <ContextMenuTrigger>
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/40 hover:bg-muted/40 transition-all group"
                >
                  <button
                    onClick={() => toggleStatus(task._id, task.status)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${task.status === "Done"
                      ? "bg-muted border-border"
                      : task.status === "In Progress"
                        ? "bg-primary/20 border-primary"
                        : "border-border/60 hover:border-primary"
                      }`}
                  >
                    {task.status === "Done" && <Check size={12} className="text-green-500" />}
                    {task.status === "In Progress" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-[15px] font-semibold tracking-normal block truncate ${task.status === "Done" ? "text-muted-foreground/50 line-through" : "text-foreground"
                        }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-normal"
                        style={{
                          color: task.priority === 'High' ? '#000000' : task.priority === 'Medium' ? 'var(--primary)' : '#000000',
                          backgroundColor: task.priority === 'High' ? '#00000015' : task.priority === 'Medium' ? 'var(--primary)15' : '#00000015',
                        }}
                      >
                        {task.priority?.toUpperCase() || 'MEDIUM'}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-normaler">{statusLabels[task.status] || task.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-destructive/5 hover:bg-destructive/10 transition-all cursor-pointer"
                  >
                    <Trash2 size={14} className="text-destructive" />
                  </button>
                </motion.div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuLabel>Task Actions</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => toast.success("Edit mode coming soon!")}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Task
                </ContextMenuItem>
                <ContextMenuItem onClick={() => toast.success("Added to Calendar!")}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Add to Calendar
                </ContextMenuItem>
                <ContextMenuItem onClick={() => updateMutation.mutate({ id: task._id, updates: { status: 'Archived' } })}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive Task
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onClick={() => deleteTask(task._id)}
                  className="text-[#ff4242] focus:text-[#ff4242] focus:bg-[#ff4242]/10"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Task
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      )}
    </GlassPanel>
  );
}
