'use client';

import React, { useState } from 'react';
import { Complaint } from '../../lib/types';
import { ComplaintStatusBadge } from '../ui/ComplaintStatusBadge';
import { SeverityBadge } from '../ui/SeverityBadge';
import { StatusUpdateModal } from './StatusUpdateModal';
import { formatDate } from '../../lib/utils';
import Link from 'next/link';
import { Eye, Edit3, ThumbsUp, MapPin } from 'lucide-react';

interface Props {
  complaints: Complaint[];
  onUpdate: () => void;
}

export const AuthorityTable: React.FC<Props> = ({ complaints = [], onUpdate }) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Ticket ID</th>
              <th className="py-3.5 px-4">Issue & Locality</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Severity</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Community Support</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500 italic">
                  No complaints match current department/ward filters.
                </td>
              </tr>
            ) : (
              complaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                    {c.ticketId}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-gray-900 line-clamp-1">{c.title}</div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#F28C28]" />
                      <span>{c.ward} • {c.locality}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <SeverityBadge severity={c.severity} />
                  </td>
                  <td className="py-3.5 px-4">
                    <ComplaintStatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      <ThumbsUp className="w-3 h-3 text-[#1261A0]" />
                      {c.supportsCount} Upvotes
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/complaints/${c.id}`}
                        className="p-1.5 text-gray-600 hover:text-[#1261A0] hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setSelectedComplaint(c)}
                        className="inline-flex items-center gap-1 bg-[#F28C28] hover:bg-[#e07b18] text-white font-bold px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update Status</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedComplaint && (
        <StatusUpdateModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onSuccess={onUpdate}
        />
      )}
    </div>
  );
};
