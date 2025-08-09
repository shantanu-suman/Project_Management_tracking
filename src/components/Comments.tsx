import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface CommentItem {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [input, setInput] = useState('');

  const addComment = () => {
    if (!input.trim()) return;
    setComments(prev => [
      { id: Date.now().toString(), author: 'You', content: input.trim(), createdAt: new Date() },
      ...prev,
    ]);
    setInput('');
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
        <MessageSquare className="h-5 w-5 mr-2" />
        Comments
      </h3>
      <div className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="Add a comment"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={addComment}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Comment
          </button>
        </div>
      </div>
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{c.author} • {c.createdAt.toLocaleString()}</div>
              <div className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{c.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;


