'use client';

import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintCategory } from '../../lib/types';
import { getStoredComplaints } from '../../lib/adapters/dbAdapter';
import { CivicPostCard } from '../../components/complaints/CivicPostCard';
import {
  Search,
  Filter,
  PlusCircle,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Award,
} from 'lucide-react';
import Link from 'next/link';

export default function FeedPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'supported' | 'urgent' | 'resolved'>('latest');

  const loadData = () => {
    setComplaints(getStoredComplaints());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('nagar360_store_update', loadData);
    return () => window.removeEventListener('nagar360_store_update', loadData);
  }, []);

  const filtered = complaints.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      const matchText = (c.title + c.description + c.locality + c.ward + c.ticketId + c.category).toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (selectedWard !== 'all' && c.ward !== selectedWard) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'supported') return b.supportsCount - a.supportsCount;
    if (sortBy === 'urgent') {
      const pMap = { critical: 4, high: 3, medium: 2, low: 1 };
      return pMap[b.severity] - pMap[a.severity];
    }
    if (sortBy === 'resolved') {
      if (a.status === 'resolved' && b.status !== 'resolved') return -1;
      if (b.status === 'resolved' && a.status !== 'resolved') return 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#1261A0] to-slate-900 text-white p-6 rounded-3xl shadow-lg">
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-1">
            Live Civic Network • Chennai, TN
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Community Action & Complaints Feed</h1>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            See real-time civic issues reported by residents across Anna Nagar, T. Nagar, Adyar, Velachery, and OMR. Upvote to elevate priority.
          </p>
        </div>
        <Link
          href="/raise-problem"
          className="bg-[#F28C28] hover:bg-[#e07b18] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-md shadow-orange-500/30 transition-all flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Problem</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-5">
          {/* Search & Sort Control Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complaints by title, ward, locality (e.g. Anna Nagar), or Ticket ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Sort:
              </span>
              {(['latest', 'supported', 'urgent', 'resolved'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortBy(mode)}
                  className={`px-3 py-1 rounded-xl font-bold capitalize transition-all shrink-0 ${
                    sortBy === mode
                      ? 'bg-[#1261A0] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mode === 'supported' ? 'Most Supported' : mode}
                </button>
              ))}
            </div>

            {/* Category Dropdown & Ward Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-gray-100 text-xs">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-800"
              >
                <option value="all">All Categories</option>
                <option value="Pothole">Pothole</option>
                <option value="Garbage Accumulation">Garbage Accumulation</option>
                <option value="Broken Streetlight">Broken Streetlight</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Blocked Drainage">Blocked Drainage</option>
                <option value="Fallen Tree">Fallen Tree</option>
                <option value="Damaged Footpath">Damaged Footpath</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-800"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-800"
              >
                <option value="all">All Wards / Localities</option>
                <option value="Ward 102">Ward 102 (Anna Nagar)</option>
                <option value="Ward 136">Ward 136 (T. Nagar)</option>
                <option value="Ward 173">Ward 173 (Adyar)</option>
                <option value="Ward 178">Ward 178 (Velachery)</option>
                <option value="Ward 111">Ward 111 (Royapettah)</option>
                <option value="Ward 176">Ward 176 (Besant Nagar)</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          {sorted.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No complaints match your filter criteria</h3>
              <p className="text-xs text-gray-500">Try clearing filters or search query to view more issues.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setSelectedWard('all');
                }}
                className="text-xs font-bold text-[#1261A0] underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sorted.map((item) => (
                <CivicPostCard key={item.id} complaint={item} onUpdate={loadData} />
              ))}
            </div>
          )}
        </div>

        {/* Right Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          {/* Quick Stats Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#2E9B5B]" />
              <span>Chennai Civic Snapshot</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Tracked Complaints</span>
                <span className="font-bold text-gray-900">{complaints.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Resolved & Fixed</span>
                <span className="font-bold text-emerald-600">{complaints.filter((c) => c.status === 'resolved').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Field Operations</span>
                <span className="font-bold text-amber-600">{complaints.filter((c) => c.status === 'in_progress').length}</span>
              </div>
            </div>

            <Link
              href="/map"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs py-2 rounded-xl text-center block transition-colors"
            >
              Open Interactive City Map
            </Link>
          </div>

          {/* Top Wards */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#F28C28]" />
              <span>Top Active Wards</span>
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Ward 102 - Anna Nagar', count: 18, score: '94% Fixed' },
                { name: 'Ward 136 - T. Nagar', count: 14, score: '88% Fixed' },
                { name: 'Ward 178 - Velachery', count: 12, score: '91% Fixed' },
                { name: 'Ward 173 - Adyar', count: 9, score: '96% Fixed' },
              ].map((w) => (
                <div key={w.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <span className="font-medium text-gray-800">{w.name}</span>
                  <span className="font-bold text-emerald-700">{w.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
