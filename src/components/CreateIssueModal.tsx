import React, { useState } from 'react';
import { X, User, Flag, Calendar, Hash } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Issue, User as UserType } from '../types';

const CreateIssueModal = () => {
  const { state, closeCreateIssueModal, createIssue } = useApp();
  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    type: 'Task' as Issue['type'],
    priority: 'Medium' as Issue['priority'],
    assigneeId: '',
    storyPoints: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assignee = formData.assigneeId 
      ? state.users.find(u => u.id === formData.assigneeId) || null
      : null;

    const newIssue = {
      summary: formData.summary,
      description: formData.description,
      type: formData.type,
      status: 'To Do' as Issue['status'],
      priority: formData.priority,
      assignee: assignee ? {
        name: assignee.name,
        avatar: assignee.avatar || '',
        initials: assignee.initials
      } : null,
      reporter: { name: 'John Doe', initials: 'JD' },
      storyPoints: formData.storyPoints ? parseInt(formData.storyPoints) : undefined
    };

    createIssue(newIssue);
    setFormData({
      summary: '',
      description: '',
      type: 'Task',
      priority: 'Medium',
      assigneeId: '',
      storyPoints: ''
    });
  };

  if (!state.isCreateIssueModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Issue</h2>
          <button
            onClick={closeCreateIssueModal}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Issue Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Issue['type'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Task">Task</option>
              <option value="Story">Story</option>
              <option value="Bug">Bug</option>
              <option value="Epic">Epic</option>
            </select>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Summary *
            </label>
            <input
              type="text"
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Enter a brief summary of the issue"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a detailed description of the issue"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Flag className="inline h-4 w-4 mr-1" />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Issue['priority'] })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Lowest">Lowest</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Highest">Highest</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Assignee
              </label>
              <select
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Unassigned</option>
                {state.users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Story Points */}
          {(formData.type === 'Story' || formData.type === 'Epic') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Hash className="inline h-4 w-4 mr-1" />
                Story Points
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.storyPoints}
                onChange={(e) => setFormData({ ...formData, storyPoints: e.target.value })}
                placeholder="Enter story points"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={closeCreateIssueModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIssueModal;