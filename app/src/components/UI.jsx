import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

export const Button = ({ className, variant = 'primary', size = 'md', ...props }) => {
    const variants = {
        primary: 'bg-gradient-to-r from-[#d946ef] to-[#9333ea] text-white hover:opacity-90 shadow-[0_0_15px_rgba(217,70,239,0.2)] dark:shadow-[0_0_20px_rgba(147,51,234,0.3)]',
        secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10 dark:border-white/10 transition-colors',
        ghost: 'bg-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors',
        danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20 dark:hover:bg-red-500/20 transition-colors',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'inline-flex items-center justify-center rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest leading-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    )
}

export const Input = ({ className, label, error, ...props }) => (
    <div className="space-y-2 w-full">
        {label && <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 pl-1">{label}</label>}
        <input
            className={cn(
                "w-full h-12 px-4 rounded-xl bg-white border border-neutral-200 text-neutral-900 dark:bg-[#222] dark:border-white/5 dark:text-white text-sm transition-all focus:border-[#d946ef]/50 focus:ring-1 focus:ring-[#d946ef]/20 outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
                error && "border-red-500/50",
                className
            )}
            {...props}
        />
        {error && <p className="text-[11px] text-red-500 dark:text-red-400 pl-1">{error}</p>}
    </div>
)

export const Card = ({ className, children, ...props }) => (
    <div className={cn("bg-white dark:bg-[#18181A] border border-neutral-200 dark:border-white/5 rounded-3xl p-6 shadow-sm dark:shadow-none transition-colors", className)} {...props}>
        {children}
    </div>
)
