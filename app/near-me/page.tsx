'use client';

import React, { useState, useEffect } from 'react';
import { getStoredComplaints } from '../../lib/adapters/dbAdapter';
import { requestCurrentLocation } from '../../lib/adapters/geocodeAdapter';
import { calculateDistance, formatDistanceText } from '../../lib/utils';
import { Complaint } from '../../lib/types';
import { CivicPostCard } from '../../components/complaints/CivicPostCard';
import { Navigation, MapPin, Loader2, PlusCircle, Filter } from 'lucide-react';
import Link from 'next/link';

export default function NearMePage() {
  const [lat, setLat] = useState(13.085);
  const [lon, setLon] = useState(80.2101);
  const [radiusKm, setRadiusKm] = useState(5);
  const [isLocating, setIsLocating] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    setComplaints(getStoredComplaints());
  }, []);

  const handleDetectLocation = async () => {
    setIsLocating(true);
    try {
      const coords = await requestCurrentLocation();
      setLat(coords.latitude);
      setLon(coords.longitude);
    } finally {
      setIsLocating(false);
    }
  };

  const nearbyComplaints = complaints
    .map((c) => ({
      ...c,
      distKm: calculateDistance(lat, lon, c.latitude, c.longitude),
    }))
    .filter((c) => c.distKm <= radiusKm)
    .sort((a, b) => a.distKm - b.distKm);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#1261A0] to-[#2E9B5B] text-white p-6 rounded-3xl shadow-lg">
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-1">
            Hyperlocal Proximity Stream
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Civic Issues Near Me</h1>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Showing issues within {radiusKm} km of your current location in Chennai.
          </p>
        </div>

        <button
          onClick={handleDetectLocation}
          disabled={isLocating}
          className="bg-white text-[#1261A0] hover:bg-slate-50 text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all shrink-0"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#1261A0]" />
          ) : (
            <Navigation className="w-4 h-4 text-[#F28C28]" />
          )}
          <span>{isLocating ? 'Detecting GPS...' : 'Refresh Location GPS'}</span>
        </button>
      </div>

      {/* Radius Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#F28C28]" />
          <span className="text-xs font-bold text-gray-800">
            Center: Lat {lat.toFixed(4)}, Lon {lon.toFixed(4)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-gray-600">Distance Radius:</span>
          {[1, 3, 5, 10, 20].map((r) => (
            <button
              key={r}
              onClick={() => setRadiusKm(r)}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                radiusKm === r
                  ? 'bg-[#1261A0] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      {nearbyComplaints.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
          <MapPin className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No issues found within {radiusKm} km</h3>
          <p className="text-xs text-gray-500">Try expanding your distance radius or report a new issue in this area!</p>
          <Link
            href="/raise-problem"
            className="inline-flex items-center gap-1.5 bg-[#F28C28] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs"
          >
            <PlusCircle className="w-4 h-4" /> Report Issue Here
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nearbyComplaints.map((item) => (
            <div key={item.id} className="relative">
              <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white font-black text-[10px] px-2.5 py-1 rounded-full shadow-md">
                📍 {formatDistanceText(item.distKm)}
              </div>
              <CivicPostCard complaint={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
