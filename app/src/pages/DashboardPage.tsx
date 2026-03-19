import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { QuickActions } from "../components/QuickActions";
import { TaskOverview } from "../components/TaskOverview";
import { WeeklyDistribution } from "../components/WeeklyDistribution";
import { QuickStats } from "../components/QuickStats";
import { TaskManager } from "../components/TaskManager";
import { Activity } from "../components/Activity";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAppStore } from "../store/useAppStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function DashboardPage() {
  const user = useAuthStore(state => state.user);
  const { isInitialLoadingComplete } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks').then(r => r.data),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
  });

  useEffect(() => {
    if (isInitialLoadingComplete && containerRef.current) {
      // Ensure hidden initially to prevent flash
      gsap.set(".dashboard-animate", { opacity: 0, y: 30 });

      gsap.to(".dashboard-animate", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.1,
      });
    }
  }, [isInitialLoadingComplete]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-6 p-6"
    >
      {/* Welcome + Quick Actions */}
      <div className="flex items-start justify-between px-6 mt-4 dashboard-animate opacity-0">
        <div className="flex flex-col gap-2">
          <h1
            className="text-white text-[36px] tracking-[-1.2px] leading-tight"
            style={{ fontWeight: 500 }}
          >
            Welcome, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-muted-foreground/80 text-[15px] font-medium tracking-tight">Here's what's happening with your projects today.</p>
        </div>
        <QuickActions />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-[1fr_1.4fr_1fr] gap-5 px-6">
        <div className="dashboard-animate opacity-0"><TaskOverview tasks={tasks} projects={projects} /></div>
        <div className="dashboard-animate opacity-0"><WeeklyDistribution tasks={tasks} /></div>
        <div className="dashboard-animate opacity-0"><QuickStats tasks={tasks} projects={projects} /></div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-[2fr_1fr] gap-5 px-6 pb-8">
        <div className="dashboard-animate opacity-0"><TaskManager /></div>
        <div className="dashboard-animate opacity-0"><Activity tasks={tasks} /></div>
      </div>
    </div>
  );
}
