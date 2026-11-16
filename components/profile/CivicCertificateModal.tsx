'use client';

import React from 'react';
import { Award, Printer, Download, X, CheckCircle2, Shield } from 'lucide-react';
import { User } from '@/lib/types';

interface CivicCertificateModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function CivicCertificateModal({
  user,
  isOpen,
  onClose,
}: CivicCertificateModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CERTIFICATE CANVAS */}
        <div className="p-8 rounded-2xl border-4 border-double border-amber-600/50 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 relative text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-saffron-orange flex items-center justify-center text-white shadow-lg">
              <Award className="w-8 h-8" />
            </div>
          </div>

          <span className="text-[11px] font-bold tracking-widest text-amber-800 uppercase">
            Nagar360 Citizen Governance Initiative
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mt-1 mb-2">
            Certificate of Civic Contribution
          </h2>
          <p className="text-xs text-slate-500 italic mb-6">
            Presented in recognition of outstanding vigilance and community responsibility
          </p>

          <p className="text-xs text-slate-600 mb-1">This is proudly awarded to</p>
          <h3 className="text-xl md:text-2xl font-bold text-nagar-blue mb-4 border-b border-amber-300/80 inline-block px-8 pb-1">
            {user.fullName}
          </h3>

          <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed mb-6">
            For proactive public grievance reporting, environmental safeguarding, and community resolution verification in <strong>{user.city}, Tamil Nadu</strong>. Your contributions have directly empowered rapid civic maintenance.
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6 text-center">
            <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200/60">
              <div className="font-bold text-slate-900 text-base">{user.civicPoints}</div>
              <div className="text-[10px] text-slate-500 font-medium">Civic Karma XP</div>
            </div>
            <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200/60">
              <div className="font-bold text-slate-900 text-base">{user.verifiedReportsCount || 14}</div>
              <div className="text-[10px] text-slate-500 font-medium">Verified Issues</div>
            </div>
            <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200/60">
              <div className="font-bold text-slate-900 text-base">{user.resolutionsConfirmedCount || 8}</div>
              <div className="text-[10px] text-slate-500 font-medium">Audits Done</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-amber-200/60 text-left text-xs">
            <div>
              <div className="font-bold text-slate-800">Officer S. Sundaram, IAS</div>
              <div className="text-[10px] text-slate-500">Municipal Commissionerate</div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
              <Shield className="w-4 h-4" /> Blockchain-Sealed Proof
            </div>
          </div>
        </div>

        {/* BUTTON CONTROLS */}
        <div className="mt-4 flex gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-nagar-blue text-white text-xs font-bold hover:bg-nagar-blue/95 transition flex items-center justify-center gap-2 shadow-md shadow-blue-200"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
