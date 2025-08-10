import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import TopNavigation from './components/TopNavigation';
import TaskTable from './components/TaskTable';
import CreateIssueModal from './components/CreateIssueModal';
import IssueDetailModal from './components/IssueDetailModal';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TicketListPage from './pages/TicketListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import KanbanBoard from './pages/KanbanBoard';
import StagesPage from './pages/StagesPage';
import ProjectsPage from './pages/ProjectsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <div className="flex h-screen bg-white dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopNavigation />
              <div className="flex-1 overflow-hidden">
                <Routes>
                  <Route path="/" element={<Navigate to="/tickets" replace />} />
                  <Route path="/tickets" element={<TicketListPage />} />
                  <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
                  <Route path="/board" element={<KanbanBoard />} />
                  <Route path="/sprint" element={<TaskTable mode="sprint" />} />
                  <Route path="/stage/:stage" element={<StagesPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/tickets" replace />} />
                </Routes>
              </div>
            </div>
          </div>
          <CreateIssueModal />
          <IssueDetailModal />
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;