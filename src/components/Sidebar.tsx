import React from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  BarChart3, 
  Bug, 
  CheckSquare, 
  Zap, 
  FileText, 
  Settings,
  ChevronRight,
  Plus,
  Filter,
  Users,
  Calendar,
  Target
} from 'lucide-react';

const Sidebar = () => {
  const { openCreateIssueModal } = useApp();

  const planningItems = [
    { icon: BarChart3, label: 'Roadmap', active: false },
    { icon: CheckSquare, label: 'Backlog', active: false },
    { icon: Target, label: 'Active sprints', active: true },
    { icon: BarChart3, label: 'Reports', active: false },
  ];

  const developmentItems = [
    { icon: Bug, label: 'Issues and filters', active: false },
    { icon: FileText, label: 'Code', active: false },
    { icon: Zap, label: 'Releases', active: false },
  ];

  const projectItems = [
    { icon: Users, label: 'Project pages', active: false },
    { icon: Calendar, label: 'Timeline', active: false },
    { icon: Settings, label: 'Project settings', active: false },
  ];

  const projects = [
    { key: 'PROJ', name: 'Project Alpha', avatar: '🚀' },
    { key: 'WEB', name: 'Website Redesign', avatar: '🎨' },
    { key: 'API', name: 'API Development', avatar: '⚡' },
    { key: 'MOB', name: 'Mobile App', avatar: '📱' },
  ];

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between px-3 py-2 mt-6 first:mt-4">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );

  const NavItem = ({ icon: Icon, label, active }: { icon: any, label: string, active: boolean }) => (
    <a
      href="#"
      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
        active
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      <Icon className="mr-3 h-4 w-4" />
      {label}
    </a>
  );

  return (
    <div className="w-64 bg-white dark:bg-gray-900 h-screen flex flex-col border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Jira</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Software project</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-2 overflow-y-auto">
        <SectionHeader title="Planning" />
        <nav className="space-y-1 px-2">
          {planningItems.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </nav>

        <SectionHeader title="Development" />
        <nav className="space-y-1 px-2">
          {developmentItems.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </nav>

        <SectionHeader title="Project" />
        <nav className="space-y-1 px-2">
          {projectItems.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </nav>

        {/* Projects Section */}
        <div className="mt-8 px-2">
          <div className="flex items-center justify-between px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Projects
            </h3>
            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-1 mt-2">
            {projects.map((project, index) => (
              <a
                key={index}
                href="#"
                className="group flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
              >
                <span className="mr-3 text-base">{project.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{project.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{project.key}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={openCreateIssueModal}
          className="w-full flex items-center justify-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create issue
        </button>
      </div>
    </div>
  );
};

export default Sidebar;