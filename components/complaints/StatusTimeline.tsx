import React from 'react';
import { StatusHistory } from '../../lib/types';
import { formatDate } from '../../lib/utils';
import { ComplaintStatusBadge } from '../ui/ComplaintStatusBadge';
import { CheckCircle2, User, Image as ImageIcon } from 'lucide-react';

interface Props {
  history: StatusHistory[];
  resolutionNote?: string;
  resolutionImageUrl?: string;
}

export const StatusTimeline: React.FC<Props> = ({
  history,
  resolutionNote,
  resolutionImageUrl,
}) => {
  if (!history || history.length === 0) {
    return <p className="text-xs text-gray-500 italic">No timeline events recorded yet.</p>;
  }

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gray-200">
      {history.map((item, idx) => (
        <div key={item.id || idx} className="relative flex items-start gap-4 pl-8 group">
          {/* Node Icon */}
          <div
            className={`absolute left-0 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border-2 bg-white ${
              idx === 0
                ? 'border-[#1261A0] text-[#1261A0] shadow-sm ring-4 ring-blue-50'
                : 'border-gray-300 text-gray-400'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
          </div>

          <div className="flex-1 bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <ComplaintStatusBadge status={item.status} size="sm" />
              <span className="text-[11px] text-gray-500 font-medium">
                {formatDate(item.createdAt)}
              </span>
            </div>

            {item.note && (
              <p className="text-xs text-gray-700 leading-relaxed font-normal mb-2">
                {item.note}
              </p>
            )}

            {/* Resolution image if present in event */}
            {(item.resolutionImageUrl || (item.status === 'resolved' && resolutionImageUrl)) && (
              <div className="mt-2.5 p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 mb-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  Resolution Evidence Photo
                </span>
                <img
                  src={item.resolutionImageUrl || resolutionImageUrl}
                  alt="Resolution Evidence"
                  className="w-full max-h-48 object-cover rounded-lg border border-emerald-300"
                />
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-2">
              <User className="w-3 h-3 text-gray-400" />
              <span>Updated by <strong className="text-gray-700">{item.updatedByName}</strong></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
