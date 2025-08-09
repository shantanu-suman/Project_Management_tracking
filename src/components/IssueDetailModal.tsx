import React, { useState } from 'react';
import { X, Edit2, Trash2, User, Flag, Calendar, Hash, MessageSquare, Paperclip } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Issue } from '../types';

const IssueDetailModal = () => {
  const { state, closeIssueDetail, updateIssue, deleteIssue, moveIssueToStatus, assignIssue } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Issue>>({});

  if (!state.isIssueDetailModalOpen || !state.selectedIssue) return null;

  const issue = state.selectedIssue;

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      summary: issue.summary,
      description: issue.description,
      priority: issue.priority,
      storyPoints: issue.storyPoints
    });
  };

  const handleSave = () => {
    updateIssue(issue.id, editData);
    setIsEditing(false);
    setEditData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this issue?')) {
      deleteIssue(issue.id);
      closeIssueDetail();
    }
  };

  const handleStatusChange = (newStatus: Issue['status']) => {
    moveIssueToStatus(issue.id, newStatus);
  };

  const handleAssigneeChange = (userId: string) => {
    const user = state.users.find(u => u.id === userId);
    assignIssue(issue.id, user || null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      case 'In Progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'In Review': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'Done': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{issue.key}</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
              {issue.status}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={closeIssueDetail}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Summary */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Summary
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.summary || ''}
                  onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{issue.summary}</h1>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              {isEditing ? (
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {issue.description || 'No description provided.'}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex space-x-3 mb-6">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Comments
              </h3>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-gray-50 dark:bg-gray-900 p-6 border-l border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={issue.status}
                  onChange={(e) => handleStatusChange(e.target.value as Issue['status'])}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Assignee
                </label>
                <select
                  value={issue.assignee?.name || ''}
                  onChange={(e) => {
                    const user = state.users.find(u => u.name === e.target.value);
                    handleAssigneeChange(user?.id || '');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Unassigned</option>
                  {state.users.map(user => (
                    <option key={user.id} value={user.name}>{user.name}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Flag className="inline h-4 w-4 mr-1" />
                  Priority
                </label>
                {isEditing ? (
                  <select
                    value={editData.priority || issue.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value as Issue['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Lowest">Lowest</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Highest">Highest</option>
                  </select>
                ) : (
                  <div className="text-gray-900 dark:text-white">{issue.priority}</div>
                )}
              </div>

              {/* Story Points */}
              {(issue.type === 'Story' || issue.type === 'Epic') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Hash className="inline h-4 w-4 mr-1" />
                    Story Points
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={editData.storyPoints || ''}
                      onChange={(e) => setEditData({ ...editData, storyPoints: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="text-gray-900 dark:text-white">{issue.storyPoints || 'Not set'}</div>
                  )}
                </div>
              )}

              {/* Reporter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reporter
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-medium leading-none">
                      {issue.reporter.initials}
                    </span>
                  </div>
                  <span className="text-gray-900 dark:text-white">{issue.reporter.name}</span>
                </div>
              </div>

              {/* Dates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Created
                </label>
                <div className="text-gray-900 dark:text-white text-sm">
                  {issue.created.toLocaleDateString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Updated
                </label>
                <div className="text-gray-900 dark:text-white text-sm">
                  {issue.updated.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailModal;