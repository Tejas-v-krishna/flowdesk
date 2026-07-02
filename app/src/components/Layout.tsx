import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useThemeStore } from "../store/useThemeStore";
import { motion, AnimatePresence } from "framer-motion";

function LayoutInner() {
  const theme = useThemeStore((state) => state.theme);
  const location = useLocation();

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${theme}`}>
      <Sidebar />
      <main className="ml-[240px] flex flex-col min-h-screen relative z-10">
        <TopBar />
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col p-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export function Layout() {
  return <LayoutInner />;
}
