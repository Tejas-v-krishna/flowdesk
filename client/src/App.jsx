import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import FocusMode from './pages/FocusMode';
import Notes from './pages/Notes';
import AIAssistant from './pages/AIAssistant';
import Analytics from './pages/Analytics';

const queryClient = new QueryClient();

function App() {
    const isAuthenticated = true; // Placeholder for auth logic

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Toaster position="bottom-right" />
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:id" element={<ProjectDetail />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/focus" element={<FocusMode />} />
                        <Route path="/notes" element={<Notes />} />
                        <Route path="/ai-assistant" element={<AIAssistant />} />
                        <Route path="/analytics" element={<Analytics />} />
                    </Route>
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
