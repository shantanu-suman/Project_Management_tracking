import React from 'react';
import { useApp } from '../contexts/AppContext';
import TicketCard from './TicketCard';

type Status = 'To Do' | 'In Progress' | 'In Review' | 'Done';

const columns: { key: Status; title: string }[] = [
  { key: 'To Do', title: 'To Do' },
  { key: 'In Progress', title: 'In Progress' },
  { key: 'In Review', title: 'In Review' },
  { key: 'Done', title: 'Done' },
];

const Board: React.FC = () => {
  const { state, moveIssueToStatus, openIssueDetail } = useApp();

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    moveIssueToStatus(id, status);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {columns.map(col => (
        <div key={col.key} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 flex flex-col">
          <div className="font-medium text-gray-900 dark:text-white mb-3">{col.title}</div>
          <div
            className="flex-1 min-h-[200px] rounded-md p-2 bg-gray-50 dark:bg-gray-800"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, col.key)}
          >
            {state.issues
              .filter(i => i.status === col.key)
              .map(issue => (
                <TicketCard
                  key={issue.id}
                  issue={issue}
                  draggable
                  onDragStart={onDragStart}
                  onClick={() => openIssueDetail(issue)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Board;


