import React from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const StagesPage: React.FC = () => {
  const { stage } = useParams();
  const { state } = useApp();

  const stageTitle = (stage || '').toUpperCase();

  return (
    <div className="h-full overflow-auto p-6 bg-gray-50 dark:bg-gray-800">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{stageTitle} Stage</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Click into tickets to view full details.</p>
      <div className="space-y-2">
        {state.issues.map(issue => (
          <div key={issue.id} className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{issue.key}</div>
            <div className="text-sm text-gray-900 dark:text-white">{issue.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StagesPage;


