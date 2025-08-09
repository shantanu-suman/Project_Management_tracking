import React from 'react';
import Board from '../components/Board';

const KanbanBoard: React.FC = () => {
  return (
    <div className="h-full p-4 overflow-auto bg-gray-50 dark:bg-gray-800">
      <Board />
    </div>
  );
};

export default KanbanBoard;


