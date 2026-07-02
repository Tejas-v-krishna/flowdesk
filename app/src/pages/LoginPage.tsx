import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Chrome, Github, Eye, EyeOff, Loader2 } from 'lucide-react';
// @ts-ignore
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import api from '../api/client';

export function LoginPage() {
    const [mode, setMode] = useState<'login' | 'register'>('register');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    
    const setAuth = useAuthStore((state: any) => state.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
            const res = await api.post(endpoint, form);
            const { _id, name, email, token } = res.data;
            setAuth({ _id, name, email }, token, null);
            toast.success(mode === 'login' ? 'Welcome Back!' : 'Account Created!');
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Connection failed');
        } finally {
            setLoading(false);
        }
    };

    // Staggered animation variants
    const heroContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const heroItem = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <main className="flex min-h-screen w-full bg-background selection:bg-primary/30 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4 text-foreground">
            
            {/* Left Column (Hero) */}
            <div className="relative flex-col items-center justify-end pb-32 px-12 rounded-2xl overflow-hidden shadow-2xl h-full w-[52%] hidden lg:flex">
                <video 
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4"
                    autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Brand / Logo (Top Left over video) */}
                <div className="absolute top-10 left-12 flex items-center gap-2 z-20 cursor-pointer" onClick={() => navigate('/')}>
                    <Circle size={24} className="fill-white text-white" />
                    <span className="text-xl font-semibold tracking-tight text-white drop-shadow-md">Flowdesk</span>
                </div>

                <motion.div 
                    variants={heroContainer}
                    initial="hidden"
                    animate="show"
                    className="z-10 w-full max-w-xs space-y-8"
                >
                    <motion.div variants={heroItem}>
                        <h1 className="text-4xl font-medium tracking-tight whitespace-nowrap text-white drop-shadow-lg">
                            {mode === 'register' ? 'Join Flowdesk' : 'Welcome Back'}
                        </h1>
                        <p className="text-white/90 text-sm leading-relaxed mt-2 drop-shadow-md">
                            {mode === 'register' 
                                ? 'Follow these 3 quick phases to activate your space.'
                                : 'Sign in to pick up right where you left off.'}
                        </p>
                    </motion.div>

                    <AnimatePresence>
                        {mode === 'register' && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4"
                            >
                                <motion.div variants={heroItem}>
                                    <StepItem number={1} text="Enter your details" active={true} />
                                </motion.div>
                                <motion.div variants={heroItem}>
                                    <StepItem number={2} text="Set up workspace" active={false} />
                                </motion.div>
                                <motion.div variants={heroItem}>
                                    <StepItem number={3} text="Ready to start" active={false} />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Right Column (Form) */}
            <div className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10"
                >
                    <div>
                        <h2 className="text-3xl font-medium tracking-tight text-foreground">
                            {mode === 'register' ? 'Create New Profile' : 'Sign in to your account'}
                        </h2>
                        <p className="text-muted-foreground text-sm mt-2">
                            {mode === 'register' 
                                ? 'Enter your details to create your account.'
                                : 'Enter your credentials to access your workspace.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <SocialButton icon={Chrome} label="Google" />
                        <SocialButton icon={Github} label="Github" />
                    </div>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-border"></div>
                        <span className="flex-shrink-0 mx-4 text-xs font-medium text-muted-foreground uppercase tracking-widest bg-background px-2">Or</span>
                        <div className="flex-grow border-t border-border"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {mode === 'register' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <InputGroup 
                                        label="Full Name" 
                                        placeholder="Enter your name" 
                                        type="text"
                                        value={form.name}
                                        onChange={(e: any) => setForm({...form, name: e.target.value})}
                                        required
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <InputGroup 
                            label="Email Address" 
                            placeholder="name@example.com" 
                            type="email"
                            value={form.email}
                            onChange={(e: any) => setForm({...form, email: e.target.value})}
                            required
                        />

                        <div className="relative">
                            <InputGroup 
                                label="Password" 
                                placeholder="Create a password" 
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e: any) => setForm({...form, password: e.target.value})}
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <p className="text-[11px] text-muted-foreground mt-1.5 ml-1">Requires at least 8 symbols.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/90 active:scale-[0.98] mt-6 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : (mode === 'register' ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            {mode === 'login' 
                                ? "Don't have an account? Sign up" 
                                : "Member of the team? Log in"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

// ---- Sub Components ----

function StepItem({ number, text, active }: { number: number, text: string, active: boolean }) {
    if (active) {
        return (
            <div className="flex items-center gap-4 bg-white text-black border border-white p-3 rounded-xl shadow-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-medium text-sm shrink-0">
                    {number}
                </div>
                <span className="text-sm font-medium">{text}</span>
            </div>
        );
    }
    
    return (
        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm text-white border border-white/10 p-3 rounded-xl transition-colors hover:bg-black/60">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white/40 font-medium text-sm shrink-0">
                {number}
            </div>
            <span className="text-sm font-medium text-white/80">{text}</span>
        </div>
    );
}

function SocialButton({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <button type="button" className="flex items-center justify-center gap-3 h-12 bg-muted/30 border border-border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer w-full">
            <Icon size={18} className="text-foreground" />
            <span className="text-sm font-medium text-foreground">{label}</span>
        </button>
    );
}

function InputGroup({ label, placeholder, type, value, onChange, required, minLength }: any) {
    return (
        <div className="w-full">
            <label className="text-sm font-medium text-foreground block mb-1.5">{label}</label>
            <input 
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                minLength={minLength}
                className="w-full bg-muted/40 border border-border rounded-xl h-12 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
        </div>
    );
}
