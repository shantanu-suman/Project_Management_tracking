import React from 'react';
import { Issue } from '../types';

interface TicketCardProps {
  issue: Issue;
  onClick?: (issue: Issue) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ issue, onClick, draggable, onDragStart }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={draggable ? (e) => onDragStart && onDragStart(e, issue.id) : undefined}
      onClick={() => onClick && onClick(issue)}
      className="cursor-pointer mb-2 p-3 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow transition"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{issue.key}</div>
        {issue.storyPoints ? (
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full">
            {issue.storyPoints}
          </span>
        ) : null}
      </div>
      <div className="text-sm text-gray-900 dark:text-white mt-1">{issue.summary}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {issue.assignee ? (
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-medium leading-none">{issue.assignee.initials}</span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{issue.assignee.name}</span>
            </div>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">Unassigned</span>
          )}
        </div>
        <div className="text-[10px] text-gray-500 dark:text-gray-400">{issue.priority}</div>
      </div>
    </div>
  );
};

export default TicketCard;


