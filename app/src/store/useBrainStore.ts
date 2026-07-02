import { create } from 'zustand';

export interface BrainInsight {
  id: string;
  type: 'strategy' | 'productivity' | 'rest' | 'connection';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: Date;
}

export interface BrainNode {
  id: string;
  label: string;
  type: 'task' | 'note' | 'project' | 'person';
  connections: string[];
}

interface BrainState {
  insights: BrainInsight[];
  knowledgeGraph: BrainNode[];
  executiveSummary: string;
  isAnalyzing: boolean;
  addInsight: (insight: Omit<BrainInsight, 'id' | 'timestamp'>) => void;
  setExecutiveSummary: (summary: string) => void;
  setAnalyzing: (loading: boolean) => void;
}

export const useBrainStore = create<BrainState>((set) => ({
  insights: [
    {
      id: '1',
      type: 'strategy',
      title: 'No Meetings Upcoming',
      description: 'Your calendar is clear for the next 3 hours. It is a great time to work on the "Identity II" project.',
      impact: 'high',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'productivity',
      title: 'Jumped Between Tasks',
      description: 'You have jumped between 4 different projects in the last hour. Try to focus on just one project for the next 25 minutes.',
      impact: 'medium',
      timestamp: new Date(Date.now() - 1800000)
    }
  ],
  knowledgeGraph: [
    { id: '1', label: 'Identity II', type: 'project', connections: ['2', '3'] },
    { id: '2', label: 'AI Assistant Dashboard', type: 'task', connections: ['1'] },
    { id: '3', label: 'Premium UI Design', type: 'note', connections: ['1'] }
  ],
  executiveSummary: "You are doing okay, but your attention is a bit split right now. Try starting a timer to focus on your main tasks.",
  isAnalyzing: false,
  addInsight: (i) => set((state) => ({
    insights: [
      { ...i, id: Math.random().toString(36).substring(7), timestamp: new Date() },
      ...state.insights
    ]
  })),
  setExecutiveSummary: (summary) => set({ executiveSummary: summary }),
  setAnalyzing: (loading) => set({ isAnalyzing: loading })
}));
