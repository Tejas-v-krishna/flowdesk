import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useAppStore } from "./store/useAppStore";

import { Layout } from "./components/Layout.tsx";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { TasksPage } from "./pages/TasksPage";
import { CalendarPage } from "./pages/CalendarPage";
import { FocusPage } from "./pages/FocusPage";
import NotesPage from "./pages/NotesPage";
import { AIAssistantPage } from "./pages/AIAssistantPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { KanbanPage } from "./pages/KanbanPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import ProfilePage from "./pages/ProfilePage";
import { LoadingScreen } from "./components/LoadingScreen";
import FinancePage from "./pages/FinancePage";
import GoalsPage from "./pages/GoalsPage";
import { HomePage } from "./pages/HomePage";

import { AestheticProvider } from "./context/AestheticContext";

export default function App() {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const user = useAuthStore((state: any) => state.user);
  const theme = useThemeStore((state: any) => state.theme);
  const queryClient = useQueryClient();
  const { isInitialLoadingComplete, setInitialLoadingComplete } = useAppStore();

  // Sync theme with document element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Connect to websocket for live task updates
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socket = io(import.meta.env.VITE_API_URL || "", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to real-time sync");
      socket.emit("join_user_room", user._id);
    });

    const invalidateTasks = () =>
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

    socket.on("task_created", invalidateTasks);
    socket.on("task_updated", invalidateTasks);
    socket.on("task_deleted", invalidateTasks);
    socket.on("tasks_bulk_updated", invalidateTasks);

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user, queryClient]);

  return (
    <AestheticProvider>
      <BrowserRouter>
        {!isInitialLoadingComplete && <LoadingScreen onComplete={() => setInitialLoadingComplete(true)} />}
        <Toaster position="bottom-right" />
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />}
          />

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="focus" element={<FocusPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="ai" element={<AIAssistantPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="kanban" element={<KanbanPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<PlaceholderPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AestheticProvider>
  );
}