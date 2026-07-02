import { type ReactNode, type CSSProperties } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** intensity of blur (deprecated in minimal redesign) */
  blur?: number;
  /** show interactive refraction highlight (deprecated in minimal redesign) */
  interactive?: boolean;
  /** rounded corners (default "0.5rem" for minimal) */
  rounded?: string;
  as?: any;
  [key: string]: any;
}

export function GlassPanel({
  children,
  className = "",
  style,
  blur,
  interactive,
  rounded = "0.5rem",
  as: Component = "div",
  ...props
}: GlassPanelProps) {
  return (
    <Component
      {...props}
      className={`bg-card text-card-foreground border border-border shadow-sm ${className}`}
      style={{
        borderRadius: rounded,
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
