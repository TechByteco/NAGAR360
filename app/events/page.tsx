'use client';

import React, { useState, useEffect } from 'react';
import { getStoredEvents, toggleJoinEvent } from '../../lib/adapters/dbAdapter';
import { getCurrentUser } from '../../lib/adapters/authAdapter';
import { CivicEvent } from '../../lib/types';
import { Calendar, MapPin, Users, CheckCircle2, Share2, PlusCircle } from 'lucide-react';

export default function EventsPage() {
  const currentUser = getCurrentUser();
  const userId = currentUser?.id || 'guest';
  const [events, setEvents] = useState<CivicEvent[]>([]);

  const loadData = () => {
    setEvents(getStoredEvents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('nagar360_store_update', loadData);
    return () => window.removeEventListener('nagar360_store_update', loadData);
  }, []);

  const handleJoin = (eventId: string) => {
    toggleJoinEvent(eventId, userId);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-8 rounded-3xl shadow-lg space-y-2">
        <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block">
          Community Engagement
        </span>
        <h1 className="text-3xl font-black">Civic & Cleanliness Drives</h1>
        <p className="text-xs text-emerald-100 max-w-xl">
          Join local neighborhood beach cleanups, sapling plantation drives, and ward townhall meetings in Chennai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((evt) => {
          const isJoined = (evt.joinedUserIds || []).includes(userId);
          return (
            <div
              key={evt.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="aspect-video relative bg-gray-100 overflow-hidden">
                <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  📍 {evt.locality} ({evt.ward})
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 text-base leading-snug">{evt.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{evt.description}</p>
                </div>

                <div className="space-y-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-800 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#1261A0]" />
                    <span>{evt.date} • {evt.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#F28C28]" />
                    <span>{evt.attendeesCount} Residents Attending</span>
                  </div>
                </div>

                <button
                  onClick={() => handleJoin(evt.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    isJoined
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isJoined ? 'Joined (RSVP Confirmed)' : 'Join Event'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
