import React, { useState } from 'react';
import { Issue } from '../types';
import AttachmentsPreview from './AttachmentsPreview';
import Comments from './Comments';

interface TicketPageProps {
  issue: Issue;
  onSave: (updates: Partial<Issue>) => void;
  onDelete: () => void;
}

const TicketPage: React.FC<TicketPageProps> = ({ issue, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Issue>>({});

  const save = () => {
    onSave(editData);
    setIsEditing(false);
    setEditData({});
  };

  const cancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Summary</label>
          {isEditing ? (
            <input
              type="text"
              value={(editData.summary as string) ?? issue.summary}
              onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{issue.summary}</h1>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          {isEditing ? (
            <textarea
              value={(editData.description as string) ?? issue.description ?? ''}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{issue.description || 'No description provided.'}</div>
          )}
        </div>

        {isEditing ? (
          <div className="flex space-x-3 mb-6">
            <button onClick={save} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Changes</button>
            <button onClick={cancel} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">Cancel</button>
          </div>
        ) : null}

        <Comments />
      </div>
      <div className="w-full lg:w-80 bg-gray-50 dark:bg-gray-900 p-6 border-l border-gray-200 dark:border-gray-700 space-y-6">
        <AttachmentsPreview attachments={issue.attachments} />
        <div>
          <div className="text-sm text-gray-900 dark:text-white">Reporter: {issue.reporter.name}</div>
          <div className="text-sm text-gray-900 dark:text-white">Created: {issue.created.toLocaleDateString()}</div>
          <div className="text-sm text-gray-900 dark:text-white">Updated: {issue.updated.toLocaleDateString()}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(true)} className="px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md">Edit</button>
          <button onClick={onDelete} className="px-3 py-2 text-xs font-medium text-white bg-red-600 rounded-md">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;


