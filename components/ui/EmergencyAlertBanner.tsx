'use client';

import React, { useState } from 'react';
import { AlertCircle, PhoneCall, ChevronRight, X } from 'lucide-react';

export default function EmergencyAlertBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-saffron-orange to-rose-600 text-white text-xs px-4 py-2.5 shadow-md flex items-center justify-between relative z-40">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0">
            Civic Alert
          </span>
          <p className="font-medium truncate text-white/95">
            <strong>Monsoon Watch:</strong> Low-lying stormwater desilting active statewide. GCC Central Control Room 24x7 Helpline: <strong>1913</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:1913"
            className="hidden sm:inline-flex items-center gap-1.5 bg-white text-slate-900 font-bold px-3 py-1 rounded-full text-[11px] shadow hover:bg-slate-100 transition"
          >
            <PhoneCall className="w-3 h-3 text-rose-600" /> Call 1913
          </a>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full hover:bg-white/20 text-white transition"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
