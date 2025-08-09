import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Issue, Sprint, Project, User } from '../types';
import { fetchTickets } from '../services/mockApi';

interface AppState {
  issues: Issue[];
  sprints: Sprint[];
  projects: Project[];
  users: User[];
  currentProject: Project | null;
  currentSprint: Sprint | null;
  selectedIssue: Issue | null;
  isCreateIssueModalOpen: boolean;
  isIssueDetailModalOpen: boolean;
  searchQuery: string;
  filters: {
    assignee: string[];
    status: string[];
    type: string[];
    priority: string[];
  };
}

type AppAction =
  | { type: 'CREATE_ISSUE'; payload: Omit<Issue, 'id' | 'key' | 'created' | 'updated'> }
  | { type: 'UPDATE_ISSUE'; payload: { id: string; updates: Partial<Issue> } }
  | { type: 'DELETE_ISSUE'; payload: string }
  | { type: 'SET_SELECTED_ISSUE'; payload: Issue | null }
  | { type: 'SET_CREATE_ISSUE_MODAL'; payload: boolean }
  | { type: 'SET_ISSUE_DETAIL_MODAL'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<AppState['filters']> }
  | { type: 'MOVE_ISSUE_TO_STATUS'; payload: { issueId: string; status: Issue['status'] } }
  | { type: 'ASSIGN_ISSUE'; payload: { issueId: string; assignee: User | null } };

const initialUsers: User[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@company.com', initials: 'SC' },
  { id: '2', name: 'Mike Johnson', email: 'mike@company.com', initials: 'MJ' },
  { id: '3', name: 'Alex Rodriguez', email: 'alex@company.com', initials: 'AR' },
  { id: '4', name: 'Emma Wilson', email: 'emma@company.com', initials: 'EW' },
  { id: '5', name: 'Chris Lee', email: 'chris@company.com', initials: 'CL' },
  { id: '6', name: 'John Smith', email: 'john@company.com', initials: 'JS' },
  { id: '7', name: 'Emily Davis', email: 'emily@company.com', initials: 'ED' },
  { id: '8', name: 'Lisa Wang', email: 'lisa@company.com', initials: 'LW' },
];

const initialProject: Project = {
  id: '1',
  key: 'PROJ',
  name: 'Project Alpha',
  avatar: '🚀',
  description: 'Main project for the team'
};

const initialSprint: Sprint = {
  id: '1',
  name: 'Sprint 1',
  startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  status: 'active',
  issues: ['1', '2', '3', '4', '5', '6']
};

