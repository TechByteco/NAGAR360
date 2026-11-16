'use client';

import React from 'react';
import Link from 'next/link';
import { Complaint, ComplaintStatus } from '@/lib/types';
import { checkSLAStatus } from '@/lib/adapters/dbAdapter';
import { Clock, AlertTriangle, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';

interface KanbanBoardProps {
  complaints: Complaint[];
  onStatusChange: (complaintId: string, newStatus: ComplaintStatus) => void;
}

const COLUMNS: { id: ComplaintStatus; title: string; color: string; badgeBg: string }[] = [
  { id: 'submitted', title: 'New Reports', color: 'border-blue-500', badgeBg: 'bg-blue-50 text-blue-700' },
  { id: 'assigned', title: 'Assigned to Crew', color: 'border-purple-500', badgeBg: 'bg-purple-50 text-purple-700' },
  { id: 'in_progress', title: 'Work in Progress', color: 'border-amber-500', badgeBg: 'bg-amber-50 text-amber-700' },
  { id: 'resolved', title: 'Completed & Verified', color: 'border-emerald-500', badgeBg: 'bg-emerald-50 text-emerald-700' },
];

export default function KanbanBoard({ complaints, onStatusChange }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const columnComplaints = complaints.filter((c) => {
          if (col.id === 'submitted') return c.status === 'submitted' || c.status === 'under_review';
          return c.status === col.id;
        });

        return (
          <div
            key={col.id}
            className={`bg-slate-50 rounded-2xl p-3 border-t-4 ${col.color} border-slate-200 shadow-xs flex flex-col min-h-[500px]`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <h4 className="font-bold text-slate-800 text-sm">{col.title}</h4>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                {columnComplaints.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[680px] pr-1">
              {columnComplaints.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  No tickets in this stage
                </div>
              ) : (
                columnComplaints.map((c) => {
                  const sla = checkSLAStatus(c);
                  return (
                    <div
                      key={c.id}
                      className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm hover:shadow-md transition group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {c.ticketId}
                        </span>
                        {sla.isOverdue && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3 text-rose-500" /> SLA Overdue
                          </span>
                        )}
                      </div>

                      <Link href={`/complaints/${c.id}`} className="block">
                        <h5 className="font-bold text-xs text-slate-900 group-hover:text-nagar-blue transition line-clamp-2 mb-1">
                          {c.title}
                        </h5>
                      </Link>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
                        <span>{c.ward}</span>
                        <span className="font-semibold text-slate-700">{c.city}</span>
                      </div>

                      {c.contractorName && (
                        <div className="text-[10px] bg-slate-50 text-slate-600 px-2 py-1 rounded-md mb-2 truncate">
                          Contractor: {c.contractorName}
                        </div>
                      )}

                      {/* QUICK STATUS TRANSITION CONTROLS */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{sla.hoursRemaining}h SLA left</span>
                        </div>

                        {col.id === 'submitted' && (
                          <button
                            type="button"
                            onClick={() => onStatusChange(c.id, 'assigned')}
                            className="text-[10px] font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 px-2 py-1 rounded-md transition flex items-center gap-1"
                          >
                            Assign <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}

                        {col.id === 'assigned' && (
                          <button
                            type="button"
                            onClick={() => onStatusChange(c.id, 'in_progress')}
                            className="text-[10px] font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 px-2 py-1 rounded-md transition flex items-center gap-1"
                          >
                            Dispatch <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}

                        {col.id === 'in_progress' && (
                          <button
                            type="button"
                            onClick={() => onStatusChange(c.id, 'resolved')}
                            className="text-[10px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded-md transition flex items-center gap-1"
                          >
                            Resolve <CheckCircle2 className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
