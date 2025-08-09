export interface Issue {
  id: string;
  key: string;
  summary: string;
  description?: string;
  type: 'Story' | 'Bug' | 'Task' | 'Epic';
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Lowest' | 'Low' | 'Medium' | 'High' | 'Highest';
  assignee: {
    name: string;
    avatar: string;
    initials: string;
  } | null;
  reporter: {
    name: string;
    initials: string;
  };
  created: Date;
  updated: Date;
  storyPoints?: number;
  labels?: string[];
  sprint?: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'future';
  issues: string[];
}

export interface Project {
  id: string;
  key: string;
  name: string;
  avatar: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar?: string;
}