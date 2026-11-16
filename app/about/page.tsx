import React from 'react';
import { NagarLogo } from '../../components/ui/NagarLogo';
import { ShieldCheck, Users, Sparkles, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <NagarLogo size="lg" className="justify-center mb-2" />
        <h1 className="text-3xl font-black text-gray-900">About Nagar360</h1>
        <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
          Nagar360 ("Namma Nagar, Namma Poruppu") is a civic social network and AI-powered complaint resolution platform designed specifically for Indian municipal governance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1261A0] mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">AI-Powered Efficiency</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Computer vision models automatically inspect citizen uploads, classify issue category, assess severity risk, and suggest municipal department routing.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#F28C28] mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Community Upvotes</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Citizens upvote and verify local complaints in their locality, elevating critical community issues to municipal authority priority queues.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#2E9B5B] mx-auto flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Transparent Resolution</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Municipal department workers upload resolution photo evidence and official progress notes for complete public accountability.
          </p>
        </div>
      </div>
    </div>
  );
}
