import { type ReactNode, type CSSProperties, useRef } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** intensity of blur (default 20) */
  blur?: number;
  /** show interactive refraction highlight (default true) */
  interactive?: boolean;
  /** rounded corners (default "30px") */
  rounded?: string;
  as?: any;
  [key: string]: any;
}

export function GlassPanel({
  children,
  className = "",
  style,
  blur = 20,
  interactive = true,
  rounded = "30px",
  as: Component = motion.div,
  ...props
}: GlassPanelProps) {
  const theme = useThemeStore((state) => state.theme);
  const isLight = theme === "light";
  const panelRef = useRef<HTMLDivElement>(null);

  // Interactive mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement
  const springConfig = { damping: 20, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !panelRef.current) return;
    const { left, top } = panelRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  // Check if user provided positioning, otherwise default to relative
  const hasPositioning = /\b(fixed|absolute|relative|sticky)\b/.test(className);
  const finalClassName = `${!hasPositioning ? 'relative' : ''} overflow-hidden transition-all duration-500 ${className}`;

  return (
    <Component
      ref={panelRef}
      onMouseMove={handleMouseMove}
      {...props}
      className={finalClassName}
      style={{
        borderRadius: rounded,
        background: isLight
          ? "rgba(255, 255, 255, 0.7)"
          : "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.1) 100%)",
        border: isLight
          ? "1px solid rgba(120, 76, 254, 0.08)"
          : "1px solid var(--card-border, rgba(255, 255, 255, 0.07))",
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        boxShadow: isLight
          ? "0 4px 16px rgba(120, 76, 254, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5)"
          : "0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
        ...style,
      }}
    >
      {/* Background Layer: Everything here is absolute and pointer-events-none */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Dynamic Interactive Liquid Highlight */}
        {interactive && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), ${isLight ? "rgba(120,76,254,0.08)" : "rgba(204,186,255,0.1)"
                }, transparent 80%)`,
              // @ts-ignore
              "--mouse-x": smoothX.get() + "px",
              "--mouse-y": smoothY.get() + "px",
            }}
          />
        )}

        {/* Static Refraction Edge Highlights */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: rounded,
            boxShadow: isLight
              ? "inset 1px 1px 0 0 rgba(255,255,255,0.8), inset -1px -1px 0 0 rgba(120,76,254,0.03)"
              : "inset 1px 1px 0 0 rgba(255,255,255,0.15), inset -1px -1px 0 0 rgba(0,0,0,0.2)",
          }}
        />

        {/* Subtle Grain Detail */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: rounded,
            opacity: isLight ? 0.015 : 0.025,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            mixMode: "overlay",
          } as any}
        />
      </div>

      {/* Children rendered directly to maintain layout structure (flex, etc.) */}
      {children}
    </Component>
  );
}
