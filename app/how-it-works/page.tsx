import React from 'react';
import { Camera, Sparkles, MapPin, ThumbsUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#F28C28] uppercase tracking-widest block">Workflow Guide</span>
        <h1 className="text-3xl font-black text-gray-900">How Nagar360 Works</h1>
        <p className="text-xs text-gray-500 max-w-xl mx-auto">
          7-stage end-to-end civic complaint lifecycle from photo capture to citizen confirmation.
        </p>
      </div>

      <div className="space-y-4">
        {[
          { step: '1. Capture', title: 'Take a Photo', desc: 'Snap a picture of the civic problem on your mobile device.', icon: Camera, color: 'bg-blue-100 text-blue-800' },
          { step: '2. AI Inspection', title: 'AI Vision Analysis', desc: 'AI automatically categorizes the issue and scores severity.', icon: Sparkles, color: 'bg-amber-100 text-amber-800' },
          { step: '3. Geolocation', title: 'Ward Identification', desc: 'GPS pinpoint assigns exact Ward & Locality (e.g. Anna Nagar).', icon: MapPin, color: 'bg-cyan-100 text-cyan-800' },
          { step: '4. Support', title: 'Community Upvotes', desc: 'Local neighbors upvote to highlight urgent safety hazards.', icon: ThumbsUp, color: 'bg-purple-100 text-purple-800' },
          { step: '5. Dispatch', title: 'Department Assigned', desc: 'Routed directly to Greater Chennai Corporation department queue.', icon: ShieldCheck, color: 'bg-indigo-100 text-indigo-800' },
          { step: '6. Field Fix', title: 'Authority Action', desc: 'Municipal crew performs repairs and uploads photo evidence.', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-800' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0 ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">{item.step}</span>
                <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
