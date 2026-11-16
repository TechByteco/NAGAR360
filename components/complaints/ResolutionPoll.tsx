'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { ResolutionVerification } from '@/lib/types';
import { voteResolutionVerification } from '@/lib/adapters/dbAdapter';

interface ResolutionPollProps {
  complaintId: string;
  currentUserId: string;
  verification?: ResolutionVerification;
  onVoteChange?: (updated: ResolutionVerification) => void;
}

export default function ResolutionPoll({
  complaintId,
  currentUserId,
  verification,
  onVoteChange,
}: ResolutionPollProps) {
  const [data, setData] = useState<ResolutionVerification>(
    verification || {
      confirmedFixedCount: 0,
      stillBrokenCount: 0,
      confirmedUserIds: [],
      disputedUserIds: [],
      isCitizenVerified: false,
    }
  );
  const [submitting, setSubmitting] = useState(false);

  const isConfirmed = data.confirmedUserIds?.includes(currentUserId);
  const isDisputed = data.disputedUserIds?.includes(currentUserId);
  const totalVotes = (data.confirmedFixedCount || 0) + (data.stillBrokenCount || 0);
  const confirmedPercent = totalVotes > 0 ? Math.round(((data.confirmedFixedCount || 0) / totalVotes) * 100) : 0;

  const handleVote = (isFixed: boolean) => {
    setSubmitting(true);
    const updatedComplaint = voteResolutionVerification(complaintId, currentUserId, isFixed);
    if (updatedComplaint?.resolutionVerification) {
      setData(updatedComplaint.resolutionVerification);
      if (onVoteChange) {
        onVoteChange(updatedComplaint.resolutionVerification);
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-2xl p-5 border border-emerald-200/80 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h4 className="font-bold text-slate-900 text-sm md:text-base">
            Citizen Verification Audit
          </h4>
        </div>
        {data.isCitizenVerified ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5" /> Verified by Locality
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5" /> Community Audit Pending
          </span>
        )}
      </div>

      <p className="text-xs text-slate-600 mb-4">
        Corporation authorities reported this issue as resolved. Did you visit this street? Please confirm whether the repair was genuinely completed.
      </p>

      {/* PROGRESS BAR */}
      <div className="mb-4">
        <div className="flex justify-between text-xs font-semibold mb-1">
          <span className="text-emerald-700">{data.confirmedFixedCount} Confirmed Fixed ({confirmedPercent}%)</span>
          <span className="text-rose-700">{data.stillBrokenCount} Disputed / Incomplete</span>
        </div>
        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${confirmedPercent}%` }}
          />
          <div
            className="h-full bg-rose-500 transition-all duration-500"
            style={{ width: `${100 - confirmedPercent}%` }}
          />
        </div>
      </div>

      {/* VOTE BUTTONS */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleVote(true)}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs md:text-sm border transition ${
            isConfirmed
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          {isConfirmed ? 'You Confirmed Fixed' : 'Yes, Fixed Properly'}
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={() => handleVote(false)}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs md:text-sm border transition ${
            isDisputed
              ? 'bg-rose-600 text-white border-rose-600 shadow-md'
              : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50'
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          {isDisputed ? 'You Disputed Fix' : 'Still Broken / Poor Quality'}
        </button>
      </div>
    </div>
  );
}
