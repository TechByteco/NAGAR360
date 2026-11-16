'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../lib/adapters/authAdapter';
import { getStoredComplaints } from '../../lib/adapters/dbAdapter';
import { User, Complaint } from '../../lib/types';
import { CivicPostCard } from '../../components/complaints/CivicPostCard';
import CivicCertificateModal from '../../components/profile/CivicCertificateModal';
import {
  Award,
  ThumbsUp,
  CheckCircle2,
  AlertCircle,
  Shield,
  Globe,
  Lock,
  UserCheck,
  Star,
  FileCheck,
  Sparkles,
  Download,
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setComplaints(getStoredComplaints());
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Please sign in to view your impact.</h2>
      </div>
    );
  }

  const myFiledComplaints = complaints.filter(
    (c) => c.userId === user.id || c.userName === user.fullName
  );
  const mySupportedComplaints = complaints.filter((c) =>
    (c.supportedUserIds || []).includes(user.id)
  );
  const resolvedCount = myFiledComplaints.filter((c) => c.status === 'resolved').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-[#1261A0] via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt={user.fullName}
            className="w-24 h-24 rounded-full border-4 border-[#F28C28] object-cover shadow-lg"
          />

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">{user.fullName}</h1>
              <span className="bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                Verified Citizen
              </span>
            </div>

            <p className="text-xs text-blue-200">{user.email} • {user.city}, Tamil Nadu</p>

            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-bold">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-xl flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                {user.civicPoints} Civic Karma
              </span>
              <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-xl">
                {user.karmaLevel || 'Diamond Citizen'}
              </span>
            </div>
          </div>
        </div>

        {/* OFFICIAL CERTIFICATE BUTTON */}
        <button
          type="button"
          onClick={() => setShowCertificate(true)}
          className="bg-gradient-to-r from-saffron-orange to-amber-500 hover:brightness-105 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition"
        >
          <Award className="w-4 h-4" />
          <span>Download Civic Certificate</span>
        </button>
      </div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-2xl font-black text-gray-900 block">{myFiledComplaints.length}</span>
          <span className="text-xs font-bold text-gray-500 block">Complaints Filed</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-2xl font-black text-[#1261A0] block">{mySupportedComplaints.length}</span>
          <span className="text-xs font-bold text-gray-500 block">Issues Upvoted</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-2xl font-black text-emerald-600 block">{resolvedCount}</span>
          <span className="text-xs font-bold text-gray-500 block">Issues Resolved</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-2xl font-black text-saffron-orange block">{user.resolutionsConfirmedCount || 8}</span>
          <span className="text-xs font-bold text-gray-500 block">Audits Completed</span>
        </div>
      </div>

      {/* Civic Badges Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#F28C28]" />
            <span>Earned Civic Badges & Honors</span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold">5 Badges Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center text-xl shrink-0 shadow-xs">
              🚨
            </div>
            <div>
              <div className="font-bold text-xs text-amber-950">First Responder</div>
              <div className="text-[10px] text-amber-800 mt-0.5">Reported 5+ urgent public safety hazards within 1 hour.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xl shrink-0 shadow-xs">
              🌱
            </div>
            <div>
              <div className="font-bold text-xs text-emerald-950">Clean Ward Champion</div>
              <div className="text-[10px] text-emerald-800 mt-0.5">Neighborhood waste cleanup advocate & tree plantation volunteer.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#1261A0] text-white font-bold flex items-center justify-center text-xl shrink-0 shadow-xs">
              🛣️
            </div>
            <div>
              <div className="font-bold text-xs text-blue-950">Road Guardian</div>
              <div className="text-[10px] text-blue-800 mt-0.5">Pothole reports resulting in municipal asphalt recarpeting.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-xl shrink-0 shadow-xs">
              ✅
            </div>
            <div>
              <div className="font-bold text-xs text-teal-950">Civic Auditor</div>
              <div className="text-[10px] text-teal-800 mt-0.5">Audited and verified 8+ completed corporation repair works.</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xl shrink-0 shadow-xs">
              🌊
            </div>
            <div>
              <div className="font-bold text-xs text-indigo-950">Monsoon Sentinel</div>
              <div className="text-[10px] text-indigo-800 mt-0.5">Active monitoring of stormwater conduit blockages in flood basins.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity History Stream */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900">My Activity Stream</h3>
        {myFiledComplaints.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-xs text-gray-500 italic">
            You haven't filed any complaints yet. Use the "Report an Issue" button to start!
          </div>
        ) : (
          <div className="space-y-4">
            {myFiledComplaints.map((item) => (
              <CivicPostCard key={item.id} complaint={item} />
            ))}
          </div>
        )}
      </div>

      {/* CERTIFICATE MODAL */}
      <CivicCertificateModal
        user={user}
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
      />
    </div>
  );
}
