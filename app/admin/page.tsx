'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredComplaints, getAuthorityMetrics } from '../../lib/adapters/dbAdapter';
import { getCurrentUser, getOfficialCredentials, signOutUser } from '../../lib/adapters/authAdapter';
import { Complaint, AuthorityMetrics } from '../../lib/types';
import { AuthorityTable } from '../../components/admin/AuthorityTable';
import { ChangeCredentialsModal } from '../../components/admin/ChangeCredentialsModal';
import {
  ShieldCheck,
  Filter,
  RefreshCcw,
  Key,
  LogOut,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(getCurrentUser());
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [metrics, setMetrics] = useState<AuthorityMetrics | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCredsModal, setShowCredsModal] = useState(false);

  const loadData = () => {
    const u = getCurrentUser();
    setUser(u);
    // Strict Access Control Guard: Erase public entry to authority page
    if (!u || u.role !== 'official') {
      router.push('/authority/login');
      return;
    }
    const list = getStoredComplaints();
    setComplaints(list);
    setMetrics(getAuthorityMetrics());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('nagar360_store_update', loadData);
    window.addEventListener('nagar360_auth_update', loadData);
    return () => {
      window.removeEventListener('nagar360_store_update', loadData);
      window.removeEventListener('nagar360_auth_update', loadData);
    };
  }, []);

  if (!user || user.role !== 'official') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Restricted Authority Area</h2>
        <p className="text-xs text-gray-500">
          Public entry is restricted. Please sign in with official credentials.
        </p>
        <Link
          href="/authority/login"
          className="inline-block bg-[#F28C28] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
        >
          Go to Authority Login
        </Link>
      </div>
    );
  }

  const activeCreds = getOfficialCredentials();

  const handleSignOut = () => {
    signOutUser();
    router.push('/authority/login');
  };

  const filtered = complaints.filter((c) => {
    if (selectedDept !== 'all' && c.assignedDepartment !== selectedDept) return false;
    if (selectedWard !== 'all' && c.ward !== selectedWard) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1261A0] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Greater Chennai Corporation (GCC) Executive Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Authority Operations Dashboard</h1>
          <p className="text-xs text-blue-200">
            Triage, assign, and update civic issue complaints across Chennai & TN zones in real time.
          </p>
        </div>

        {/* User Credentials Management Box */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-2 shrink-0 text-xs">
          <div className="text-[10px] uppercase font-bold text-blue-200">Logged Officer ID</div>
          <div className="font-mono font-bold text-amber-300 text-sm">{activeCreds.userId}</div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setShowCredsModal(true)}
              className="bg-[#F28C28] hover:bg-[#e07b18] text-white px-3 py-1 rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Change Credentials</span>
            </button>
            <button
              onClick={handleSignOut}
              className="bg-red-600/80 hover:bg-red-700 text-white px-2.5 py-1 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-colors"
              title="Sign Out of Authority Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Total Complaints</span>
            <span className="text-2xl font-black text-gray-900 block">{metrics.totalComplaints}</span>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-blue-200 shadow-xs space-y-1">
            <span className="text-xs text-blue-700 font-bold uppercase tracking-wider block">Open Triage</span>
            <span className="text-2xl font-black text-[#1261A0] block">{metrics.openComplaints}</span>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-amber-200 shadow-xs space-y-1">
            <span className="text-xs text-amber-700 font-bold uppercase tracking-wider block">In Progress</span>
            <span className="text-2xl font-black text-amber-600 block">{metrics.inProgressComplaints}</span>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-emerald-200 shadow-xs space-y-1">
            <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block">Resolved & Fixed</span>
            <span className="text-2xl font-black text-emerald-600 block">{metrics.resolvedComplaints}</span>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-red-200 shadow-xs space-y-1">
            <span className="text-xs text-red-700 font-bold uppercase tracking-wider block">Critical Risk</span>
            <span className="text-2xl font-black text-red-600 block">{metrics.criticalComplaints}</span>
          </div>
        </div>
      )}

      {/* Triage Queue Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-gray-800">
          <Filter className="w-4 h-4 text-[#1261A0]" />
          <span>Queue Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl font-semibold text-gray-800"
          >
            <option value="all">All Departments</option>
            <option value="Road & Infrastructure Department">Road & Infrastructure</option>
            <option value="Sanitation & Solid Waste Management">Sanitation & Waste</option>
            <option value="Electrical & Street Lighting Department">Electrical & Lighting</option>
            <option value="Metrowater & Drainage Board (CMWSSB)">Metrowater & Drainage</option>
            <option value="Parks & Horticulture Department">Parks & Horticulture</option>
          </select>

          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl font-semibold text-gray-800"
          >
            <option value="all">All Wards / Zones</option>
            <option value="Ward 102">Ward 102 (Anna Nagar)</option>
            <option value="Ward 136">Ward 136 (T. Nagar)</option>
            <option value="Ward 173">Ward 173 (Adyar)</option>
            <option value="Ward 178">Ward 178 (Velachery)</option>
            <option value="Ward 23">Ward 23 (Coimbatore)</option>
            <option value="Ward 45">Ward 45 (Madurai)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl font-semibold text-gray-800"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <button
            onClick={loadData}
            className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            title="Refresh Queue"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Authority Table Component */}
      <AuthorityTable complaints={filtered} onUpdate={loadData} />

      {/* Credentials Change Modal */}
      {showCredsModal && (
        <ChangeCredentialsModal
          onClose={() => setShowCredsModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
