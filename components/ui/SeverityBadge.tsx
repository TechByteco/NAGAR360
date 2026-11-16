import React from 'react';
import { Severity } from '../../lib/types';
import { getSeverityStyle } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

interface Props {
  severity: Severity;
}

export const SeverityBadge: React.FC<Props> = ({ severity }) => {
  const style = getSeverityStyle(severity);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border ${style.bg} ${style.text}`}
    >
      <AlertCircle className="w-3 h-3" />
      <span>{style.label}</span>
    </span>
  );
};
