import React from 'react';
import { AIAnalysisResult } from '../../lib/types';
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  analysis: AIAnalysisResult;
}

export const AIAnalysisCard: React.FC<Props> = ({ analysis }) => {
  return (
    <div className="bg-gradient-to-br from-blue-900 via-[#1261A0] to-slate-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-400 text-slate-900 rounded-lg">
            <Sparkles className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight">AI Vision Inspection Engine</h4>
            <p className="text-[11px] text-blue-200">
              Auto-categorized with {Math.round(analysis.confidence * 100)}% AI confidence score
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-mono bg-blue-800/80 px-2 py-1 rounded text-blue-200 border border-blue-600">
          Demo AI Model
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white/10 p-3 rounded-xl border border-white/10">
          <span className="text-[10px] text-blue-200 uppercase tracking-wider block mb-1">
            Detected Category
          </span>
          <span className="text-base font-bold text-amber-300 block">{analysis.category}</span>
          <span className="text-xs text-blue-100">{analysis.subcategory}</span>
        </div>

        <div className="bg-white/10 p-3 rounded-xl border border-white/10">
          <span className="text-[10px] text-blue-200 uppercase tracking-wider block mb-1">
            Suggested Ward Department
          </span>
          <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            {analysis.suggestedDepartment}
          </span>
        </div>
      </div>

      <p className="text-xs text-blue-100 bg-black/20 p-3 rounded-xl border border-white/10 mb-3 leading-relaxed">
        "{analysis.explanation}"
      </p>

      {/* Mandatory Disclaimer */}
      <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 p-2.5 rounded-xl text-amber-200 text-xs font-medium">
        <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
        <span>AI-generated suggestion — verify details before submitting.</span>
      </div>
    </div>
  );
};
