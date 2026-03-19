import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, Loader2 } from 'lucide-react';
// @ts-ignore
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-hot-toast';
// @ts-ignore
import api from '../api/client';
import { GlassButton } from '../components/ui/glass-button';

const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.3 }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
};

export function LoginPage() {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const setAuth = useAuthStore((state: any) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
            const res = await api.post(endpoint, form);
            const { _id, name, email, token } = res.data;
            setAuth({ _id, name, email }, token, null);
            toast.success(mode === 'login' ? 'Identity Verified' : 'Protocol Initialized');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Connection failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden"
            style={{ background: 'transparent' }}
        >
            {/* ── Blurred gradient background orbs ── */}
            {/* Top-right diagonal light streak */}
            <div className="absolute pointer-events-none"
                style={{
                    top: '-25%', right: '-5%',
                    width: '900px', height: '200px',
                    background: 'linear-gradient(135deg, rgba(199,160,255,0.45) 0%, rgba(120,76,254,0.25) 40%, transparent 70%)',
                    filter: 'blur(50px)',
                    transform: 'rotate(-35deg)',
                    borderRadius: '50%',
                }}
            />
            {/* Large purple glow – bottom center */}
            <div className="absolute pointer-events-none"
                style={{
                    bottom: '-20%', left: '20%',
                    width: '700px', height: '700px',
                    background: 'radial-gradient(circle, rgba(120,76,254,0.30) 0%, rgba(120,76,254,0.08) 45%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />
            {/* Secondary purple glow – bottom right */}
            <div className="absolute pointer-events-none"
                style={{
                    bottom: '-15%', right: '10%',
                    width: '500px', height: '500px',
                    background: 'radial-gradient(circle, rgba(168,130,255,0.22) 0%, transparent 65%)',
                    filter: 'blur(90px)',
                }}
            />
            {/* Subtle star-field noise overlay */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(1px 1px at 20px 30px, white, transparent),
                            radial-gradient(1px 1px at 40px 70px, white, transparent),
                            radial-gradient(1px 1px at 50px 160px, white, transparent),
                            radial-gradient(1px 1px at 90px 40px, white, transparent),
                            radial-gradient(1px 1px at 130px 80px, white, transparent),
                            radial-gradient(1px 1px at 160px 120px, white, transparent)`,
                    backgroundSize: '200px 200px',
                }}
            />

            {/* ── Main card ── */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-[420px] relative z-10"
            >
                {/* Glassy card */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-[24px] p-8 relative overflow-hidden"
                    style={{
                        background: 'rgba(20, 18, 30, 0.55)',
                        backdropFilter: 'blur(40px) saturate(1.6)',
                        WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7), inset 0 1px 0 0 rgba(255,255,255,0.06)',
                    }}
                >
                    {/* Inner glow accent at top of card */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                        style={{
                            width: '280px', height: '120px',
                            background: 'radial-gradient(ellipse, rgba(120,76,254,0.15) 0%, transparent 70%)',
                            filter: 'blur(30px)',
                        }}
                    />

                    {/* Header */}
                    <motion.div variants={itemVariants} className="relative z-10 mb-8">
                        <h1 className="text-white text-[28px] font-bold tracking-[-1px] mb-1">
                            {mode === 'login' ? 'Sign in' : 'Sign up'}
                        </h1>
                        <p className="text-[#888] text-[14px]">
                            {mode === 'login'
                                ? 'Welcome back to your workspace.'
                                : 'Start your free trial today.'}
                        </p>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="relative z-10">
                        <AnimatePresence mode="wait">
                            {mode === 'register' && (
                                <motion.div
                                    key="name-field"
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden"
                                >
                                    <label className="text-[#bbb] text-[13px] font-medium mb-1.5 block">Name<span className="text-[#784cfe]">*</span></label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            className="w-full h-[44px] pl-10 pr-4 rounded-[10px] text-white text-[14px] outline-none transition-all placeholder:text-[#444]"
                                            style={{
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                            }}
                                            onFocus={e => e.currentTarget.style.borderColor = 'rgba(120,76,254,0.5)'}
                                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div variants={itemVariants} className="mb-4">
                            <label className="text-[#bbb] text-[13px] font-medium mb-1.5 block">Email<span className="text-[#784cfe]">*</span></label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full h-[44px] pl-10 pr-4 rounded-[10px] text-white text-[14px] outline-none transition-all placeholder:text-[#444]"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(120,76,254,0.5)'}
                                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mb-2">
                            <label className="text-[#bbb] text-[13px] font-medium mb-1.5 block">Password<span className="text-[#784cfe]">*</span></label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    className="w-full h-[44px] pl-10 pr-4 rounded-[10px] text-white text-[14px] outline-none transition-all placeholder:text-[#444]"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(120,76,254,0.5)'}
                                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <p className="text-[#555] text-[11px] mt-1.5 ml-0.5">Must be at least 6 characters.</p>
                        </motion.div>

                        {/* Submit button */}
                        <motion.div variants={itemVariants} className="mt-5">
                            <GlassButton
                                type="submit"
                                disabled={loading}
                                className="w-full h-[44px]"
                                contentClassName="flex items-center justify-center gap-2 text-[14px] font-semibold"
                                size="lg"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        {mode === 'login' ? 'Sign in' : 'Create account'}
                                        <ArrowRight size={16} className="opacity-70" />
                                    </>
                                )}
                            </GlassButton>
                        </motion.div>
                    </form>

                    {/* Divider */}
                    <motion.div variants={itemVariants} className="relative z-10 mt-6 pt-5"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        <div className="flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                className="text-[13px] text-[#888] transition-colors hover:text-white"
                            >
                                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                                <span className="text-[#784cfe] font-semibold hover:text-[#9b6dff] transition-colors">
                                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Logo below the card */}
                <motion.div variants={itemVariants} className="flex items-center justify-center mt-8 gap-3 opacity-40 hover:opacity-80 transition-opacity duration-500">
                    <img src="/Group 2.svg" alt="Flowdesk" className="w-6 h-auto" />
                    <span className="text-white/50 text-[12px] font-medium tracking-widest uppercase">Flowdesk</span>
                </motion.div>
            </motion.div>
        </div>
    );
}
