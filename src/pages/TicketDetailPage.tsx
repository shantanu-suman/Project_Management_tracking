import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import TicketPage from '../components/TicketPage';

const TicketDetailPage: React.FC = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { state, openIssueDetail, closeIssueDetail } = useApp();

  const issue = state.issues.find(i => i.id === ticketId || i.key === ticketId);

  React.useEffect(() => {
    if (!issue) navigate('/tickets');
  }, [ticketId]);

  return (
    <div className="h-full overflow-auto bg-white dark:bg-gray-900">
      {issue && (
        <TicketPage
          issue={issue}
          onSave={(updates) => updateIssue(issue.id, updates)}
          onDelete={() => { deleteIssue(issue.id); navigate('/tickets'); }}
        />
      )}
    </div>
  );
};

export default TicketDetailPage;