const initialIssues: Issue[] = [
  {
    id: '1',
    key: 'PROJ-123',
    summary: 'Implement user authentication system with OAuth integration',
    description: 'Create a comprehensive authentication system that supports OAuth providers like Google, GitHub, and Microsoft.',
    type: 'Story',
    status: 'In Progress',
    priority: 'High',
    assignee: { name: 'Sarah Chen', avatar: '', initials: 'SC' },
    reporter: { name: 'John Smith', initials: 'JS' },
    created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updated: new Date(Date.now() - 60 * 60 * 1000),
    storyPoints: 8,
    sprint: '1'
  },
  {
    id: '2',
    key: 'PROJ-124',
    summary: 'Fix memory leak in data processing module',
    description: 'Investigate and fix the memory leak that occurs during large data processing operations.',
    type: 'Bug',
    status: 'To Do',
    priority: 'Highest',
    assignee: { name: 'Mike Johnson', avatar: '', initials: 'MJ' },
    reporter: { name: 'Emily Davis', initials: 'ED' },
    created: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updated: new Date(Date.now() - 3 * 60 * 60 * 1000),
    sprint: '1'
  },
  {
    id: '3',
    key: 'PROJ-125',
    summary: 'Update API documentation for v2.0 endpoints',
    description: 'Comprehensive update of API documentation to reflect all changes in version 2.0.',
    type: 'Task',
    status: 'Done',
    priority: 'Medium',
    assignee: { name: 'Alex Rodriguez', avatar: '', initials: 'AR' },
    reporter: { name: 'Lisa Wang', initials: 'LW' },
    created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    storyPoints: 3,
    sprint: '1'
  },
  {
    id: '4',
    key: 'PROJ-126',
    summary: 'Mobile app redesign and UX improvements',
    description: 'Complete redesign of the mobile application with focus on user experience and modern design patterns.',
    type: 'Epic',
    status: 'In Progress',
    priority: 'High',
    assignee: null,
    reporter: { name: 'David Kim', initials: 'DK' },
    created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updated: new Date(Date.now() - 4 * 60 * 60 * 1000),
    storyPoints: 21,
    sprint: '1'
  },
  {
    id: '5',
    key: 'PROJ-127',
    summary: 'Database performance optimization',
    description: 'Optimize database queries and indexes to improve overall application performance.',
    type: 'Task',
    status: 'In Review',
    priority: 'Medium',
    assignee: { name: 'Emma Wilson', avatar: '', initials: 'EW' },
    reporter: { name: 'Tom Brown', initials: 'TB' },
    created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updated: new Date(Date.now() - 30 * 60 * 1000),
    storyPoints: 5,
    sprint: '1'
  },
  {
    id: '6',
    key: 'PROJ-128',
    summary: 'Login page crashes on mobile Safari',
    description: 'Users report that the login page crashes when accessed through mobile Safari browser.',
    type: 'Bug',
    status: 'To Do',
    priority: 'High',
    assignee: { name: 'Chris Lee', avatar: '', initials: 'CL' },
    reporter: { name: 'Anna Taylor', initials: 'AT' },
    created: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sprint: '1'
  }
];

