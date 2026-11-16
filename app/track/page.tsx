'use client';

import React, { useState } from 'react';
import { searchComplaintByTicketId, getStoredComplaints } from '../../lib/adapters/dbAdapter';
import { Complaint } from '../../lib/types';
import { CivicPostCard } from '../../components/complaints/CivicPostCard';
import { Search, Ticket, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TrackPage() {
  const [ticketInput, setTicketInput] = useState('');
  const [searchedComplaint, setSearchedComplaint] = useState<Complaint | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    const found = searchComplaintByTicketId(ticketInput.trim());
    setSearchedComplaint(found);
    setSearched(true);
  };

  const allComplaints = getStoredComplaints();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1261A0] to-slate-900 text-white p-8 rounded-3xl shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
          <Ticket className="w-4 h-4" />
          <span>Public Ticket Tracking System</span>
        </div>
        <h1 className="text-3xl font-black">Track Complaint Status</h1>
        <p className="text-xs text-blue-100 max-w-xl">
          Enter your unique public ticket reference ID (e.g., NGR-CHN-2026-00124) to inspect live field updates, department assignments, and resolution photo evidence.
        </p>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="flex gap-2 pt-2">
          <input
            type="text"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
            placeholder="e.g. NGR-CHN-2026-00124"
            className="flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 font-mono text-sm font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
          />
          <button
            type="submit"
            className="bg-[#F28C28] hover:bg-[#e07b18] text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/30"
          >
            <Search className="w-4 h-4" />
            <span>Track Ticket</span>
          </button>
        </form>
      </div>

      {/* Result Display */}
      {searched && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Search Results</h2>
          {searchedComplaint ? (
            <CivicPostCard complaint={searchedComplaint} />
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No Ticket Found for "{ticketInput}"</h3>
              <p className="text-xs text-gray-500">Check ticket ID format or select a sample complaint below.</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Sample Tickets for Hackathon Demo */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Or click a sample demo ticket to track:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allComplaints.slice(0, 4).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setTicketInput(c.ticketId);
                setSearchedComplaint(c);
                setSearched(true);
              }}
              className="p-3 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl transition-all"
            >
              <div className="font-mono text-xs font-bold text-[#1261A0]">{c.ticketId}</div>
              <div className="font-bold text-gray-900 text-xs truncate">{c.title}</div>
              <div className="text-[10px] text-gray-500 flex items-center justify-between mt-1">
                <span>{c.ward}</span>
                <span className="font-semibold capitalize text-emerald-700">{c.status}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
