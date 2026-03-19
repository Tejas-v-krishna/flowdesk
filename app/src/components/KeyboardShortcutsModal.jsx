import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const shortcuts = [
    { keys: ['ctrl', 'K'], description: 'Command Palette' },
    { keys: ['ctrl', 'N'], description: 'New Task' },
    { keys: ['ctrl', 'P'], description: 'New Project' },
    { keys: ['ctrl', 'J'], description: 'AI Assistant' },
    { keys: ['ctrl', 'F'], description: 'Focus Mode' },
    { keys: ['ctrl', 'B'], description: 'Toggle Sidebar' },
    { keys: ['Esc'], description: 'Close Modal / Overlay' },
    { keys: ['ctrl', '/'], description: 'Keyboard Shortcuts' },
]

export default function KeyboardShortcutsModal({ open, onClose }) {
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose()
            if ((e.metaKey || e.ctrlKey) && e.key === '/') {
                e.preventDefault()
                onClose()
            }
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [onClose])

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">Keyboard Shortcuts</h2>
                            <button onClick={onClose} className="text-neutral-600 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {shortcuts.map((shortcut, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
                                    <span className="text-sm text-neutral-300">{shortcut.description}</span>
                                    <div className="flex items-center gap-1">
                                        {shortcut.keys.map((key, j) => (
                                            <kbd key={j} className="px-2 py-1 text-[10px] font-mono bg-white/5 border border-white/10 rounded-lg text-neutral-300 shadow-inner">
                                                {key}
                                            </kbd>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
