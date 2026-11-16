import React from 'react';
import { ComplaintStatus } from '../../lib/types';
import { getStatusStyle } from '../../lib/utils';
import { CheckCircle2, Clock, UserCheck, AlertTriangle, XCircle, Copy } from 'lucide-react';

interface Props {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
}

export const ComplaintStatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const style = getStatusStyle(status);

  const getIcon = () => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-3.5 h-3.5" />;
      case 'under_review':
        return <Clock className="w-3.5 h-3.5 text-purple-600" />;
      case 'assigned':
        return <UserCheck className="w-3.5 h-3.5" />;
      case 'in_progress':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-spin" />;
      case 'resolved':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'rejected':
        return <XCircle className="w-3.5 h-3.5" />;
      case 'duplicate':
        return <Copy className="w-3.5 h-3.5" />;
    }
  };

  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.text} ${px} shadow-xs`}
    >
      {getIcon()}
      <span>{style.label}</span>
    </span>
  );
};
