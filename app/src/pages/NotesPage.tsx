import { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus,
  Search,
  Archive,
  ChevronRight,
  Clock,
  Trash2,
  BookOpen,
  X,
  Loader2,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/client";
import { toast } from "react-hot-toast";

const TAGS = ["Project Alpha", "Design Systems", "Meeting Notes", "Personal", "Research", "Ideas"];

interface Note {
  _id: string;
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  updatedAt?: string;
  createdAt?: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await api.get("/notes");
      const fetched: Note[] = res.data;
      setNotes(fetched);
      if (fetched.length > 0 && !selectedNoteId) {
        setSelectedNoteId(fetched[0]._id);
        setEditTitle(fetched[0].title);
        setEditContent(fetched[0].content || "");
      }
    } catch (err) {
      toast.error("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  }, [selectedNoteId]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const selectedNote = notes.find((n) => n._id === selectedNoteId) ?? null;

  useEffect(() => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content || "");
    }
  }, [selectedNoteId, selectedNote]);

  const triggerAutoSave = useCallback(
    (title: string, content: string) => {
      if (!selectedNoteId) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          const res = await api.patch(`/notes/${selectedNoteId}`, { title, content });
          setNotes((prev) =>
            prev.map((n) => (n._id === selectedNoteId ? res.data : n))
          );
        } catch {
          // silent fail for auto-save
        }
      }, 1200);
    },
    [selectedNoteId]
  );

  const handleTitleChange = (val: string) => {
    setEditTitle(val);
    triggerAutoSave(val, editContent);
  };

  const handleContentChange = (val: string) => {
    setEditContent(val);
    triggerAutoSave(editTitle, val);
  };

  const handleCommitChanges = async () => {
    if (!selectedNoteId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setIsSaving(true);
    try {
      const res = await api.patch(`/notes/${selectedNoteId}`, {
        title: editTitle,
        content: editContent,
      });
      setNotes((prev) =>
        prev.map((n) => (n._id === selectedNoteId ? res.data : n))
      );
      toast.success("Note saved");
    } catch {
      toast.error("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) return;
    try {
      const res = await api.post("/notes", {
        title: newNoteTitle.trim(),
        content: "",
      });
      const created: Note = res.data;
      setNotes((prev) => [created, ...prev]);
      setSelectedNoteId(created._id);
      setEditTitle(created.title);
      setEditContent("");
      setShowCreateModal(false);
      setNewNoteTitle("");
      toast.success("Note created");
    } catch {
      toast.error("Failed to create note");
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      const remaining = notes.filter((n) => n._id !== id);
      setNotes(remaining);
      if (selectedNoteId === id) {
        const next = remaining[0] ?? null;
        setSelectedNoteId(next?._id ?? null);
        setEditTitle(next?.title ?? "");
        setEditContent(next?.content ?? "");
      }
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCreateModal(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.content || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar: Archive Index */}
      <aside className="w-[340px] md:w-[380px] border-r border-border flex flex-col bg-muted/10">
        <div className="p-6 pb-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Knowledge Base
                </span>
              </div>
              <h1 className="text-2xl font-medium tracking-normal text-foreground">The Archive</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2.5 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-2xl py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {TAGS.slice(0, 4).map((tag) => (
              <button
                key={tag}
                className="px-2.5 py-1 rounded bg-muted/50 border border-transparent text-[10px] font-medium uppercase tracking-normal text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Note list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="text-muted-foreground animate-spin" />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <BookOpen size={24} className="mb-3 opacity-50" />
              <p className="text-xs font-medium uppercase tracking-normal">
                {searchQuery ? "No matches" : "No notes yet"}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div key={note._id} className="relative group/note">
                <button
                  onClick={() => setSelectedNoteId(note._id)}
                  className={`w-full text-left p-4 rounded-xl transition-all relative overflow-hidden ${
                    selectedNoteId === note._id
                      ? "bg-muted border border-border shadow-sm"
                      : "bg-transparent border border-transparent hover:bg-muted/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <h3 className={`text-sm font-medium line-clamp-1 pr-4 ${selectedNoteId === note._id ? 'text-foreground' : 'text-foreground/90'}`}>
                      {note.title || "Untitled Fragment"}
                    </h3>
                  </div>
                  <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                    {note.content || "No content."}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/80 uppercase tracking-normal">
                      <Clock size={10} /> {formatDate(note.updatedAt || note.createdAt)}
                    </div>
                    <ChevronRight
                      size={14}
                      className={`transition-transform ${
                        selectedNoteId === note._id
                          ? "text-foreground translate-x-0.5"
                          : "text-muted-foreground opacity-0 group-hover/note:opacity-100"
                      }`}
                    />
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note._id);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-2xl bg-background border border-border text-muted-foreground opacity-0 group-hover/note:opacity-100 transition-all hover:text-foreground hover:border-border shadow-sm"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main: Editorial Workspace */}
      <main className="flex-1 flex flex-col relative bg-background">
        <AnimatePresence mode="wait">
          {selectedNote ? (
            <motion.div
              key={selectedNote._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col p-8 md:p-12 max-w-4xl mx-auto w-full h-full overflow-y-auto"
            >
              {/* Note Header */}
              <header className="flex items-center justify-between mb-10 border-b border-border pb-6 shrink-0">
                <div className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  <Archive size={14} />
                  <span>Sector: {selectedNote.category || "General"}</span>
                  <span className="opacity-50">•</span>
                  <span>Words: {(editContent || "").split(/\s+/).filter(Boolean).length}</span>
                </div>
                <div className="flex items-center gap-3">
                  {isSaving && <Loader2 size={14} className="text-muted-foreground animate-spin" />}
                  <button
                    onClick={handleCommitChanges}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
                  >
                    <Save size={14} />
                    Commit
                  </button>
                </div>
              </header>

              <div className="space-y-4 shrink-0">
                <input
                  value={editTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-transparent text-4xl md:text-5xl font-semibold tracking-normal text-foreground focus:outline-none placeholder:text-muted-foreground/50"
                  placeholder="Note Title"
                />
                {selectedNote.tags && selectedNote.tags.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    {selectedNote.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded bg-muted border border-border text-[10px] font-medium text-foreground uppercase tracking-normal"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 flex-1 pb-12">
                <textarea
                  value={editContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-full bg-transparent text-base md:text-lg text-foreground/90 leading-relaxed focus:outline-none resize-none placeholder:text-muted-foreground/50"
                  placeholder="Begin writing..."
                />
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-60">
              <BookOpen size={48} className="mb-4 opacity-50" />
              <p className="text-sm font-medium uppercase tracking-widest">
                {notes.length === 0 ? "Create your first note" : "Select a Note"}
              </p>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Note Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-sm rounded-xl bg-card border border-border p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-foreground tracking-normal">New Note</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground transition-all"
                >
                  <X size={16} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Note title..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateNote()}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground text-sm outline-none focus:border-primary transition-all placeholder:text-muted-foreground mb-6"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-transparent text-muted-foreground hover:bg-muted font-medium text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  disabled={!newNoteTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-foreground text-background font-medium text-sm shadow-sm hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus size={14} />
                  Create Note
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

