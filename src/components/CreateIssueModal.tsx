import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Issue } from '../types';
import TicketForm, { TicketFormValues } from './TicketForm';

const CreateIssueModal = () => {
  const { state, closeCreateIssueModal, createIssue } = useApp();
  const handleSubmit = (values: TicketFormValues) => {
    const assignee = values.assigneeId
      ? state.users.find(u => u.id === values.assigneeId) || null
      : null;

    const newIssue = {
      summary: values.summary,
      description: values.description,
      type: values.type,
      status: 'To Do' as Issue['status'],
      priority: values.priority,
      assignee: assignee ? {
        name: assignee.name,
        avatar: assignee.avatar || '',
        initials: assignee.initials
      } : null,
      reporter: { name: 'John Doe', initials: 'JD' },
      storyPoints: values.storyPoints ? parseInt(values.storyPoints) : undefined
    };

    createIssue(newIssue);
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

        <div className="p-6">
          <TicketForm
            users={state.users}
            onCancel={closeCreateIssueModal}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateIssueModal;