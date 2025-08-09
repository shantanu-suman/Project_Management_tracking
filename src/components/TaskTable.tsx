import React from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  MoreHorizontal, 
  Calendar, 
  MessageSquare, 
  Paperclip,
  Flag,
  ArrowUp,
  ArrowDown,
  Minus,
  Bug,
  CheckSquare,
  Zap,
  FileText,
  Eye
} from 'lucide-react';
import { Issue } from '../types';

const TaskTable = () => {
  const { state, openCreateIssueModal, openIssueDetail } = useApp();

  // Filter issues based on search query and current sprint
  const filteredIssues = state.issues.filter(issue => {
    const matchesSearch = !state.searchQuery || 
      issue.summary.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      issue.key.toLowerCase().includes(state.searchQuery.toLowerCase());
    
    const inCurrentSprint = issue.sprint === state.currentSprint?.id;
    
    return matchesSearch && inCurrentSprint;
  });

  const completedIssues = filteredIssues.filter(issue => issue.status === 'Done').length;
  const totalIssues = filteredIssues.length;
  const completionPercentage = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      case 'In Progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'In Review':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'Done':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Highest':
        return <ArrowUp className="h-4 w-4 text-red-600" />;
      case 'High':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'Medium':
        return <Minus className="h-4 w-4 text-yellow-500" />;
      case 'Low':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case 'Lowest':
        return <ArrowDown className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Story':
        return <CheckSquare className="h-4 w-4 text-green-600" />;
      case 'Bug':
        return <Bug className="h-4 w-4 text-red-600" />;
      case 'Task':
        return <CheckSquare className="h-4 w-4 text-blue-600" />;
      case 'Epic':
        return <Zap className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-800">
      {/* Sprint Header */}
      <div className="bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {state.currentSprint?.name || 'Current Sprint'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {totalIssues} issues • {completedIssues} completed
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{completedIssues}</span> of <span className="font-medium">{totalIssues}</span> issues completed
            </div>
            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              Complete sprint
            </button>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white dark:bg-gray-900 mx-6 mt-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Key
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Summary
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Assignee
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Story Points
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Updated
                </th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredIssues.map((issue) => (
                <tr 
                  key={issue.id} 
                  onClick={() => openIssueDetail(issue)}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {getTypeIcon(issue.type)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                      {issue.key}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 dark:text-white font-medium">
                        {issue.summary}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {issue.assignee ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium leading-none">
                            {issue.assignee.initials}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {issue.assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium leading-none">
                          {issue.reporter.initials}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {issue.reporter.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      {getPriorityIcon(issue.priority)}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {issue.priority}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {issue.storyPoints && (
                      <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full">
                        {issue.storyPoints}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(issue.updated)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredIssues.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {state.searchQuery ? 'No issues match your search.' : 'No issues in this sprint.'}
              </p>
              <button 
                onClick={openCreateIssueModal}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                Create your first issue
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Backlog Section */}
      <div className="bg-white dark:bg-gray-900 mx-6 mt-6 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Backlog</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Issues ready for future sprints
          </p>
        </div>
        <div className="p-4">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No issues in backlog. Create an issue to get started.
            </p>
            <button 
              onClick={openCreateIssueModal}
              className="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              Create issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskTable;