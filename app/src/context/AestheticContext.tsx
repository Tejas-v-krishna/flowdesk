import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Ambiance = "default" | "glass-obsidian" | "forest-deep" | "sunset-cyber";

interface AestheticConfig {
  accent: string;
  glow: string;
  blur: string;
  opacity: string;
  borderOpacity: string;
}

const AMBIANCE_MAP: Record<Ambiance, AestheticConfig> = {
  "default": {
    accent: "var(--primary)",
    glow: "var(--primary)",
    blur: "40px",
    opacity: "0.05",
    borderOpacity: "0.12",
  },
  "glass-obsidian": {
    accent: "#ffffff",
    glow: "rgba(255,255,255,0.2)",
    blur: "60px",
    opacity: "0.08",
    borderOpacity: "0.2",
  },
  "forest-deep": {
    accent: "#000000",
    glow: "#000000",
    blur: "40px",
    opacity: "0.06",
    borderOpacity: "0.15",
  },
  "sunset-cyber": {
    accent: "#f59e0b",
    glow: "#f59e0b",
    blur: "45px",
    opacity: "0.07",
    borderOpacity: "0.18",
  }
};

interface AestheticContextType {
  ambiance: Ambiance;
  setAmbiance: (ambiance: Ambiance) => void;
  config: AestheticConfig;
}

const AestheticContext = createContext<AestheticContextType | undefined>(undefined);

export function AestheticProvider({ children }: { children: ReactNode }) {
  const [ambiance, setAmbiance] = useState<Ambiance>("default");

  useEffect(() => {
    const config = AMBIANCE_MAP[ambiance];
    const root = document.documentElement;
    
    root.style.setProperty("--ambiance-accent", config.accent);
    root.style.setProperty("--ambiance-glow", config.glow);
    root.style.setProperty("--glass-blur", config.blur);
    root.style.setProperty("--glass-opacity", config.opacity);
    root.style.setProperty("--glass-border-opacity", config.borderOpacity);
  }, [ambiance]);

  return (
    <AestheticContext.Provider value={{ ambiance, setAmbiance, config: AMBIANCE_MAP[ambiance] }}>
      {children}
    </AestheticContext.Provider>
  );
}

export function useAesthetic() {
  const context = useContext(AestheticContext);
  if (context === undefined) {
    throw new Error("useAesthetic must be used within an AestheticProvider");
  }
  return context;
}
