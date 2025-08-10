import React, { useMemo, useState } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { useApp } from '../contexts/AppContext';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
);

type Filters = {
  status: string[];
  type: string[];
  priority: string[];
  assignee: string[];
  dateRange: '7d' | '14d' | '30d' | '90d' | 'all';
};

const ReportsPage: React.FC = () => {
  const { state } = useApp();
  const [filters, setFilters] = useState<Filters>({
    status: [],
    type: [],
    priority: [],
    assignee: [],
    dateRange: '30d',
  });

  const issues = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now);
    if (filters.dateRange !== 'all') {
      const days = filters.dateRange === '7d' ? 7 : filters.dateRange === '14d' ? 14 : filters.dateRange === '30d' ? 30 : 90;
      cutoff.setDate(cutoff.getDate() - days);
    } else {
      cutoff.setFullYear(1970);
    }
    return state.issues.filter(i => {
      const withinDate = i.updated >= cutoff;
      const matchStatus = !filters.status.length || filters.status.includes(i.status);
      const matchType = !filters.type.length || filters.type.includes(i.type);
      const matchPriority = !filters.priority.length || filters.priority.includes(i.priority);
      const matchAssignee = !filters.assignee.length || (i.assignee && filters.assignee.includes(i.assignee.name));
      return withinDate && matchStatus && matchType && matchPriority && matchAssignee;
    });
  }, [state.issues, filters]);

  const by = (key: 'status' | 'priority' | 'type') => {
    return issues.reduce<Record<string, number>>((acc, i) => {
      const k = i[key];
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
  };

  const statusCounts = by('status');
  const priorityCounts = by('priority');
  const typeCounts = by('type');

  const throughputByDay = useMemo(() => {
    const m: Record<string, number> = {};
    for (const i of issues) {
      const d = new Date(i.updated.getFullYear(), i.updated.getMonth(), i.updated.getDate());
      const key = d.toISOString().slice(0, 10);
      m[key] = (m[key] || 0) + 1;
    }
    const entries = Object.entries(m).sort((a, b) => a[0].localeCompare(b[0]));
    return {
      labels: entries.map(e => e[0]),
      data: entries.map(e => e[1])
    };
  }, [issues]);

  const unique = (vals: (string | undefined | null)[]) => Array.from(new Set(vals.filter(Boolean) as string[]));
  const allAssignees = unique(state.issues.map(i => i.assignee?.name));
  const allStatuses = unique(state.issues.map(i => i.status));
  const allTypes = unique(state.issues.map(i => i.type));
  const allPriorities = unique(state.issues.map(i => i.priority));

  const toggle = (key: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(value)
        ? (prev[key] as string[]).filter(v => v !== value)
        : [...(prev[key] as string[]), value]
    }));
  };

  const kpi = (label: string, value: string | number) => (
    <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
    </div>
  );

  return (
    <div className="h-full overflow-auto p-6 bg-gray-50 dark:bg-gray-800 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Reports</h1>
        <div className="flex items-center gap-2">
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as Filters['dateRange'] })}
            className="px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="14d">Last 14 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpi('Issues', issues.length)}
        {kpi('Done', statusCounts['Done'] || 0)}
        {kpi('In Progress', statusCounts['In Progress'] || 0)}
        {kpi('Avg/day', throughputByDay.data.length ? (throughputByDay.data.reduce((a, b) => a + b, 0) / throughputByDay.data.length).toFixed(1) : 0)}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</div>
            <div className="flex flex-wrap gap-2">
              {allStatuses.map(s => (
                <button key={s} onClick={() => toggle('status', s)} className={`text-xs px-2 py-1 rounded-md border ${filters.status.includes(s) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</div>
            <div className="flex flex-wrap gap-2">
              {allTypes.map(s => (
                <button key={s} onClick={() => toggle('type', s)} className={`text-xs px-2 py-1 rounded-md border ${filters.type.includes(s) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Priority</div>
            <div className="flex flex-wrap gap-2">
              {allPriorities.map(s => (
                <button key={s} onClick={() => toggle('priority', s)} className={`text-xs px-2 py-1 rounded-md border ${filters.priority.includes(s) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Assignee</div>
            <div className="flex flex-wrap gap-2">
              {allAssignees.map(s => (
                <button key={s} onClick={() => toggle('assignee', s)} className={`text-xs px-2 py-1 rounded-md border ${filters.assignee.includes(s) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">By Status</div>
          <Pie
            data={{
              labels: Object.keys(statusCounts),
              datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#60a5fa', '#f59e0b', '#34d399', '#a78bfa', '#f87171', '#93c5fd'],
              }]
            }}
          />
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">By Priority</div>
          <Bar
            data={{
              labels: Object.keys(priorityCounts),
              datasets: [{
                label: 'Issues',
                data: Object.values(priorityCounts),
                backgroundColor: '#93c5fd',
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }}
          />
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4 lg:col-span-1">
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Throughput (by day)</div>
          <Line
            data={{
              labels: throughputByDay.labels,
              datasets: [{
                label: 'Issues updated',
                data: throughputByDay.data,
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96,165,250,0.2)'
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }}
          />
        </div>
      </div>

      {/* Type distribution */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4">
        <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">By Type</div>
        <Bar
          data={{
            labels: Object.keys(typeCounts),
            datasets: [{
              label: 'Issues',
              data: Object.values(typeCounts),
              backgroundColor: '#34d399',
            }]
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
          }}
        />
      </div>
    </div>
  );
};

export default ReportsPage;


