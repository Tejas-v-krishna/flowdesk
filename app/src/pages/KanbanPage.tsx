import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Trello,
  Plus,
  MoreVertical,
  Calendar,
  Filter,
  Loader2,
} from "lucide-react";
import api from "../api/client";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface KanbanTask {
  id: string;
  _id: string;
  content: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  project: string;
  status: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface KanbanData {
  tasks: Record<string, KanbanTask>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

const STATUS_TO_COL: Record<string, string> = {
  Backlog: "col-backlog",
  Todo: "col-todo",
  "In Progress": "col-inprogress",
  Done: "col-done",
};

const COL_TO_STATUS: Record<string, string> = {
  "col-backlog": "Backlog",
  "col-todo": "Todo",
  "col-inprogress": "In Progress",
  "col-done": "Done",
};

const normalizeApiPriority = (p: string): "high" | "medium" | "low" => {
  const map: Record<string, "high" | "medium" | "low"> = {
    High: "high",
    Urgent: "high",
    Medium: "medium",
    Low: "low",
  };
  return map[p] ?? "medium";
};

const buildInitialData = (tasks: any[]): KanbanData => {
  const taskMap: Record<string, KanbanTask> = {};
  const columns: Record<string, Column> = {
    "col-backlog": { id: "col-backlog", title: "Backlog", taskIds: [] },
    "col-todo": { id: "col-todo", title: "To Do", taskIds: [] },
    "col-inprogress": { id: "col-inprogress", title: "In Progress", taskIds: [] },
    "col-done": { id: "col-done", title: "Done", taskIds: [] },
  };

  tasks.forEach((t) => {
    const id = t._id;
    const colId = STATUS_TO_COL[t.status] ?? "col-todo";
    taskMap[id] = {
      id,
      _id: id,
      content: t.title,
      priority: normalizeApiPriority(t.priority),
      dueDate: t.dueDate
        ? new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "No due date",
      project: t.projectId ?? "General",
      status: t.status,
    };
    columns[colId].taskIds.push(id);
  });

  return {
    tasks: taskMap,
    columns,
    columnOrder: ["col-backlog", "col-todo", "col-inprogress", "col-done"],
  };
};

export function KanbanPage() {
  const [data, setData] = useState<KanbanData>({
    tasks: {},
    columns: {
      "col-backlog": { id: "col-backlog", title: "Backlog", taskIds: [] },
      "col-todo": { id: "col-todo", title: "To Do", taskIds: [] },
      "col-inprogress": { id: "col-inprogress", title: "In Progress", taskIds: [] },
      "col-done": { id: "col-done", title: "Done", taskIds: [] },
    },
    columnOrder: ["col-backlog", "col-todo", "col-inprogress", "col-done"],
  });
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks");
        setData(buildInitialData(res.data));
      } catch (err) {
        toast.error("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    let newData: KanbanData;

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = { ...start, taskIds: newTaskIds };
      newData = { ...data, columns: { ...data.columns, [newColumn.id]: newColumn } };
    } else {
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = { ...start, taskIds: startTaskIds };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = { ...finish, taskIds: finishTaskIds };

      newData = {
        ...data,
        tasks: {
          ...data.tasks,
          [draggableId]: {
            ...data.tasks[draggableId],
            status: COL_TO_STATUS[destination.droppableId],
          },
        },
        columns: {
          ...data.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };

      // Sync status change to backend
      try {
        await api.patch(`/tasks/${draggableId}`, {
          status: COL_TO_STATUS[destination.droppableId],
        });
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      } catch {
        toast.error("Failed to update task status");
        return;
      }
    }

    setData(newData);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={24} className="text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-2xl bg-muted text-foreground border border-border">
            <Trello size={20} />
          </div>
          <div>
            <h1 className="text-xl font-medium tracking-normal text-foreground">Tactical Board</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">
                Kanban View
              </span>
              <div className="w-1 h-1 rounded-full bg-border" />
              <span className="text-xs text-muted-foreground">
                {Object.keys(data.tasks).length} Tasks
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-transparent border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
            <Filter size={14} />
            Filter
          </button>
          <button
            onClick={() => toast("Use the Tasks page to create new tasks", { icon: "💡" })}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors"
          >
            <Plus size={14} />
            New Card
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-w-max">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((id) => data.tasks[id]).filter(Boolean);

              return (
                <div key={column.id} className="w-[300px] flex flex-col h-full">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-foreground">
                        {column.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-xl bg-muted text-xs font-medium text-muted-foreground">
                        {tasks.length}
                      </span>
                    </div>
                    <button className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors">
                      <MoreVertical size={14} />
                    </button>
                  </div>

                  {/* Column Body */}
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 min-h-[500px] rounded-xl transition-colors p-2 space-y-3 ${
                          snapshot.isDraggingOver
                            ? "bg-muted/50 border border-border/50"
                            : "bg-transparent"
                        }`}
                      >
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`group p-4 rounded-2xl bg-card border transition-all shadow-sm ${
                                  snapshot.isDragging
                                    ? "border-primary/50 shadow-md rotate-1"
                                    : "border-border hover:border-muted-foreground/30"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-normal border ${
                                      task.priority === "high"
                                        ? "bg-muted border-border text-foreground dark:text-foreground"
                                        : task.priority === "medium"
                                        ? "bg-muted border-orange-500/20 text-foreground dark:text-foreground"
                                        : "bg-muted border-border text-foreground dark:text-foreground"
                                    }`}
                                  >
                                    {task.priority}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {task.project}
                                  </span>
                                </div>
                                <h4 className="text-sm font-medium text-foreground mb-3 leading-snug">
                                  {task.content}
                                </h4>
                                <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
                                  <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar size={12} />
                                    <span className="text-xs">{task.dueDate}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {tasks.length === 0 && !snapshot.isDraggingOver && (
                          <div className="h-20 border border-dashed border-border rounded-2xl flex items-center justify-center opacity-50">
                            <span className="text-xs font-medium text-muted-foreground">
                              Empty
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

