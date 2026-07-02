import { create } from 'zustand';

export type NotificationType = 'productivity' | 'ai' | 'system' | 'success' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationState {
  notifications: Notification[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: '1',
      type: 'ai',
      title: 'Proactive Insight',
      message: 'You are most productive between 9 AM and 11 AM. Schedule your deep work then.',
      timestamp: new Date(),
      read: false,
      actionLabel: 'Schedule'
    },
    {
      id: '2',
      type: 'productivity',
      title: 'Task Milestone',
      message: 'You completed 5 tasks today. Great momentum!',
      timestamp: new Date(Date.now() - 3600000),
      read: true
    }
  ],
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  addNotification: (n) => set((state) => ({
    notifications: [
      {
        ...n,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date(),
        read: false
      },
      ...state.notifications
    ]
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  })),
  clearAll: () => set({ notifications: [] })
}));
