import React from 'react';
import { useApp } from '../contexts/AppContext';

const FiltersBar: React.FC = () => {
  const { state, setFilters } = useApp();

  const assignees = Array.from(new Set(state.issues.map(i => i.assignee?.name).filter(Boolean))) as string[];
  const statuses = Array.from(new Set(state.issues.map(i => i.status)));
  const types = Array.from(new Set(state.issues.map(i => i.type)));
  const priorities = Array.from(new Set(state.issues.map(i => i.priority)));

  const toggle = (key: keyof typeof state.filters, value: string) => {
    const current = state.filters[key];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFilters({ [key]: next });
  };

  const Section: React.FC<{ title: string; items: string[]; keyName: keyof typeof state.filters }>
    = ({ title, items, keyName }) => (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">{title}:</span>
        {items.map(val => (
          <label key={val} className={`text-xs px-2 py-1 rounded-md border cursor-pointer select-none ${
            state.filters[keyName].includes(val)
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 text-blue-700 dark:text-blue-300'
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            <input
              type="checkbox"
              className="hidden"
              checked={state.filters[keyName].includes(val)}
              onChange={() => toggle(keyName, val)}
            />
            {val}
          </label>
        ))}
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900 mx-6 mt-4 rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2">
      <div className="flex gap-4 flex-wrap">
        <Section title="Assignee" items={assignees} keyName="assignee" />
        <Section title="Status" items={statuses} keyName="status" />
        <Section title="Type" items={types} keyName="type" />
        <Section title="Priority" items={priorities} keyName="priority" />
      </div>
    </div>
  );
};

export default FiltersBar;