const initialState: AppState = {
  issues: initialIssues,
  sprints: [initialSprint],
  projects: [initialProject],
  users: initialUsers,
  currentProject: initialProject,
  currentSprint: initialSprint,
  selectedIssue: null,
  isCreateIssueModalOpen: false,
  isIssueDetailModalOpen: false,
  searchQuery: '',
  filters: {
    assignee: [],
    status: [],
    type: [],
    priority: []
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'CREATE_ISSUE': {
      const newIssue: Issue = {
        ...action.payload,
        id: Date.now().toString(),
        key: `${state.currentProject?.key}-${state.issues.length + 129}`,
        created: new Date(),
        updated: new Date(),
        sprint: state.currentSprint?.id
      };
      return {
        ...state,
        issues: [...state.issues, newIssue],
        isCreateIssueModalOpen: false
      };
    }
    case 'UPDATE_ISSUE': {
      return {
        ...state,
        issues: state.issues.map(issue =>
          issue.id === action.payload.id
            ? { ...issue, ...action.payload.updates, updated: new Date() }
            : issue
        )
      };
    }
    case 'DELETE_ISSUE': {
      return {
        ...state,
        issues: state.issues.filter(issue => issue.id !== action.payload),
        selectedIssue: state.selectedIssue?.id === action.payload ? null : state.selectedIssue
      };
    }
    case 'SET_SELECTED_ISSUE': {
      return {
        ...state,
        selectedIssue: action.payload
      };
    }
    case 'SET_CREATE_ISSUE_MODAL': {
      return {
        ...state,
        isCreateIssueModalOpen: action.payload
      };
    }
    case 'SET_ISSUE_DETAIL_MODAL': {
      return {
        ...state,
        isIssueDetailModalOpen: action.payload
      };
    }
    case 'SET_SEARCH_QUERY': {
      return {
        ...state,
        searchQuery: action.payload
      };
    }
    case 'SET_FILTERS': {
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    }
    case 'HYDRATE_ISSUES' as any: {
      // Action used internally by provider to replace issues with hydrated ones
      const issues = (action as any).payload as Issue[];
      return {
        ...state,
        issues,
      } as AppState;
    }
    case 'MOVE_ISSUE_TO_STATUS': {
      return {
        ...state,
        issues: state.issues.map(issue =>
          issue.id === action.payload.issueId
            ? { ...issue, status: action.payload.status, updated: new Date() }
            : issue
        )
      };
    }
    case 'ASSIGN_ISSUE': {
      return {
        ...state,
        issues: state.issues.map(issue =>
          issue.id === action.payload.issueId
            ? { 
                ...issue, 
                assignee: action.payload.assignee ? {
                  name: action.payload.assignee.name,
                  avatar: action.payload.assignee.avatar || '',
                  initials: action.payload.assignee.initials
                } : null,
                updated: new Date() 
              }
            : issue
        )
      };
    }
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  createIssue: (issue: Omit<Issue, 'id' | 'key' | 'created' | 'updated'>) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
  moveIssueToStatus: (issueId: string, status: Issue['status']) => void;
  assignIssue: (issueId: string, assignee: User | null) => void;
  openCreateIssueModal: () => void;
  closeCreateIssueModal: () => void;
  openIssueDetail: (issue: Issue) => void;
  closeIssueDetail: () => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<AppState['filters']>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Optional: hydrate from mock API once on load (non-blocking)
  useEffect(() => {
    (async () => {
      try {
        const tickets = await fetchTickets();
        if (tickets && tickets.length > 0) {
          const mapped: Issue[] = tickets.map(t => ({
            id: t.id,
            key: t.key,
            summary: t.summary,
            description: t.description,
            type: t.type,
            status: t.status,
            priority: t.priority,
            assignee: t.assignee,
            reporter: t.reporter,
            created: new Date(t.created),
            updated: new Date(t.updated),
            storyPoints: t.storyPoints,
            labels: t.labels,
            sprint: t.sprint,
          }));
          // Replace the initial demo issues with mock API issues for consistency
          (dispatch as React.Dispatch<any>)({ type: 'HYDRATE_ISSUES', payload: mapped });
        }
      } catch (_) {
        // ignore mock load errors
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createIssue = (issue: Omit<Issue, 'id' | 'key' | 'created' | 'updated'>) => {
    dispatch({ type: 'CREATE_ISSUE', payload: issue });
  };

  const updateIssue = (id: string, updates: Partial<Issue>) => {
    dispatch({ type: 'UPDATE_ISSUE', payload: { id, updates } });
  };

  const deleteIssue = (id: string) => {
    dispatch({ type: 'DELETE_ISSUE', payload: id });
  };

  const moveIssueToStatus = (issueId: string, status: Issue['status']) => {
    dispatch({ type: 'MOVE_ISSUE_TO_STATUS', payload: { issueId, status } });
  };

  const assignIssue = (issueId: string, assignee: User | null) => {
    dispatch({ type: 'ASSIGN_ISSUE', payload: { issueId, assignee } });
  };

  const openCreateIssueModal = () => {
    dispatch({ type: 'SET_CREATE_ISSUE_MODAL', payload: true });
  };

  const closeCreateIssueModal = () => {
    dispatch({ type: 'SET_CREATE_ISSUE_MODAL', payload: false });
  };

  const openIssueDetail = (issue: Issue) => {
    dispatch({ type: 'SET_SELECTED_ISSUE', payload: issue });
    dispatch({ type: 'SET_ISSUE_DETAIL_MODAL', payload: true });
  };

  const closeIssueDetail = () => {
    dispatch({ type: 'SET_ISSUE_DETAIL_MODAL', payload: false });
    dispatch({ type: 'SET_SELECTED_ISSUE', payload: null });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const setFilters = (filters: Partial<AppState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const value: AppContextType = {
    state,
    dispatch,
    createIssue,
    updateIssue,
    deleteIssue,
    moveIssueToStatus,
    assignIssue,
    openCreateIssueModal,
    closeCreateIssueModal,
    openIssueDetail,
    closeIssueDetail,
    setSearchQuery,
    setFilters
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};