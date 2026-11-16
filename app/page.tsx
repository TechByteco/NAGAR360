'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredComplaints } from '../lib/adapters/dbAdapter';
import { Complaint } from '../lib/types';
import { CivicPostCard } from '../components/complaints/CivicPostCard';
import {
  PlusCircle,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Trees,
} from 'lucide-react';

export default function LandingPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    setComplaints(getStoredComplaints());
  }, []);

  const totalCount = complaints.length + 840;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length + 680;

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF8ED] via-white to-[#FAF9F6] pt-12 pb-16 border-b border-amber-100/60">
        {/* Subtle Rangoli Decorative Line Pattern Overlay */}
        <div className="absolute inset-0 rangoli-bg opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 text-xs font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-[#F28C28]" />
                <span>Namma Nagar, Namma Poruppu • Chennai Civic Network</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
                Turn civic problems into{' '}
                <span className="bg-gradient-to-r from-[#1261A0] via-[#2E9B5B] to-[#F28C28] bg-clip-text text-transparent">
                  community action.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Nagar360 empowers citizens across Indian cities to report potholes, garbage accumulation, broken streetlights, and drainage issues. AI auto-analyzes severity while municipal authorities resolve tickets transparently.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/raise-problem"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F28C28] hover:bg-[#e07b18] text-white font-bold text-base px-7 py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02]"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Report an Issue Now</span>
                </Link>

                <Link
                  href="/feed"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#1261A0] border-2 border-[#1261A0] font-bold text-base px-7 py-3.5 rounded-2xl shadow-xs transition-all"
                >
                  <MapPin className="w-5 h-5 text-[#F28C28]" />
                  <span>Explore Nearby Issues</span>
                </Link>
              </div>

              {/* City & Tagline Bar */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-600 font-semibold border-t border-gray-200/80">
                <div className="flex items-center gap-1.5 text-gray-800">
                  <MapPin className="w-4 h-4 text-[#1261A0]" />
                  <span>Default City: <strong className="text-[#1261A0]">Chennai, TN</strong></span>
                </div>
                <div>•</div>
                <div className="text-emerald-700 font-bold">
                  “See It. Report It. Improve It.”
                </div>
              </div>
            </div>

            {/* Right Illustration Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-gray-200 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1261A0] bg-blue-50 px-2 py-0.5 rounded">
                    Live Civic Stream
                  </span>
                </div>

                {/* Hero Showcase Card */}
                {complaints.length > 0 && (
                  <CivicPostCard complaint={complaints[0]} />
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Impact Metrics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1261A0] to-slate-900 text-white rounded-3xl p-8 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1 border-r border-white/10 last:border-0">
            <span className="text-3xl sm:text-4xl font-black text-amber-300 block">{totalCount}+</span>
            <span className="text-xs text-blue-200 font-medium uppercase tracking-wider block">Issues Reported</span>
          </div>
          <div className="space-y-1 border-r border-white/10 last:border-0">
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 block">{resolvedCount}+</span>
            <span className="text-xs text-blue-200 font-medium uppercase tracking-wider block">Resolved & Fixed</span>
          </div>
          <div className="space-y-1 border-r border-white/10 last:border-0">
            <span className="text-3xl sm:text-4xl font-black text-white block">14,200+</span>
            <span className="text-xs text-blue-200 font-medium uppercase tracking-wider block">Active Citizens</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-amber-400 block">1.8 Days</span>
            <span className="text-xs text-blue-200 font-medium uppercase tracking-wider block">Avg Resolution Time</span>
          </div>
        </div>
      </section>

      {/* 4-Step Interactive Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#F28C28] uppercase tracking-widest block">How Nagar360 Works</span>
          <h2 className="text-3xl font-black text-gray-900">4 Simple Steps to a Better Neighborhood</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3 relative hover:border-[#1261A0] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1261A0] font-black text-lg flex items-center justify-center">
              1
            </div>
            <h3 className="text-base font-bold text-gray-900">1. Snap Photo</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Capture a clear image of the pothole, garbage dump, or broken streetlight using your mobile camera.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3 relative hover:border-[#1261A0] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#F28C28] font-black text-lg flex items-center justify-center">
              2
            </div>
            <h3 className="text-base font-bold text-gray-900">2. AI Inspection</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our AI vision model auto-detects issue category, severity score, and suggests the appropriate ward department.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3 relative hover:border-[#1261A0] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#2E9B5B] font-black text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="text-base font-bold text-gray-900">3. Community Support</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Neighbors in Anna Nagar, T. Nagar, or Adyar upvote the ticket to elevate priority on the authority dashboard.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3 relative hover:border-[#1261A0] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-black text-lg flex items-center justify-center">
              4
            </div>
            <h3 className="text-base font-bold text-gray-900">4. Direct Action</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Municipal department crews inspect the site, complete repairs, and upload resolution photo evidence.
            </p>
          </div>
        </div>
      </section>

      {/* Category Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Report Any Civic Infrastructure Concern</h2>
            <p className="text-xs text-gray-500">Categorized automatically by department for swift dispatch</p>
          </div>
          <Link href="/feed" className="text-xs font-bold text-[#1261A0] hover:underline flex items-center gap-1">
            View All Issues <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { title: 'Potholes & Roads', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
            { title: 'Garbage Accumulation', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
            { title: 'Broken Streetlights', icon: Lightbulb, color: 'text-blue-600 bg-blue-50' },
            { title: 'Water & Leaks', icon: Droplets, color: 'text-cyan-600 bg-cyan-50' },
            { title: 'Trees & Parks', icon: Trees, color: 'text-green-700 bg-green-50' },
            { title: 'Traffic Signals', icon: ShieldCheck, color: 'text-red-600 bg-red-50' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href="/feed"
                className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#1261A0] hover:shadow-md transition-all text-center space-y-2 group"
              >
                <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-gray-900">{item.title}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Indian Cleanliness Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block">Clean City Initiative</span>
            <h3 className="text-2xl font-black">Namma Nagar, Namma Poruppu — Our City, Our Responsibility</h3>
            <p className="text-xs text-emerald-100 max-w-xl">
              Join neighborhood cleanliness drives, report civic hazards, and earn civic points as a verified community champion.
            </p>
          </div>
          <Link
            href="/events"
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-extrabold text-sm px-6 py-3 rounded-2xl shadow-md transition-all shrink-0"
          >
            Join Local Events
          </Link>
        </div>
      </section>
    </div>
  );
}
