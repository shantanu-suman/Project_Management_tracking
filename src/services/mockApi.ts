// Very small mock API layer. In a real backend switch, replace base fetch calls.

export interface MockIssueDTO {
  id: string;
  key: string;
  summary: string;
  description?: string;
  type: 'Story' | 'Bug' | 'Task' | 'Epic';
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Lowest' | 'Low' | 'Medium' | 'High' | 'Highest';
  assignee: { name: string; avatar: string; initials: string } | null;
  reporter: { name: string; initials: string };
  created: string;
  updated: string;
  storyPoints?: number;
  labels?: string[];
  sprint?: string;
}

const BASE = '/mock';

export async function fetchTickets(): Promise<MockIssueDTO[]> {
  const res = await fetch(`${BASE}/tickets.json`);
  if (!res.ok) throw new Error('Failed to fetch tickets');
  const data = await res.json();
  return data.tickets as MockIssueDTO[];
}


