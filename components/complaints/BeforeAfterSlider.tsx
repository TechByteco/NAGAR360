'use client';

import React, { useState } from 'react';
import { Eye, CheckCircle2, AlertTriangle, ArrowLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImageUrl,
  afterImageUrl,
  beforeLabel = 'Reported Defect (Before)',
  afterLabel = 'Municipal Repair (After)',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-nagar-blue" />
          <h3 className="font-bold text-slate-900 text-sm md:text-base">
            Civic Resolution Evidence Slider
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Work Inspected
        </span>
      </div>

      <div
        className="relative h-72 md:h-96 w-full select-none overflow-hidden cursor-ew-resize bg-slate-900"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        {/* AFTER IMAGE (Background - Full Width) */}
        <img
          src={afterImageUrl}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute top-3 right-3 z-10 bg-emerald-700/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {afterLabel}
        </div>

        {/* BEFORE IMAGE (Clipped Overlay - Left Side) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeImageUrl}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute top-3 left-3 z-10 bg-rose-700/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            {beforeLabel}
          </div>
        </div>

        {/* SLIDER DIVIDER LINE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* DRAG HANDLE CIRCLE */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-white text-slate-800 rounded-full shadow-lg border-2 border-nagar-blue flex items-center justify-center font-bold text-xs">
            <ArrowLeftRight className="w-4 h-4 text-nagar-blue" />
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          Drag slider horizontally to compare before vs after repair.
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSliderPosition(0)}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100 font-medium transition"
          >
            Show After
          </button>
          <button
            type="button"
            onClick={() => setSliderPosition(50)}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100 font-medium transition"
          >
            50 / 50
          </button>
          <button
            type="button"
            onClick={() => setSliderPosition(100)}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100 font-medium transition"
          >
            Show Before
          </button>
        </div>
      </div>
    </div>
  );
}
