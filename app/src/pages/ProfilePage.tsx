import { useState } from "react";
import {
    User, Shield, Activity, Zap, Cpu, HardDrive, Eye,
    Globe, Database, Fingerprint, Power
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

export default function ProfilePage() {
    const { user } = useAuthStore();
    const { theme, setTheme } = useThemeStore();
    const [activeSection, setActiveSection] = useState("Identity");

    const sections = [
        { id: "Identity", icon: User, label: "My Profile" },
        { id: "Aesthetics", icon: Eye, label: "OS Aesthetics" },
        { id: "Kernel", icon: Cpu, label: "Kernel Settings" },
        { id: "Security", icon: Shield, label: "Vault Security" },
        { id: "Intelligence", icon: Zap, label: "AI Neural Link" },
    ];

    return (
        <div className="flex-1 flex flex-col p-6 md:p-8 gap-8 bg-background min-h-screen overflow-y-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">System Core</span>
                    </div>
                    <h1 className="text-3xl font-medium tracking-normal text-foreground">System Preferences</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-card border border-border flex items-center gap-3 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-muted" />
                        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Kernel v2.4.0-Stable</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
                {/* Sidebar Navigation */}
                <aside className="space-y-1">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all group ${
                                activeSection === section.id 
                                ? "bg-muted text-foreground font-medium border border-border shadow-sm" 
                                : "bg-transparent border border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            }`}
                        >
                            <section.icon size={16} className={activeSection === section.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/70"} />
                            <span className="text-sm tracking-normal">{section.label}</span>
                        </button>
                    ))}
                    <div className="pt-4 mt-4 border-t border-border">
                        <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-foreground dark:text-foreground hover:bg-muted transition-all group font-medium">
                            <Power size={16} />
                            <span className="text-sm tracking-normal uppercase">Terminate Session</span>
                        </button>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="space-y-8 max-w-4xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            {activeSection === "Identity" && (
                                <section className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-8 bg-card border border-border rounded-2xl shadow-sm flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground">
                                                <User size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-foreground">{user?.name || "System User"}</h3>
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-normal mt-1">{user?.email || "user@flowdesk.io"}</p>
                                            </div>
                                        </div>
                                        <div className="p-8 bg-card border border-border rounded-2xl shadow-sm space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-medium uppercase tracking-normal text-muted-foreground">Cognitive Focus Score</span>
                                                <span className="text-xs font-semibold text-foreground">88%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                                                <div className="h-full bg-foreground" style={{ width: '88%' }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <h4 className="text-[10px] font-medium uppercase tracking-normal text-muted-foreground px-2">Operational Metrics</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <MetricItem label="Efficiency" value="High" icon={Activity} />
                                            <MetricItem label="Connectivity" value="Secure" icon={Globe} />
                                            <MetricItem label="Uptime" value="14.2h" icon={HardDrive} />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeSection === "Aesthetics" && (
                                <section className="space-y-6">
                                    <div className="p-8 bg-card border border-border rounded-2xl shadow-sm space-y-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-base font-medium text-foreground">Interface Mode</h3>
                                                <p className="text-sm font-medium text-muted-foreground">Toggle between light and dark OS layers.</p>
                                            </div>
                                            <div className="flex bg-muted p-1 rounded-xl border border-border shrink-0">
                                                <button 
                                                    onClick={() => setTheme("dark")}
                                                    className={`px-4 py-2 rounded-2xl text-[11px] font-medium uppercase tracking-normal transition-all ${theme === 'dark' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                                >
                                                    Obsidian
                                                </button>
                                                <button 
                                                    onClick={() => setTheme("light")}
                                                    className={`px-4 py-2 rounded-2xl text-[11px] font-medium uppercase tracking-normal transition-all ${theme === 'light' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                                >
                                                    Prism
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-base font-medium text-foreground">Accent Calibration</h3>
                                                    <p className="text-sm font-medium text-muted-foreground">Define the primary energy color of the OS.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                {['#71717a', '#a1a1aa', '#d4d4d8', '#3f3f46', '#27272a'].map(color => (
                                                    <button 
                                                        key={color} 
                                                        className="w-10 h-10 rounded-full border border-border/50 hover:scale-110 transition-transform active:scale-95 shadow-sm"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <PreferenceToggle 
                                            label="Minimal Interface Mode" 
                                            description="Reduce visual noise and disable complex styling."
                                            isActive={true}
                                        />
                                        <PreferenceToggle 
                                            label="Spatial Transitions" 
                                            description="Use high-velocity motion for page navigations."
                                            isActive={true}
                                        />
                                    </div>
                                </section>
                            )}

                            {activeSection === "Kernel" && (
                                <section className="space-y-6">
                                    <div className="p-8 bg-card border border-border rounded-2xl shadow-sm space-y-6">
                                        <PreferenceToggle 
                                            label="Auto-Archive Strategy" 
                                            description="Automatically move old tasks to the document vault after 30 days."
                                            isActive={false}
                                        />
                                        <PreferenceToggle 
                                            label="OmniCommand Indexing" 
                                            description="Continuous background indexing of all notes and files."
                                            isActive={true}
                                        />
                                        <div className="pt-6 border-t border-border">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <Database size={16} className="text-foreground" />
                                                    <h3 className="text-xs font-medium uppercase tracking-normal text-foreground">Database Integrity</h3>
                                                </div>
                                                <button className="px-4 py-2 rounded-2xl bg-muted border border-border text-[10px] font-medium uppercase tracking-normal text-foreground hover:bg-muted/80 transition-all">Optimize</button>
                                            </div>
                                            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                                Database size: 142.4 MB. Running smoothly.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeSection === "Security" && (
                                <section className="space-y-6">
                                    <div className="p-8 bg-card border border-border rounded-2xl shadow-sm space-y-6">
                                        <div className="flex items-center gap-6 p-6 rounded-xl bg-muted/50 border border-border">
                                            <div className="p-4 rounded-xl bg-background border border-border text-foreground shadow-sm">
                                                <Fingerprint size={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-foreground">Biometric Vault</h3>
                                                <p className="text-sm font-medium text-muted-foreground leading-relaxed mt-1">
                                                    Sensitive notes and financial pulses are protected by system-level encryption. 
                                                </p>
                                            </div>
                                        </div>
                                        <PreferenceToggle 
                                            label="Stealth Mode" 
                                            description="Hide operational status from the public web interface."
                                            isActive={true}
                                        />
                                        <PreferenceToggle 
                                            label="Global Lockout" 
                                            description="Automatically lock the OS after 5 minutes of inactivity."
                                            isActive={false}
                                        />
                                    </div>
                                </section>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

function MetricItem({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
    return (
        <div className="p-6 bg-card border border-border rounded-xl flex flex-col gap-4 group hover:border-muted-foreground/30 transition-all shadow-sm">
            <div className="p-2.5 rounded-2xl bg-muted border border-border w-fit text-muted-foreground group-hover:text-foreground transition-colors">
                <Icon size={16} />
            </div>
            <div>
                <span className="block text-[10px] font-medium uppercase tracking-normal text-muted-foreground mb-1">{label}</span>
                <span className="block text-lg font-medium text-foreground">{value}</span>
            </div>
        </div>
    );
}

function PreferenceToggle({ label, description, isActive }: { label: string, description: string, isActive: boolean }) {
    const [active, setActive] = useState(isActive);
    return (
        <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
                <h4 className="text-sm font-medium text-foreground">{label}</h4>
                <p className="text-xs font-medium text-muted-foreground">{description}</p>
            </div>
            <button 
                onClick={() => setActive(!active)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 border focus:outline-none ${active ? 'bg-foreground border-foreground' : 'bg-muted border-border'}`}
            >
                <div 
                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-300 shadow-sm ${active ? 'bg-background left-6' : 'bg-foreground/40 left-1'}`} 
                />
            </button>
        </div>
    );
}

