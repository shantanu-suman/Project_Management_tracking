import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import TopNavigation from './components/TopNavigation';
import TaskTable from './components/TaskTable';
import CreateIssueModal from './components/CreateIssueModal';
import IssueDetailModal from './components/IssueDetailModal';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <div className="flex h-screen bg-white dark:bg-gray-900">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopNavigation />
            <TaskTable />
          </div>
        </div>
        <CreateIssueModal />
        <IssueDetailModal />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;