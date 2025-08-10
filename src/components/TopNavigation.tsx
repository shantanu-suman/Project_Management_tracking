import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Search, 
  Filter, 
  Plus, 
  Bell, 
  ChevronDown,
  Settings,
  HelpCircle,
  User,
  Grid3X3,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

const TopNavigation = () => {
  const { state, setSearchQuery, openCreateIssueModal } = useApp();
  const { theme, setTheme, isDark } = useTheme();

  const handleThemeChange = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4" />;
    if (theme === 'dark') return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Projects</span>
            <span className="text-gray-400 dark:text-gray-500">/</span>
            <span className="text-gray-900 dark:text-white font-medium">Project Alpha</span>
          </div>
        </div>

        {/* Center Section */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={state.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search issues"
              className="pl-10 pr-4 py-2 w-full text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Create Button */}
          <button 
            onClick={openCreateIssueModal}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </button>

          {/* Action Buttons */}
          <button 
            onClick={handleThemeChange}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title={`Current theme: ${theme}`}
          >
            {getThemeIcon()}
          </button>

          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            <Grid3X3 className="h-4 w-4" />
          </button>

          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            <Filter className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            <HelpCircle className="h-4 w-4" />
          </button>

          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            <Settings className="h-4 w-4" />
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium leading-none">JD</span>
            </div>
            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;