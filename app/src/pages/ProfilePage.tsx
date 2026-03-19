import { useState } from "react";
import {
    User, Mail, Calendar, Palette, PenTool, TrendingUp, Shield, Activity,
    Settings, Bot, ChevronLeft, Plus, MoreHorizontal, FileText, CheckCircle2,
    Clock, Phone, Cake, Home, Tag, ExternalLink, Briefcase, PlusCircle,
    File, Video, Music, MapPin, Briefcase as BriefcaseIcon, Globe,
    CheckSquare, FileSpreadsheet, LayoutDashboard, Plus as PlusIcon, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { GlassPanel } from "../components/GlassPanel";
import { GlassButton } from "../components/ui/glass-button";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const tabs = ["Overview", "Tasks", "Appointments", "Billing", "Notes", "Documents", "Files"];

export function ProfilePage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Overview");
    const [isActionsOpen, setIsActionsOpen] = useState(false);

    const accentColor = user?.preferences?.accentColor || "#784cfe";

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex-1 flex gap-8 px-8 py-6 max-w-[1400px] mx-auto w-full min-h-screen text-white/90"
        >
            {/* Left Column - Profile Sidebar */}
            <div className="w-[350px] flex flex-col gap-6">
                <GlassPanel blur={40} className="p-8 border-[rgba(255,255,255,0.05)] bg-[#08080a]/60">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[#ccbaff]/50 hover:text-[#ccbaff] transition-all mb-8 text-sm group"
                    >
                        <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                        Clients list
                    </button>

                    <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#784cfe]/20 to-[#ccbaff]/20 border border-[rgba(204,186,255,0.1)] overflow-hidden" style={{ backgroundImage: `linear-gradient(to bottom right, ${accentColor}33, #ccbaff33)` }}>
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop"
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-[#42ff6b] border-4 border-[#08080a] shadow-lg" />
                    </div>

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                                {user?.name || "Dianne Russell"}
                            </h1>
                            <p className="text-[13px] text-[#ccbaff]/40">Senior UX Designer</p>
                        </div>
                        <button className="p-1.5 rounded-lg border border-[rgba(204,186,255,0.1)] text-[#ccbaff]/40 hover:text-white transition-all">
                            <PenTool size={16} />
                        </button>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[11px] font-bold text-[#ccbaff]/40 uppercase tracking-widest">Client details</h3>
                            <PenTool size={12} className="text-[#ccbaff]/20" />
                        </div>

                        <div className="space-y-4">
                            <DetailItem icon={Mail} label="Email" value={user?.email || "d.russell@gmail.com"} color={accentColor} />
                            <DetailItem icon={Phone} label="Phone number" value="(229) 555-0109" color={accentColor} />
                            <DetailItem icon={Cake} label="Date of birth" value="12/03/1987" color={accentColor} />
                            <DetailItem icon={MapPin} label="Home address" value="6301 Elgin St. Celina, Delaware..." color={accentColor} />
                            <DetailItem icon={Shield} label="Insurance" value="Yes" color={accentColor} />
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className="mt-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[11px] font-bold text-[#ccbaff]/40 uppercase tracking-widest">Tags</h3>
                            <Plus size={16} style={{ color: accentColor }} className="cursor-pointer" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <TagItem label="Personal" active color={accentColor} />
                            <TagItem label="Company client" color={accentColor} />
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="mt-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[11px] font-bold text-[#ccbaff]/40 uppercase tracking-widest">Notes</h3>
                            <Plus size={16} style={{ color: accentColor }} className="cursor-pointer" />
                        </div>
                        <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(204,186,255,0.05)] text-[12px] text-[#ccbaff]/60 leading-relaxed italic">
                            "Client may provide additional documents as test results, MRI, x-ray results. Please, attach them to the client's profile."
                            <div className="mt-3 flex items-center justify-between not-italic">
                                <span className="text-[10px]" style={{ color: accentColor }}>Leslie Alexander</span>
                                <span className="text-[10px] text-[#ccbaff]/30">15 Apr, 2022</span>
                            </div>
                        </div>
                    </div>
                </GlassPanel>
            </div>

            {/* Right Column - Main Board */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Navigation Tabs */}
                <GlassPanel blur={20} className="p-1 px-1.5 flex gap-1 border-[rgba(255,255,255,0.05)] bg-[#08080a]/40 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-[13px] font-medium transition-all relative ${activeTab === tab ? "text-white" : "text-[#ccbaff]/40 hover:text-[#ccbaff]/60"
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-xl"
                                    style={{ backgroundColor: `${accentColor}1a`, border: `1px solid ${accentColor}4d` }}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {tab}
                        </button>
                    ))}
                </GlassPanel>

                <div className="grid grid-cols-2 gap-6">
                    {/* Latest Tasks Widget */}
                    <GlassPanel className="p-8 border-[rgba(255,255,255,0.05)] bg-[#08080a]/60">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white">Latest tasks</h2>
                            <button className="text-[13px] font-medium hover:underline" style={{ color: accentColor }}>Show all</button>
                        </div>
                        <div className="space-y-3">
                            <TaskItem label="Contact client for outstanding invoices (Monthly)" date="Mon, 16 Aug" status="overdue" color={accentColor} />
                            <TaskItem label="Share consultation forms before the next appointment" date="Tue, 25 Aug" status="pending" color={accentColor} />
                            <TaskItem label="Schedule next personal consultation" date="Wed, 26 Aug" status="pending" color={accentColor} />
                        </div>
                    </GlassPanel>

                    {/* Activity Widget */}
                    <GlassPanel className="p-8 border-[rgba(255,255,255,0.05)] bg-[#08080a]/60 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                Latest activity <TrendingUp size={16} style={{ color: accentColor }} />
                            </h2>
                        </div>
                        <div className="space-y-6 flex-1">
                            <ActivityTimelineItem
                                user="Leslie Alexander"
                                action="added new file"
                                target="Primary questionnaire"
                                time="1 day ago"
                                icon={FileText}
                                color={accentColor}
                            />
                            <ActivityTimelineItem
                                user="Devon Lane"
                                action="updated personal client information"
                                time="3 days ago"
                                icon={User}
                                color={accentColor}
                            />
                            <ActivityTimelineItem
                                user="Marvin McKinney"
                                action="requested an appointment for"
                                target="Personal consultation"
                                time="5 days ago"
                                icon={Calendar}
                                color={accentColor}
                            />
                        </div>
                    </GlassPanel>

                    {/* Pinned Documents Widget */}
                    <div className="col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-white">Pinned documents & files</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <PinnedCard
                                title="Client intake form"
                                subtitle="Submitted on 15 Apr, 2022"
                                icon={FileText}
                                type="blue"
                            />
                            <PinnedCard
                                title="Treatment plan"
                                subtitle="Submitted on 18 Apr, 2022"
                                icon={Briefcase}
                                type="orange"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Menu */}
            <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
                <AnimatePresence>
                    {isActionsOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="mb-4"
                        >
                            <GlassPanel className="p-3 w-[260px] border-[rgba(255,255,255,0.1)] bg-[#08080a]/90 shadow-2xl flex flex-col gap-1">
                                <ActionMenuItem icon={Calendar} label="Book appointment" sublabel="Request appointment with client" color={accentColor} />
                                <ActionMenuItem icon={PenTool} label="Add client field" sublabel="Add client information field" color={accentColor} />
                                <ActionMenuItem icon={FileText} label="Create invoice" sublabel="Create and send invoice to client" color={accentColor} />
                                <ActionMenuItem icon={PlusCircle} label="Add note" sublabel="Create note for you and your team" color={accentColor} />
                                <ActionMenuItem icon={CheckSquare} label="Create task" sublabel="Add a task to this client" color={accentColor} />
                                <ActionMenuItem icon={FileText} label="Upload files" sublabel="Upload files related to this client" color={accentColor} />
                                <ActionMenuItem icon={File} label="Attach documents" sublabel="Add agreements and intake forms" color={accentColor} />
                            </GlassPanel>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsActionsOpen(!isActionsOpen)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl overflow-hidden group`}
                    style={{ backgroundColor: isActionsOpen ? 'white' : accentColor, color: isActionsOpen ? 'black' : 'white' }}
                >
                    {isActionsOpen ? <Plus size={28} className="rotate-45" /> : <Plus size={28} />}
                </button>
            </div>
        </motion.div>
    );
}

function DetailItem({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div
            className="flex items-center justify-between group cursor-default"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-3">
                <div className="text-[#ccbaff]/30 transition-colors" style={{ color: isHovered ? color : undefined }}>
                    <Icon size={16} />
                </div>
                <span className="text-[13px] text-[#ccbaff]/50 font-medium">{label}</span>
            </div>
            <span className="text-[13px] text-white text-right max-w-[180px] break-words">{value}</span>
        </div>
    );
}

function TagItem({ label, active = false, color }: { label: string; active?: boolean; color: string }) {
    return (
        <button className={`px-4 py-1.5 rounded-xl text-[12px] font-medium transition-all ${active
                ? "border"
                : "border border-[rgba(204,186,255,0.1)] text-[#ccbaff]/40 hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
            }`}
            style={active ? { backgroundColor: `${color}1a`, borderColor: `${color}4d`, color: color } : {}}
        >
            {label}
        </button>
    );
}

function TaskItem({ label, date, status, color }: { label: string; date: string; status: "overdue" | "pending"; color: string }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div
            className="flex items-center gap-4 p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(204,186,255,0.05)] transition-all group cursor-pointer overflow-hidden relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ borderColor: isHovered ? `${color}4d` : undefined }}
        >
            <div className="absolute top-0 left-0 w-1 h-full opacity-20" style={{ backgroundColor: color }} />
            <div className="w-5 h-5 rounded-full border-2 border-[rgba(204,186,255,0.2)] flex items-center justify-center shrink-0 transition-all"
                style={{ borderColor: isHovered ? color : undefined }}
            >
                <div className="w-2.5 h-2.5 rounded-full transition-all scale-50 group-hover:scale-100"
                    style={{ backgroundColor: color, opacity: isHovered ? 1 : 0, boxShadow: `0 0 8px ${color}` }}
                />
            </div>
            <span className="text-[13px] text-white/80 line-clamp-1 flex-1 font-medium">{label}</span>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${status === "overdue" ? "text-red-400 bg-red-400/10" : "text-[#ccbaff]/40 bg-white/5"
                }`}>
                {date}
            </span>
        </div>
    );
}

