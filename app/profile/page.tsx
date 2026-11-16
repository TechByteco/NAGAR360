'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../lib/adapters/authAdapter';
import { getStoredComplaints } from '../../lib/adapters/dbAdapter';
import { User, Complaint } from '../../lib/types';
import { CivicPostCard } from '../../components/complaints/CivicPostCard';
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
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

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
      <div className="bg-gradient-to-r from-[#1261A0] via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
          alt={user.fullName}
          className="w-24 h-24 rounded-full border-4 border-[#F28C28] object-cover shadow-lg"
        />

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-black">{user.fullName}</h1>
            <span className="bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              Verified Citizen
            </span>
          </div>

          <p className="text-xs text-blue-200">{user.email} • {user.city}, Tamil Nadu</p>

          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-xl flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {user.civicPoints} Civic Impact Points
            </span>
            <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-xl">
              Anna Nagar Ward 102
            </span>
          </div>
        </div>
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
          <span className="text-2xl font-black text-[#F28C28] block">{user.civicPoints}</span>
          <span className="text-xs font-bold text-gray-500 block">Community Score</span>
        </div>
      </div>

      {/* Civic Badges Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#F28C28]" />
          <span>Civic Badges & Recognition</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center shrink-0">
              🏆
            </div>
            <div>
              <div className="font-bold text-xs text-amber-900">Civic Hero</div>
              <div className="text-[11px] text-amber-700">Top 5% reporter in Chennai</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0">
              🧹
            </div>
            <div>
              <div className="font-bold text-xs text-emerald-900">Cleanliness Champion</div>
              <div className="text-[11px] text-emerald-700">Active waste management advocate</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1261A0] text-white font-bold flex items-center justify-center shrink-0">
              🛡️
            </div>
            <div>
              <div className="font-bold text-xs text-blue-900">Ward Guardian</div>
              <div className="text-[11px] text-blue-700">Ward 102 verified contributor</div>
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
    </div>
  );
}
