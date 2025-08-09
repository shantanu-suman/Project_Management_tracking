import React from 'react';
import { useApp } from '../contexts/AppContext';

const ProjectsPage: React.FC = () => {
  const { state } = useApp();
  return (
    <div className="h-full overflow-auto p-6 bg-gray-50 dark:bg-gray-800">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.projects.map(project => (
          <div key={project.id} className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
            <div className="text-2xl mb-2">{project.avatar}</div>
            <div className="text-sm text-gray-900 dark:text-white font-medium">{project.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{project.key}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;


