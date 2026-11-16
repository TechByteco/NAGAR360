'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredComplaints, getAuthorityMetrics, updateComplaintStatus } from '../../lib/adapters/dbAdapter';
import { getCurrentUser, getOfficialCredentials, signOutUser } from '../../lib/adapters/authAdapter';
import { Complaint, AuthorityMetrics, ComplaintStatus } from '../../lib/types';
import { AuthorityTable } from '../../components/admin/AuthorityTable';
import { ChangeCredentialsModal } from '../../components/admin/ChangeCredentialsModal';
import KanbanBoard from '../../components/admin/KanbanBoard';
import {
  ShieldCheck,
  Filter,
  RefreshCcw,
  Key,
  LogOut,
  Lock,
  LayoutGrid,
  List,
  AlertTriangle,
  Download,
  Smile,
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
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
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

  const handleKanbanStatusChange = (complaintId: string, newStatus: ComplaintStatus) => {
    updateComplaintStatus(
      complaintId,
      newStatus,
      `Status updated via Executive Kanban Board by ${user.fullName}.`,
      user.fullName
    );
    loadData();
  };

  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Title', 'Category', 'Severity', 'Status', 'Ward', 'City', 'Created At'];
    const rows = complaints.map((c) => [
      c.ticketId,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.severity,
      c.status,
      c.ward,
      c.city,
      c.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nagar360-authority-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
            <span>Tamil Nadu Municipal Administration Executive Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Authority Operations & Triage Dashboard</h1>
          <p className="text-xs text-blue-200">
            Triage, assign work orders, and audit civic resolutions across all 38 Tamil Nadu districts in real time.
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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

          <div className="bg-white p-4.5 rounded-2xl border border-rose-200 shadow-xs space-y-1">
            <span className="text-xs text-rose-700 font-bold uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-500" /> Overdue SLA
            </span>
            <span className="text-2xl font-black text-rose-600 block">{metrics.overdueSlaCount}</span>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-teal-200 shadow-xs space-y-1">
            <span className="text-xs text-teal-700 font-bold uppercase tracking-wider flex items-center gap-1">
              <Smile className="w-3 h-3 text-teal-600" /> Citizen Trust
            </span>
            <span className="text-2xl font-black text-teal-700 block">{metrics.citizenSatisfactionPercent}%</span>
          </div>
        </div>
      )}

      {/* Triage Queue Filter Controls & View Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* VIEW MODE TOGGLE */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              viewMode === 'kanban' ? 'bg-white text-nagar-blue shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Executive Kanban</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              viewMode === 'table' ? 'bg-white text-nagar-blue shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table View</span>
          </button>
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

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={loadData}
            className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            title="Refresh Queue"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RENDER TABLE OR KANBAN */}
      {viewMode === 'kanban' ? (
        <KanbanBoard complaints={filtered} onStatusChange={handleKanbanStatusChange} />
      ) : (
        <AuthorityTable complaints={filtered} onUpdate={loadData} />
      )}

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
