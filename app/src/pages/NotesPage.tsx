import { useState } from "react";
import { Plus, Search, Pin, FileText, MoreVertical, Trash2, X, Loader2 } from "lucide-react";
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

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt?: string;
}

const tagColors: Record<string, string> = {
  WORK: "#784cfe",
  STRATEGY: "#ffb342",
  MEETING: "#42ff6b",
  CODE: "#784cfe",
  PERSONAL: "#ff4242",
  IDEA: "#ccbaff",
};

export function NotesPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState("");
  const [contextMenu, setContextMenu] = useState<string | null>(null);

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: () => api.get('/notes').then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (newNote: any) => api.post('/notes', newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setNewTitle(""); setNewContent(""); setNewTag(""); setShowForm(false);
      toast.success("Note created");
    },
    onError: () => toast.error("Failed to create note"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => api.put(`/notes/${id}`, updates),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notes'] }); setContextMenu(null); },
    onError: () => toast.error("Failed to update note"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/notes/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notes'] }); setContextMenu(null); toast.success("Note deleted"); },
    onError: () => toast.error("Failed to delete note"),
  });

  const addNote = () => {
    if (!newTitle.trim()) return;
    const tags = newTag.split(",").map(t => t.trim().toUpperCase()).filter(Boolean);
    createMutation.mutate({ title: newTitle.trim(), content: newContent.trim(), tags, pinned: false });
  };

  const togglePin = (id: string, currentPinned: boolean) => updateMutation.mutate({ id, updates: { pinned: !currentPinned } });
  const deleteNote = (id: string) => deleteMutation.mutate(id);

  const filtered = notes.filter((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()));
  const pinned = filtered.filter((n) => n.pinned);
  const unpinned = filtered.filter((n) => !n.pinned);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex-1 flex flex-col px-10 py-6 overflow-y-auto">
      <motion.div variants={itemVariants} className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="bg-gradient-to-b from-[#ccbaff] to-[#784cfe] bg-clip-text text-transparent text-[32px] tracking-[-1.5px]" style={{ fontWeight: 700, lineHeight: 1.2 }}>Notes</h1>
            <p className="text-[#777] text-[13px] tracking-[-0.3px] mt-0.5">Knowledge Base Protocol</p>
          </div>
          {isLoading && <Loader2 size={18} className="text-[#ccbaff] animate-spin ml-2" />}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[rgba(40,40,40,0.6)] border border-[rgba(80,80,80,0.3)] backdrop-blur-xl rounded-lg px-3 py-2 w-[180px] hover:border-[rgba(120,76,254,0.3)] transition-all"><Search size={13} className="text-[#666] shrink-0" /><input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-[#ccc] placeholder-[#555] outline-none w-full text-[12px]" /></div>
          <GlassButton onClick={() => setShowForm(true)} size="sm" contentClassName="flex items-center gap-2 text-[12px] tracking-[0.5px] font-semibold"><Plus size={15} />NEW NOTE</GlassButton>
        </div>
      </motion.div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[480px] rounded-2xl bg-[rgba(25,25,30,0.95)] border border-[rgba(80,80,80,0.3)] backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white text-[18px] tracking-[-0.5px]" style={{ fontWeight: 600 }}>New Note</h3>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-lg bg-[rgba(60,60,60,0.4)] flex items-center justify-center hover:bg-[rgba(80,80,80,0.5)] cursor-pointer transition-colors"><X size={14} className="text-[#999]" /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div><label className="text-[#999] text-[11px] tracking-[0.5px] mb-1.5 block" style={{ fontWeight: 500 }}>TITLE</label><input type="text" placeholder="Note title..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-[rgba(40,40,40,0.6)] border border-[rgba(80,80,80,0.3)] rounded-lg px-4 py-2.5 text-white placeholder-[#555] outline-none text-[13px] focus:border-[#784cfe] transition-colors" autoFocus disabled={createMutation.isPending} /></div>
              <div><label className="text-[#999] text-[11px] tracking-[0.5px] mb-1.5 block" style={{ fontWeight: 500 }}>CONTENT</label><textarea placeholder="Write your note..." value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={5} className="w-full bg-[rgba(40,40,40,0.6)] border border-[rgba(80,80,80,0.3)] rounded-lg px-4 py-2.5 text-white placeholder-[#555] outline-none text-[13px] focus:border-[#784cfe] transition-colors resize-none" disabled={createMutation.isPending} /></div>
              <div><label className="text-[#999] text-[11px] tracking-[0.5px] mb-1.5 block" style={{ fontWeight: 500 }}>TAGS (comma separated)</label><input type="text" placeholder="e.g. work, strategy" value={newTag} onChange={(e) => setNewTag(e.target.value)} className="w-full bg-[rgba(40,40,40,0.6)] border border-[rgba(80,80,80,0.3)] rounded-lg px-4 py-2.5 text-white placeholder-[#555] outline-none text-[13px] focus:border-[#784cfe] transition-colors" disabled={createMutation.isPending} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setNewTitle(""); setNewContent(""); setNewTag(""); }} className="px-5 py-2 rounded-lg bg-[rgba(60,60,60,0.4)] border border-[rgba(80,80,80,0.3)] text-[#999] text-[13px] hover:text-white hover:bg-[rgba(80,80,80,0.4)] transition-all cursor-pointer">Cancel</button>
              <GlassButton onClick={addNote} disabled={createMutation.isPending} size="sm" contentClassName="flex items-center gap-2 text-[13px] font-semibold">{createMutation.isPending && <Loader2 size={14} className="animate-spin" />}Create Note</GlassButton>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {filtered.length === 0 && !isLoading ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex-1 flex flex-col items-center justify-center -mt-10">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(40,40,40,0.6)] border border-[rgba(80,80,80,0.25)] flex items-center justify-center mb-4"><FileText size={28} className="text-[#784cfe]" /></div>
            <h3 className="text-white text-[16px] tracking-[-0.3px] mb-1" style={{ fontWeight: 600 }}>No notes found</h3>
            <p className="text-[#777] text-[13px] mb-5">{searchQuery ? `No notes matching "${searchQuery}"` : "Create your first note to get started"}</p>
            {!searchQuery && (<GlassButton onClick={() => setShowForm(true)} size="sm" contentClassName="flex items-center gap-2 text-[12px] tracking-[0.5px] font-semibold"><Plus size={15} />NEW NOTE</GlassButton>)}
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6">
            {pinned.length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-2 mb-3"><Pin size={12} className="text-[#ffb342]" /><span className="text-[#666] text-[10px] tracking-[1px]" style={{ fontWeight: 700 }}>PINNED NOTES</span></div>
                <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{pinned.map(n => <NoteCard key={n._id} note={n} contextMenu={contextMenu} setContextMenu={setContextMenu} onTogglePin={togglePin} onDelete={deleteNote} />)}</motion.div>
              </motion.div>
            )}
            {unpinned.length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-2 mb-3"><FileText size={12} className="text-[#666]" /><span className="text-[#666] text-[10px] tracking-[1px]" style={{ fontWeight: 700 }}>ALL NOTES</span></div>
                <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{unpinned.map(n => <NoteCard key={n._id} note={n} contextMenu={contextMenu} setContextMenu={setContextMenu} onTogglePin={togglePin} onDelete={deleteNote} />)}</motion.div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {notes.length > 0 && (<div className="fixed bottom-8 right-8 z-50"><GlassButton onClick={() => setShowForm(true)} size="icon" contentClassName="flex items-center justify-center"><Plus size={22} /></GlassButton></div>)}
    </motion.div>
  );
}

function NoteCard({ note, contextMenu, setContextMenu, onTogglePin, onDelete }: { note: Note; contextMenu: string | null; setContextMenu: (id: string | null) => void; onTogglePin: (id: string, p: boolean) => void; onDelete: (id: string) => void; }) {
  return (
    <motion.div variants={itemVariants} layout className="relative rounded-xl bg-[rgba(30,30,35,0.7)] border border-[rgba(80,80,80,0.2)] backdrop-blur-xl p-5 hover:border-[rgba(120,76,254,0.3)] transition-all group flex flex-col min-h-[180px]">
      <div className="flex items-start justify-between mb-3"><h4 className="text-white text-[15px] tracking-[-0.3px] flex-1 pr-2" style={{ fontWeight: 600 }}>{note.title}</h4><button onClick={(e) => { e.stopPropagation(); setContextMenu(contextMenu === note._id ? null : note._id); }} className="w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[rgba(80,80,80,0.3)] transition-all cursor-pointer shrink-0"><MoreVertical size={13} className="text-[#777]" /></button>
        {contextMenu === note._id && (<div className="absolute top-10 right-4 z-50 w-[130px] rounded-lg bg-[rgba(25,25,30,0.97)] border border-[rgba(80,80,80,0.3)] shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden"><button onClick={() => onTogglePin(note._id, note.pinned)} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#ccc] hover:bg-[rgba(120,76,254,0.15)] transition-colors cursor-pointer"><Pin size={12} />{note.pinned ? "Unpin" : "Pin"}</button><button onClick={() => onDelete(note._id)} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#ff4242] hover:bg-[rgba(255,66,66,0.1)] transition-colors cursor-pointer"><Trash2 size={12} />Delete</button></div>)}
      </div>
      <p className="text-[#888] text-[12px] tracking-[-0.2px] flex-1 overflow-hidden" style={{ lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical" }}>{note.content}</p>
      {note.tags && note.tags.length > 0 && (<div className="flex flex-wrap gap-1.5 mt-4">{note.tags.map(t => <span key={t} className="px-2 py-0.5 rounded text-[9px] tracking-[0.5px]" style={{ fontWeight: 600, color: tagColors[t] || "#784cfe", backgroundColor: `${tagColors[t] || "#784cfe"}20` }}>{t}</span>)}</div>)}
    </motion.div>
  );
}