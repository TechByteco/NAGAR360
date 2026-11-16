'use client';

import React, { useState } from 'react';
import { requestCurrentLocation, reverseGeocodeLocation } from '../../lib/adapters/geocodeAdapter';
import { TAMIL_NADU_DISTRICTS } from '../../lib/store';
import { MapPin, Navigation, Search, CheckCircle2, Loader2, Globe } from 'lucide-react';

interface Props {
  onLocationSelected: (data: {
    latitude: number;
    longitude: number;
    address: string;
    locality: string;
    ward: string;
    city: string;
  }) => void;
  initialLat?: number;
  initialLon?: number;
  initialAddress?: string;
}

export const LocationPicker: React.FC<Props> = ({
  onLocationSelected,
  initialLat = 13.085,
  initialLon = 80.2101,
  initialAddress = 'Anna Nagar, Chennai, Tamil Nadu',
}) => {
  const [lat, setLat] = useState(initialLat);
  const [lon, setLon] = useState(initialLon);
  const [address, setAddress] = useState(initialAddress);
  const [locality, setLocality] = useState('Anna Nagar');
  const [ward, setWard] = useState('Ward 102');
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [isLocating, setIsLocating] = useState(false);

  const handleGPSDetect = async () => {
    setIsLocating(true);
    try {
      const coords = await requestCurrentLocation();
      setLat(coords.latitude);
      setLon(coords.longitude);

      const geo = await reverseGeocodeLocation(coords.latitude, coords.longitude);
      setAddress(geo.address);
      setLocality(geo.locality);
      setWard(geo.ward);
      setSelectedDistrict(geo.city || 'Chennai');

      onLocationSelected({
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: geo.address,
        locality: geo.locality,
        ward: geo.ward,
        city: geo.city || 'Chennai',
      });
    } finally {
      setIsLocating(false);
    }
  };

  const handleSelectDistrict = (distName: string) => {
    const dist = TAMIL_NADU_DISTRICTS.find((d) => d.name === distName) || TAMIL_NADU_DISTRICTS[0];
    setSelectedDistrict(dist.name);
    setLat(dist.lat);
    setLon(dist.lon);
    setLocality(`${dist.name} Central`);
    setWard(`Ward 1 (${dist.name})`);
    const fullAddr = `Main Road, ${dist.name}, Tamil Nadu`;
    setAddress(fullAddr);

    onLocationSelected({
      latitude: dist.lat,
      longitude: dist.lon,
      address: fullAddr,
      locality: `${dist.name} Central`,
      ward: `Ward 1 (${dist.name})`,
      city: dist.name,
    });
  };

  const handleSelectPresetLocality = async (
    locName: string,
    wardName: string,
    latitude: number,
    longitude: number,
    cityName: string
  ) => {
    setLat(latitude);
    setLon(longitude);
    setLocality(locName);
    setWard(wardName);
    setSelectedDistrict(cityName);
    const fullAddr = `Main Road, ${locName}, ${cityName}, Tamil Nadu`;
    setAddress(fullAddr);

    onLocationSelected({
      latitude,
      longitude,
      address: fullAddr,
      locality: locName,
      ward: wardName,
      city: cityName,
    });
  };

  return (
    <div className="space-y-4 bg-slate-50 border border-gray-200 p-4.5 rounded-2xl">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#F28C28]" />
          <h4 className="text-sm font-bold text-gray-900">Incident Geolocation & District Routing</h4>
        </div>
        <button
          type="button"
          onClick={handleGPSDetect}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 bg-[#1261A0] hover:bg-[#0d4c7d] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span>{isLocating ? 'Detecting...' : 'Auto-Detect GPS'}</span>
        </button>
      </div>

      {/* District Dropdown */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1">
        <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
          Select Tamil Nadu District (38 Districts)
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => handleSelectDistrict(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
        >
          {TAMIL_NADU_DISTRICTS.map((d) => (
            <option key={d.name} value={d.name}>
              📍 {d.name} ({d.nameTa}) — {d.corporation}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Address Display Box */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-semibold text-gray-700">Verified Address</span>
          <span className="font-mono text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold">
            Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
          </span>
        </div>
        <p className="text-xs font-bold text-gray-900 leading-snug">{address}</p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
            {locality}
          </span>
          <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
            {ward}
          </span>
          <span className="text-[11px] font-semibold bg-blue-100 text-blue-900 px-2 py-0.5 rounded border border-blue-300">
            {selectedDistrict}
          </span>
        </div>
      </div>

      {/* Preset Major City Locality Buttons */}
      <div>
        <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1.5">
          Or Quick Select Major Urban Hub
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: 'Anna Nagar', ward: 'Ward 102', lat: 13.085, lon: 80.2101, city: 'Chennai' },
            { name: 'RS Puram', ward: 'Ward 23', lat: 11.0125, lon: 76.9512, city: 'Coimbatore' },
            { name: 'Chithirai St', ward: 'Ward 45', lat: 9.9212, lon: 78.1189, city: 'Madurai' },
            { name: 'Thillai Nagar', ward: 'Ward 31', lat: 10.7923, lon: 78.6985, city: 'Tiruchirappalli' },
          ].map((loc) => (
            <button
              key={loc.name}
              type="button"
              onClick={() => handleSelectPresetLocality(loc.name, loc.ward, loc.lat, loc.lon, loc.city)}
              className={`text-left p-2 rounded-xl text-xs font-semibold border transition-all ${
                locality === loc.name
                  ? 'bg-[#1261A0] text-white border-[#1261A0] shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-bold">{loc.name}</div>
              <div className={`text-[10px] ${locality === loc.name ? 'text-blue-200' : 'text-gray-400'}`}>
                {loc.city} ({loc.ward})
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