function ActivityTimelineItem({ user, action, target, time, icon: Icon, color }: any) {
    return (
        <div className="flex gap-4 relative">
            <div className="absolute left-[9px] top-6 bottom-[-24px] w-[2px] bg-[rgba(204,186,255,0.05)] last:hidden" />
            <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0 z-10 border"
                style={{ backgroundColor: `${color}1a`, borderColor: `${color}33` }}>
                <Icon size={12} style={{ color: color }} />
            </div>
            <div className="flex-1">
                <p className="text-[13px] leading-tight text-[#ccbaff]/80">
                    <span className="text-white font-bold">{user}</span> {action} {target && <span className="font-medium" style={{ color: color }}>{target}</span>}
                </p>
                <span className="text-[11px] text-[#ccbaff]/30 mt-1 block">{time}</span>
            </div>
        </div>
    );
}

function PinnedCard({ title, subtitle, icon: Icon, type }: any) {
    const styles: any = {
        blue: "from-[rgba(66,212,255,0.1)] to-[rgba(120,76,254,0.05)] border-[rgba(66,212,255,0.2)] text-[#42d4ff]",
        orange: "from-[rgba(255,179,66,0.1)] to-[rgba(255,66,66,0.05)] border-[rgba(255,179,66,0.2)] text-[#ffb342]"
    };

    return (
        <div className={`p-6 rounded-3xl bg-gradient-to-br border hover:scale-[1.02] transition-all cursor-pointer group ${styles[type].split(' ').slice(0, 3).join(' ')}`}>
            <Icon size={32} className={`mb-6 opacity-40 group-hover:opacity-100 transition-opacity ${styles[type].split(' ').pop()}`} />
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-[12px] text-[#ccbaff]/40">{subtitle}</p>
        </div>
    );
}

function ActionMenuItem({ icon: Icon, label, sublabel, color }: any) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <button
            className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white/5 transition-all text-left group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#ccbaff]/40 transition-all"
                style={isHovered ? { color: color, backgroundColor: `${color}1a` } : {}}
            >
                <Icon size={16} />
            </div>
            <div>
                <div className="text-[13px] font-bold text-white/90 group-hover:text-white transition-colors">{label}</div>
                <div className="text-[10px] text-[#ccbaff]/30 group-hover:text-[#ccbaff]/50 transition-colors">{sublabel}</div>
            </div>
        </button>
    );
}
