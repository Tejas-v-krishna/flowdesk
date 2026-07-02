import { useLocation } from "react-router";

export function PlaceholderPage() {
  const location = useLocation();
  const pageName = location.pathname.slice(1).replace(/-/g, " ");
  const displayName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-10 py-6">
      <div className="w-[64px] h-[64px] rounded-2xl bg-[rgba(40,40,40,0.6)] border border-[rgba(80,80,80,0.25)] backdrop-blur-xl flex items-center justify-center mb-4">
        <span className="text-[28px]">🚧</span>
      </div>
      <h3 className="text-white text-[16px] tracking-[-0.3px] mb-1" style={{ fontWeight: 600 }}>
        {displayName || "Page"} — Coming Soon
      </h3>
      <p className="text-muted-foreground text-[13px] tracking-[-0.2px]">
        This section is under construction.
      </p>
    </div>
  );
}

