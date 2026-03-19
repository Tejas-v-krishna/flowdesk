import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    CheckSquare,
    Calendar,
    Timer,
    StickyNote,
    MessageSquare,
    BarChart3,
    Settings,
    Keyboard
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Briefcase size={20} />, label: 'Projects', path: '/projects' },
        { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/tasks' },
        { icon: <Calendar size={20} />, label: 'Calendar', path: '/calendar' },
        { icon: <Timer size={20} />, label: 'Focus', path: '/focus' },
        { icon: <StickyNote size={20} />, label: 'Notes', path: '/notes' },
        { icon: <MessageSquare size={20} />, label: 'AI Assistant', path: '/ai-assistant' },
        { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
    ];

    return (
        <aside className="w-64 border-right border-border bg-surface flex flex-col">
            <div className="p-6">
                <h1 className="text-accent font-mono font-bold tracking-widest uppercase text-sm">FlowDesk</h1>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-sans text-sm ${isActive
                                ? 'bg-accent/10 text-accent border border-accent/20'
                                : 'text-textDim hover:text-text hover:bg-surface2'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border space-y-1">
                <button className="flex items-center gap-3 w-full px-3 py-2 text-textDim hover:text-text hover:bg-surface2 rounded-md transition-colors text-sm font-sans">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
                <button className="flex items-center gap-3 w-full px-3 py-2 text-textDim hover:text-text hover:bg-surface2 rounded-md transition-colors text-sm font-sans">
                    <Keyboard size={20} />
                    <span>Shortcuts</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
