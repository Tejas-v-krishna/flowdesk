import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

import { Layout } from "./components/Layout.tsx";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { TasksPage } from "./pages/TasksPage";
import { CalendarPage } from "./pages/CalendarPage";
import { FocusPage } from "./pages/FocusPage";
import { NotesPage } from "./pages/NotesPage";
import { AIAssistantPage } from "./pages/AIAssistantPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoadingScreen } from "./components/LoadingScreen";
import { useState } from "react";
import { useAppStore } from "./store/useAppStore";
import { BackgroundVideo } from "./components/ui/BackgroundVideo";

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
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

    const socket = io("http://localhost:5000", {
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
    <BrowserRouter>
      {!isInitialLoadingComplete && <LoadingScreen onComplete={() => setInitialLoadingComplete(true)} />}
      <BackgroundVideo />
      <Toaster position="bottom-right" />
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="focus" element={<FocusPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="ai" element={<AIAssistantPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<PlaceholderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}