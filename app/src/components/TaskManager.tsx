import { useState } from "react";
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
    Medium: "#ccbaff",
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
          <h3 className="text-foreground text-[16px] font-semibold tracking-tight">
            Task Manager
          </h3>
          {isLoading && <Loader2 size={14} className="text-primary animate-spin" />}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus size={16} />
          <span className="text-[13px] font-semibold tracking-tight">
            Add Task
          </span>
        </button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <div className="mb-4 p-4 rounded-2xl bg-[rgba(46,29,97,0.3)] border border-[rgba(204,186,255,0.2)] backdrop-blur-xl">
          <input
            type="text"
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="w-full bg-[rgba(3,0,12,0.4)] border border-[rgba(159,159,159,0.15)] rounded-xl px-4 py-2.5 text-[#ccbaff] placeholder-[#ccbaff]/40 outline-none text-[13px] mb-3 focus:border-[rgba(204,186,255,0.4)] transition-colors"
            autoFocus
            disabled={createMutation.isPending}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(["Low", "Medium", "High"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setNewTaskPriority(p)}
                  className={`px-3 py-1 rounded-full text-[11px] capitalize transition-all cursor-pointer ${newTaskPriority === p
                    ? "bg-[rgba(120,76,254,0.4)] border border-[rgba(204,186,255,0.4)]"
                    : "bg-[rgba(107,107,107,0.2)] border border-transparent hover:border-[rgba(159,159,159,0.2)]"
                    }`}
                  style={{ color: priorityColors[p] }}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-full bg-[rgba(107,107,107,0.2)] hover:bg-[rgba(255,66,66,0.2)] transition-colors cursor-pointer"
              >
                <X size={14} className="text-[#ccbaff]" />
              </button>
              <button
                onClick={addTask}
                disabled={createMutation.isPending}
                className="p-1.5 rounded-full bg-[rgba(120,76,254,0.4)] hover:bg-[rgba(120,76,254,0.6)] transition-colors cursor-pointer"
              >
                {createMutation.isPending ? <Loader2 size={14} className="animate-spin text-[#ccbaff]" /> : <Check size={14} className="text-[#ccbaff]" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task List or Empty State */}
      {tasks.length === 0 && !isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 opacity-60">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <ClipboardList size={24} className="text-muted-foreground/30" />
          </div>
          <p className="text-foreground font-bold text-[15px] tracking-tight">Focus on what matters</p>
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
                <div
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all group"
                >
                  <button
                    onClick={() => toggleStatus(task._id, task.status)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${task.status === "Done"
                      ? "bg-[#42ff6b]/30 border-[#42ff6b]"
                      : task.status === "In Progress"
                        ? "bg-[#784cfe]/30 border-[#784cfe]"
                        : "border-[rgba(204,186,255,0.3)] hover:border-[#784cfe]"
                      }`}
                  >
                    {task.status === "Done" && <Check size={10} className="text-[#42ff6b]" />}
                    {task.status === "In Progress" && (
                      <div className="w-2 h-2 rounded-full bg-[#784cfe]" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-[14px] font-medium tracking-tight ${task.status === "Done" ? "text-muted-foreground/40 line-through" : "text-foreground"
                        }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          color: priorityColors[task.priority] || '#ccbaff',
                          backgroundColor: `${priorityColors[task.priority] || '#ccbaff'}15`,
                        }}
                      >
                        {task.priority || 'Medium'}
                      </span>
                      <span className="text-[10px] text-[#ccbaff]/40">{statusLabels[task.status] || task.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-[rgba(255,66,66,0.2)] transition-all cursor-pointer"
                  >
                    <Trash2 size={12} className="text-[#ff4242]" />
                  </button>
                </div>
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