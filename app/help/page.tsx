import React from 'react';
import { HelpCircle, Shield, AlertOctagon, Lock, EyeOff } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-black text-gray-900">Help & FAQs</h1>
        <p className="text-xs text-gray-500 max-w-xl mx-auto">
          Learn about location consent, privacy protections, AI inspection ethics, and emergency guidelines.
        </p>
      </div>

      {/* Emergency Disclaimer Alert */}
      <div className="bg-red-900 text-white p-6 rounded-3xl shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
          <AlertOctagon className="w-5 h-5" />
          <span>Emergency Disclaimer</span>
        </div>
        <p className="text-xs text-red-100 leading-relaxed">
          Nagar360 is not an emergency service. For immediate danger, life-threatening situation, active crime, or medical emergency, contact official emergency services immediately:
        </p>
        <div className="flex gap-4 pt-1 text-xs font-bold">
          <span className="bg-red-700 px-3 py-1.5 rounded-xl">Police Control Room: 100</span>
          <span className="bg-red-700 px-3 py-1.5 rounded-xl">National Helpline: 112</span>
          <span className="bg-red-700 px-3 py-1.5 rounded-xl">Fire: 101</span>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-sm">How does location consent work?</h3>
            <p className="text-gray-600 leading-relaxed">
              Your browser requests Geolocation permission only to identify the nearest Ward & Locality in Chennai. You can also pick a location on the interactive map manually.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-sm">Is my personal information visible publicly?</h3>
            <p className="text-gray-600 leading-relaxed">
              No. You can check "Submit Anonymously" when filing a complaint to hide your full name. Your phone number and email are never disclosed to the public feed.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-sm">What is Demo Mode?</h3>
            <p className="text-gray-600 leading-relaxed">
              Nagar360 features a full offline-capable Demo Mode with realistic seeded Chennai complaints so hackathon judges can test all features smoothly without requiring external API keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
