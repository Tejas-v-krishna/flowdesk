"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
// @ts-ignore
import { cn } from "../../utils/cn";
import {
    ImageIcon,
    Figma,
    MonitorIcon,
    Paperclip,
    SendIcon,
    XIcon,
    LoaderIcon,
    Sparkles,
    Command,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react"
import axios from "axios";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
    icon: React.ReactNode;
    label: string;
    description: string;
    prefix: string;
}

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    containerClassName?: string;
    showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, containerClassName, showRing = true, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);

        return (
            <div className={cn(
                "relative",
                containerClassName
            )}>
                <textarea
                    className={cn(
                        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                        "transition-all duration-200 ease-in-out",
                        "placeholder:text-muted-foreground",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
                        className
                    )}
                    ref={ref}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {showRing && isFocused && (
                    <motion.span
                        className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}

                {props.onChange && (
                    <div
                        className="absolute bottom-2 right-2 opacity-0 w-2 h-2 bg-violet-500 rounded-full"
                        style={{
                            animation: 'none',
                        }}
                        id="textarea-ripple"
                    />
                )}
            </div>
        )
    }
)
Textarea.displayName = "Textarea"

export function AnimatedAIChat() {
    const [value, setValue] = useState("");
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });
    const [inputFocused, setInputFocused] = useState(false);
    const commandPaletteRef = useRef<HTMLDivElement>(null);

    const commandSuggestions: CommandSuggestion[] = [
        {
            icon: <MonitorIcon className="w-4 h-4" />,
            label: "Project Status",
            description: "Get a summary of all active projects",
            prefix: "/projects"
        },
        {
            icon: <Sparkles className="w-4 h-4" />,
            label: "Priority Tasks",
            description: "Identify high-priority items for today",
            prefix: "/tasks"
        },
        {
            icon: <ImageIcon className="w-4 h-4" />,
            label: "Visual Report",
            description: "Generate an analytics overview",
            prefix: "/report"
        },
        {
            icon: <Figma className="w-4 h-4" />,
            label: "Sync Figma",
            description: "Sync assets from linked design files",
            prefix: "/sync"
        },
    ];

    useEffect(() => {
        if (value.startsWith('/') && !value.includes(' ')) {
            setShowCommandPalette(true);

            const matchingSuggestionIndex = commandSuggestions.findIndex(
                (cmd) => cmd.prefix.startsWith(value)
            );

            if (matchingSuggestionIndex >= 0) {
                setActiveSuggestion(matchingSuggestionIndex);
            } else {
                setActiveSuggestion(-1);
            }
        } else {
            setShowCommandPalette(false);
        }
    }, [value]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const commandButton = document.querySelector('[data-command-button]');

            if (commandPaletteRef.current &&
                !commandPaletteRef.current.contains(target) &&
                !commandButton?.contains(target)) {
                setShowCommandPalette(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (showCommandPalette) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestion(prev =>
                    prev < commandSuggestions.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestion(prev =>
                    prev > 0 ? prev - 1 : commandSuggestions.length - 1
                );
            } else if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestion >= 0) {
                    const selectedCommand = commandSuggestions[activeSuggestion];
                    setValue(selectedCommand.prefix + ' ');
                    setShowCommandPalette(false);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowCommandPalette(false);
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                handleSendMessage();
            }
        }
    };

    const handleSendMessage = () => {
        if (value.trim()) {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setValue("");
                adjustHeight(true);
            }, 3000);
        }
    };

    const handleAttachFile = async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = 'image/*,application/pdf';

        fileInput.addEventListener('change', async (e) => {
            const target = e.target as HTMLInputElement;
            const files = target.files;
            if (!files) return;

            for (const file of files) {
                await uploadFile(file);
            }
        });

        fileInput.click();
    };

    const uploadFile = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/files/upload', formData);
            setAttachments((prev) => [...prev, response.data.fileName]);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const selectCommandSuggestion = (index: number) => {
        const selectedCommand = commandSuggestions[index];
        setValue(selectedCommand.prefix + ' ');
        setShowCommandPalette(false);
    };

    return (
        <div className="min-h-screen flex flex-col w-full items-center justify-center bg-transparent text-white p-6 relative overflow-hidden">
            {/* Liquid Glass Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full mix-blend-plus-lighter filter blur-[120px] animate-pulse"
                    style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full mix-blend-plus-lighter filter blur-[120px] animate-pulse"
                    style={{ animationDuration: '10s', animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#784cfe]/10 rounded-full mix-blend-screen filter blur-[140px] animate-[pulse_12s_ease-in-out_infinite]" />
            </div>

            <div className="w-full max-w-2xl mx-auto relative">
                <motion.div
                    className="relative z-10 space-y-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="text-center space-y-3">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-block"
                        >
                            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-[#ccbaff] pb-1">
                                How can I help today?
                            </h1>
                            <motion.div
                                className="h-px bg-gradient-to-r from-transparent via-[#784cfe]/40 to-transparent"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "100%", opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </motion.div>
                        <motion.p
                            className="text-sm text-white/40 font-medium tracking-wide uppercase"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            DIRECTOR PROTOCOL ACTIVE
                        </motion.p>
                    </div>

                    <motion.div
                        className="relative backdrop-blur-[40px] bg-white/[0.03] rounded-3xl border border-white/[0.1] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Liquid Reflection Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

                        <AnimatePresence>
                            {showCommandPalette && (
                                <motion.div
                                    ref={commandPaletteRef}
                                    className="absolute left-4 right-4 bottom-full mb-3 backdrop-blur-[30px] bg-black/80 rounded-2xl z-50 shadow-2xl border border-white/10 overflow-hidden"
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <div className="py-2">
                                        {commandSuggestions.map((suggestion, index) => (
                                            <motion.div
                                                key={suggestion.prefix}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 cursor-pointer mx-2 rounded-xl",
                                                    activeSuggestion === index
                                                        ? "bg-[#784cfe]/20 text-white border border-[#784cfe]/30 shadow-[0_0_15px_rgba(120,76,254,0.2)]"
                                                        : "text-white/60 hover:bg-white/5"
                                                )}
                                                onClick={() => selectCommandSuggestion(index)}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
                                                    activeSuggestion === index ? "bg-[#784cfe]/40 text-white" : "bg-white/5 text-white/40"
                                                )}>
                                                    {suggestion.icon}
                                                </div>
                                                <div className="flex-1 font-medium tracking-tight">
                                                    {suggestion.label}
                                                    <p className="text-[10px] text-white/30 font-normal">{suggestion.description}</p>
                                                </div>
                                                <div className="text-[#ccbaff]/50 text-xs font-mono">
                                                    {suggestion.prefix}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-1">
                            <Textarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    adjustHeight();
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                placeholder="Initialize Director protocol..."
                                containerClassName="w-full"
                                className={cn(
                                    "w-full px-6 py-5",
                                    "resize-none",
                                    "bg-transparent",
                                    "border-none",
                                    "text-white text-base leading-relaxed",
                                    "focus:outline-none",
                                    "placeholder:text-white/20 placeholder:font-medium",
                                    "min-h-[100px]"
                                )}
                                style={{
                                    overflow: "hidden",
                                }}
                                showRing={false}
                            />
                        </div>

                        <AnimatePresence>
                            {attachments.length > 0 && (
                                <motion.div
                                    className="px-6 pb-4 flex gap-2 flex-wrap"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    {attachments.map((file, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center gap-2 text-xs bg-[#784cfe]/10 border border-[#784cfe]/20 py-2 px-4 rounded-full text-[#ccbaff]/90 backdrop-blur-md"
                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                        >
                                            <Paperclip className="w-3 h-3 text-[#784cfe]" />
                                            <span className="font-medium tracking-tight">{file}</span>
                                            <button
                                                onClick={() => removeAttachment(index)}
                                                className="ml-1 p-0.5 rounded-full hover:bg-white/10 text-white/30 hover:text-white transition-colors"
                                            >
                                                <XIcon className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.05] flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <motion.button
                                    type="button"
                                    onClick={handleAttachFile}
                                    whileTap={{ scale: 0.94 }}
                                    className="p-2.5 text-white/40 hover:text-[#784cfe] hover:bg-[#784cfe]/10 rounded-xl transition-all relative group"
                                >
                                    <Paperclip className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    type="button"
                                    data-command-button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCommandPalette(prev => !prev);
                                    }}
                                    whileTap={{ scale: 0.94 }}
                                    className={cn(
                                        "p-2.5 text-white/40 hover:text-[#784cfe] hover:bg-[#784cfe]/10 rounded-xl transition-all relative group",
                                        showCommandPalette && "bg-[#784cfe]/20 text-[#784cfe]"
                                    )}
                                >
                                    <Command className="w-5 h-5" />
                                </motion.button>
                            </div>

                            <motion.button
                                type="button"
                                onClick={handleSendMessage}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                disabled={isTyping || !value.trim()}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                                    "flex items-center gap-2.5",
                                    value.trim()
                                        ? "bg-gradient-to-r from-[#784cfe] to-[#ccbaff] text-white shadow-[0_10px_20px_-5px_rgba(120,76,254,0.4)]"
                                        : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                                )}
                            >
                                {isTyping ? (
                                    <LoaderIcon className="w-4 h-4 animate-[spin_3s_linear_infinite]" />
                                ) : (
                                    <SendIcon className="w-4 h-4" />
                                )}
                                <span className="tracking-tight lowercase">EXECUTE</span>
                            </motion.button>
                        </div>
                    </motion.div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {commandSuggestions.map((suggestion, index) => (
                            <motion.button
                                key={suggestion.prefix}
                                onClick={() => selectCommandSuggestion(index)}
                                className="flex items-center gap-2.5 px-5 py-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl text-[13px] font-medium text-white/50 hover:text-white border border-white/[0.05] hover:border-[#784cfe]/30 transition-all active:scale-95 group"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <span className="text-[#784cfe]/80 group-hover:text-[#784cfe] transition-colors">{suggestion.icon}</span>
                                <span>{suggestion.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {isTyping && (
                    <motion.div
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 backdrop-blur-3xl bg-black/60 rounded-2xl px-6 py-3 shadow-2xl border border-white/10 z-[100]"
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.9 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#784cfe] to-[#ccbaff] flex items-center justify-center shadow-[0_0_15px_rgba(120,76,254,0.3)]">
                                <span className="text-[10px] font-black text-white tracking-tighter">AI</span>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white tracking-tight">DIRECTOR</span>
                                    <TypingDots />
                                </div>
                                <span className="text-[10px] text-white/30 font-bold tracking-[1px] uppercase">Analyzing workspace context...</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {inputFocused && (
                <motion.div
                    className="fixed w-[60rem] h-[60rem] rounded-full pointer-events-none z-0 opacity-10 bg-gradient-to-r from-violet-600/20 via-[#784cfe]/20 to-indigo-600/20 blur-[120px]"
                    animate={{
                        x: mousePosition.x - 480,
                        y: mousePosition.y - 480,
                    }}
                    transition={{
                        type: "spring",
                        damping: 40,
                        stiffness: 120,
                        mass: 0.8,
                    }}
                />
            )}
        </div>
    );
}

function TypingDots() {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 bg-[#784cfe] rounded-full"
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                        boxShadow: ["0 0 0px #784cfe", "0 0 8px #784cfe", "0 0 0px #784cfe"]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: dot * 0.2,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
