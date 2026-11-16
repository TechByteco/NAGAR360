'use client';

import React, { useState, useEffect } from 'react';
import { getStoredComplaints, fetchComplaintsAsync, subscribeToRealtimeComplaints } from '../../lib/adapters/dbAdapter';
import { TAMIL_NADU_DISTRICTS } from '../../lib/store';
import { Complaint } from '../../lib/types';
import { MapView } from '../../components/map/MapView';
import { CivicPostCard } from '../../components/complaints/CivicPostCard';
import {
  MapPin,
  Filter,
  Layers,
  List,
  Globe,
  Search,
  Sparkles,
  ShieldCheck,
  Flame,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function MapPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'map' | 'list'>('map');
  const [isLoading, setIsLoading] = useState(false);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number; zoom: number }>({
    lat: 10.7905,
    lon: 78.7047, // Geographic Center of Tamil Nadu (Tiruchirappalli)
    zoom: 7,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await fetchComplaintsAsync();
      setComplaints(list);
      if (list.length > 0 && !selectedComplaint) {
        setSelectedComplaint(list[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // 📡 Live Realtime WebSocket listener
    const unsubscribe = subscribeToRealtimeComplaints(() => {
      loadData();
    });

    window.addEventListener('nagar360_store_update', loadData);
    return () => {
      unsubscribe();
      window.removeEventListener('nagar360_store_update', loadData);
    };
  }, []);

  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    if (distName === 'all') {
      setMapCenter({ lat: 10.7905, lon: 78.7047, zoom: 7 });
      return;
    }
    const found = TAMIL_NADU_DISTRICTS.find((d) => d.name.toLowerCase() === distName.toLowerCase());
    if (found) {
      setMapCenter({ lat: found.lat, lon: found.lon, zoom: 12 });
    }
  };

  const filtered = complaints.filter((c) => {
    // District filter
    if (selectedDistrict !== 'all' && selectedDistrict !== 'All Tamil Nadu') {
      if (c.city.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    }
    // Category filter
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    // Severity filter
    if (selectedSeverity !== 'all' && c.severity !== selectedSeverity) return false;
    // Status filter
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchLocality = c.locality.toLowerCase().includes(q);
      const matchWard = c.ward.toLowerCase().includes(q);
      const matchTicket = c.ticketId.toLowerCase().includes(q);
      return matchTitle || matchLocality || matchWard || matchTicket;
    }
    return true;
  });

  // Calculate District & Filter Statistics
  const totalCount = filtered.length;
  const criticalCount = filtered.filter((c) => c.severity === 'critical' && c.status !== 'resolved').length;
  const inProgressCount = filtered.filter((c) => c.status === 'in_progress' || c.status === 'assigned').length;
  const resolvedCount = filtered.filter((c) => c.status === 'resolved').length;
  const resolvedRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Header & Metrics Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1261A0] to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>Tamil Nadu Statewide Civic Map • All 38 Districts & Municipal Corporations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Interactive Civic GIS Map</h1>
          <p className="text-xs text-blue-200">
            Inspect real-time civic issues, explore density hotspots, and report problems directly at coordinates.
          </p>
        </div>

        {/* Live Metrics Pill Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto shrink-0 text-xs">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center">
            <div className="text-[10px] uppercase font-bold text-blue-200">Total Mapped</div>
            <div className="text-xl font-black text-white">{totalCount}</div>
          </div>
          <div className="bg-red-500/20 backdrop-blur-md p-3 rounded-2xl border border-red-400/30 text-center">
            <div className="text-[10px] uppercase font-bold text-red-300">Critical Risks</div>
            <div className="text-xl font-black text-red-400">{criticalCount}</div>
          </div>
          <div className="bg-amber-500/20 backdrop-blur-md p-3 rounded-2xl border border-amber-400/30 text-center">
            <div className="text-[10px] uppercase font-bold text-amber-300">In Progress</div>
            <div className="text-xl font-black text-amber-400">{inProgressCount}</div>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-md p-3 rounded-2xl border border-emerald-400/30 text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-300">Resolved Rate</div>
            <div className="text-xl font-black text-emerald-400">{resolvedRate}%</div>
          </div>
        </div>
      </div>

      {/* Comprehensive Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by locality, ward, landmark, or ticket ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
            />
          </div>

          {/* District Dropdown (All 38 Districts) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <MapPin className="w-4 h-4 text-[#F28C28]" />
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-gray-300 rounded-xl font-bold text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
            >
              <option value="all">📍 All Tamil Nadu (38 Districts)</option>
              {TAMIL_NADU_DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.nameTa}) — {d.corporation}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Action Button to Report */}
          <Link
            href="/raise-problem"
            className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#F28C28] to-[#e07b18] hover:from-[#e07b18] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/20 shrink-0 transition-transform hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Problem</span>
          </Link>
        </div>

        {/* Second Row Filters: Category, Severity, Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl font-semibold text-gray-800"
            >
              <option value="all">All Categories</option>
              <option value="Pothole">🛣️ Pothole / Broken Road</option>
              <option value="Garbage Accumulation">🗑️ Garbage Accumulation</option>
              <option value="Broken Streetlight">💡 Broken Streetlight</option>
              <option value="Water Leakage">💧 Water Leakage</option>
              <option value="Blocked Drainage">🌊 Blocked Drainage</option>
              <option value="Fallen Tree">🌳 Fallen Tree</option>
              <option value="Damaged Footpath">🚶 Damaged Footpath</option>
              <option value="Open Manhole">🕳️ Open Manhole</option>
              <option value="Traffic Signal Issue">🚦 Traffic Signal Issue</option>
            </select>

            {/* Severity Dropdown */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl font-semibold text-gray-800"
            >
              <option value="all">All Severities</option>
              <option value="critical">🚨 Critical Risk</option>
              <option value="high">⚠️ High Priority</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl font-semibold text-gray-800"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved & Fixed</option>
            </select>
          </div>

          <button
            onClick={loadData}
            className="p-1.5 text-gray-500 hover:text-gray-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 font-semibold text-xs"
            title="Refresh Realtime Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Live Refresh</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher (Map vs List) */}
      <div className="flex lg:hidden bg-slate-200 p-1 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveMobileTab('map')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeMobileTab === 'map' ? 'bg-[#1261A0] text-white shadow-xs' : 'text-gray-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Interactive Map</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('list')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeMobileTab === 'list' ? 'bg-[#1261A0] text-white shadow-xs' : 'text-gray-700'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Tickets List ({filtered.length})</span>
        </button>
      </div>

      {/* Split Screen Layout (Desktop: Side-by-Side | Mobile: Active Tab) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[76vh] min-h-[550px]">
        {/* Left Column: Interactive Leaflet Map */}
        <div
          className={`lg:col-span-7 h-full rounded-3xl overflow-hidden shadow-md ${
            activeMobileTab === 'map' ? 'block' : 'hidden lg:block'
          }`}
        >
          <MapView
            complaints={filtered}
            centerLat={mapCenter.lat}
            centerLon={mapCenter.lon}
            zoom={mapCenter.zoom}
            selectedId={selectedComplaint?.id}
            onSelectComplaint={(c) => {
              setSelectedComplaint(c);
              // On mobile, if user clicks marker, switch to list view to inspect
              if (window.innerWidth < 1024) {
                setActiveMobileTab('list');
              }
            }}
          />
        </div>

        {/* Right Column: Active Complaint Stream & Inspection Panel */}
        <div
          className={`lg:col-span-5 h-full overflow-y-auto space-y-4 pr-1 ${
            activeMobileTab === 'list' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <List className="w-4 h-4 text-[#1261A0]" />
              <span>Mapped Complaints in Filter ({filtered.length})</span>
            </span>
            <span className="text-[11px] text-gray-500 font-semibold">Click card to focus</span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-gray-200 text-center space-y-3">
              <MapPin className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No Mapped Issues Found</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                No civic complaints match the selected district, category, or search filters.
              </p>
              <button
                onClick={() => {
                  setSelectedDistrict('all');
                  setSelectedCategory('all');
                  setSelectedSeverity('all');
                  setSelectedStatus('all');
                  setSearchQuery('');
                  setMapCenter({ lat: 10.7905, lon: 78.7047, zoom: 7 });
                }}
                className="text-xs font-bold text-[#1261A0] hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedComplaint(item);
                  setMapCenter({ lat: item.latitude, lon: item.longitude, zoom: 15 });
                }}
                className={`cursor-pointer transition-all ${
                  selectedComplaint?.id === item.id ? 'ring-2 ring-[#1261A0] rounded-3xl' : ''
                }`}
              >
                <CivicPostCard complaint={item} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
