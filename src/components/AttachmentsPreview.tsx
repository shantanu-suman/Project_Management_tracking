import React from 'react';

export interface AttachmentItem {
  id: string;
  name: string;
  url?: string;
  type: string;
  size: number; // bytes
}

const humanSize = (b: number) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

const AttachmentsPreview: React.FC<{ attachments?: AttachmentItem[] }> = ({ attachments }) => {
  const list = attachments || [];
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Attachments</h3>
      {list.length === 0 ? (
        <div className="text-xs text-gray-500 dark:text-gray-400">No attachments</div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {list.map(a => (
            <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 border rounded-md text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <span className="truncate mr-2">{a.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{a.type} • {humanSize(a.size)}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentsPreview;


