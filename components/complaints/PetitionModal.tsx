'use client';

import React, { useState } from 'react';
import { Users, FileCheck, CheckCircle2, X, Send } from 'lucide-react';
import { Complaint } from '@/lib/types';
import { signPetition } from '@/lib/adapters/dbAdapter';

interface PetitionModalProps {
  complaint: Complaint;
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onSigned?: (newCount: number) => void;
}

export default function PetitionModal({
  complaint,
  currentUserId,
  isOpen,
  onClose,
  onSigned,
}: PetitionModalProps) {
  const [signed, setSigned] = useState(
    complaint.supportedUserIds?.includes(currentUserId) || false
  );
  const [count, setCount] = useState(complaint.petitionCount || complaint.supportsCount || 1);
  const targetSignatures = 50;

  if (!isOpen) return null;

  const handleSign = () => {
    const res = signPetition(complaint.id, currentUserId);
    setSigned(res.signed);
    setCount(res.count);
    if (onSigned) onSigned(res.count);
  };

  const progressPercent = Math.min(100, Math.round((count / targetSignatures) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-nagar-blue/10 flex items-center justify-center text-nagar-blue">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-saffron-orange uppercase tracking-wider">
              Collective Civic Action
            </span>
            <h3 className="font-bold text-slate-900 text-lg">Community Ward Petition</h3>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4">
          <h4 className="font-bold text-slate-800 text-sm mb-1">{complaint.title}</h4>
          <p className="text-xs text-slate-600 line-clamp-2">{complaint.description}</p>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <span>Ward: <strong>{complaint.ward}</strong></span>
            <span>•</span>
            <span>Locality: <strong>{complaint.locality}</strong></span>
          </div>
        </div>

        {/* PETITION PROGRESS */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-slate-700">{count} Citizen Signatures</span>
            <span className="text-saffron-orange">Goal: {targetSignatures}</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-nagar-blue to-saffron-orange transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            When this petition reaches 50 signatures, a high-priority formal memorandum is automatically delivered to the Zonal Commissioner & Ward Councillor.
          </p>
        </div>

        {/* ACTION BUTTON */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSign}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md ${
              signed
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-nagar-blue text-white shadow-blue-200 hover:bg-nagar-blue/95'
            }`}
          >
            {signed ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> You Signed This Petition
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" /> Sign Ward Petition
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
