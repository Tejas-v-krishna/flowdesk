import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

function cn(...inputs: (string | undefined | null | false)[]): string {
    return inputs.filter(Boolean).join(" ");
}

const glassButtonVariants = cva(
    "relative isolate all-unset cursor-pointer rounded-full transition-all",
    {
        variants: {
            size: {
                default: "text-base font-medium",
                sm: "text-sm font-medium",
                lg: "text-lg font-medium",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            size: "default",
        },
    }
);

const glassButtonTextVariants = cva(
    "glass-button-text relative block select-none tracking-normaler",
    {
        variants: {
            size: {
                default: "px-6 py-3.5",
                sm: "px-4 py-2",
                lg: "px-8 py-0",
                icon: "flex h-10 w-10 items-center justify-center",
            },
        },
        defaultVariants: {
            size: "default",
        },
    }
);

export interface GlassButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
    contentClassName?: string;
    loading?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
    ({ className, children, size, contentClassName, loading, ...props }, ref) => {
        return (
            <div
                className={cn(
                    "glass-button-wrap cursor-pointer rounded-full",
                    className
                )}
            >
                <button
                    className={cn("glass-button", glassButtonVariants({ size }), (props.disabled || loading) && "opacity-10 cursor-not-allowed")}
                    ref={ref}
                    {...props}
                    disabled={props.disabled || loading}
                >
                    <span
                        className={cn(
                            glassButtonTextVariants({ size }),
                            contentClassName,
                            "flex items-center justify-center gap-2"
                        )}
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-15" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {children}
                    </span>
                </button>
                <div className="glass-button-shadow rounded-full"></div>
            </div>
        );
    }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };

