'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Complaint, FloodRiskZone } from '../../lib/types';
import { FLOOD_RISK_ZONES } from '../../lib/store';
import { Layers, Maximize2, Minimize2, Navigation, Flame, MapPin, PlusCircle, AlertTriangle, Waves, Download } from 'lucide-react';

interface Props {
  complaints: Complaint[];
  selectedId?: string;
  onSelectComplaint?: (complaint: Complaint) => void;
  centerLat?: number;
  centerLon?: number;
  zoom?: number;
}

export const MapView: React.FC<Props> = ({
  complaints = [],
  selectedId,
  onSelectComplaint = () => {},
  centerLat = 13.0827,
  centerLon = 80.2707,
  zoom = 11,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<any>(null);
  const [tileMode, setTileMode] = useState<'standard' | 'dark' | 'satellite'>('standard');
  const [viewMode, setViewMode] = useState<'pins' | 'hotspots'>('pins');
  const [showFloodZones, setShowFloodZones] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const hotspotsLayerRef = useRef<any>(null);
  const floodZonesLayerRef = useRef<any>(null);
  const tempMarkerRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
    import('leaflet').then((leafletModule) => {
      setL(leafletModule.default || leafletModule);
    });
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isMounted || !L) return;

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const mapContainer = document.getElementById('nagar360-leaflet-map');
    if (!mapContainer || mapInstanceRef.current) return;

    const map = L.map('nagar360-leaflet-map', {
      zoomControl: false,
    }).setView([centerLat, centerLon], zoom);

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);
    hotspotsLayerRef.current = L.layerGroup().addTo(map);
    floodZonesLayerRef.current = L.layerGroup().addTo(map);

    // Map click to place report pin
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      if (tempMarkerRef.current) {
        map.removeLayer(tempMarkerRef.current);
      }

      const clickPinHtml = `
        <div style="
          background: #F28C28;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
        ">📍</div>
      `;

      const customIcon = L.divIcon({
        className: 'nagar-click-pin',
        html: clickPinHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const tempMarker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      tempMarkerRef.current = tempMarker;

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; width: 220px; padding: 4px;">
          <div style="font-size: 10px; font-weight: 800; color: #1261A0; text-transform: uppercase;">
            Selected Map Location
          </div>
          <div style="font-size: 11px; font-weight: 700; color: #17212B; margin-top: 2px;">
            Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}
          </div>
          <div style="margin-top: 8px;">
            <a href="/raise-problem?lat=${lat.toFixed(5)}&lon=${lng.toFixed(5)}" 
               style="display: block; text-align: center; background: #1261A0; color: white; text-decoration: none; font-size: 11px; font-weight: 800; padding: 6px 10px; border-radius: 8px; box-shadow: 0 2px 6px rgba(18,97,160,0.3);">
              + Report Issue Here
            </a>
          </div>
        </div>
      `;

      tempMarker.bindPopup(popupContent).openPopup();
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isMounted, L]);

  // Handle Tile Mode Change
  useEffect(() => {
    if (!mapInstanceRef.current || !L) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    if (tileMode === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CARTO &copy; OpenStreetMap';
    } else if (tileMode === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri, Earthstar Geographics';
    }

    const tileLayer = L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(map);
    tileLayerRef.current = tileLayer;
  }, [tileMode, L]);

  // Smooth FlyTo Center & Zoom
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([centerLat, centerLon], zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [centerLat, centerLon, zoom]);

  // Category Icon & Color Mapping
  const getCategoryIconDetails = (category: string, severity: string, status: string) => {
    let pinColor = '#1261A0';
    let iconChar = '⚠️';

    if (status === 'resolved') {
      pinColor = '#2E9B5B';
      iconChar = '✓';
    } else if (severity === 'critical') {
      pinColor = '#D64545';
    } else if (severity === 'high') {
      pinColor = '#F28C28';
    }

    const cat = category.toLowerCase();
    if (cat.includes('pothole') || cat.includes('road')) iconChar = '🛣️';
    else if (cat.includes('garbage') || cat.includes('bin') || cat.includes('dumping')) iconChar = '🗑️';
    else if (cat.includes('streetlight') || cat.includes('electrical')) iconChar = '💡';
    else if (cat.includes('drainage') || cat.includes('drain')) iconChar = '🌊';
    else if (cat.includes('water') || cat.includes('leakage')) iconChar = '💧';
    else if (cat.includes('tree')) iconChar = '🌳';
    else if (cat.includes('manhole')) iconChar = '🕳️';
    else if (cat.includes('signal') || cat.includes('traffic')) iconChar = '🚦';

    return { pinColor, iconChar };
  };

  // Render Markers and Hotspots
  useEffect(() => {
    if (!mapInstanceRef.current || !L || !markersLayerRef.current || !hotspotsLayerRef.current) return;

    const markersLayer = markersLayerRef.current;
    const hotspotsLayer = hotspotsLayerRef.current;

    markersLayer.clearLayers();
    hotspotsLayer.clearLayers();

    // 1. PIN MARKERS
    if (viewMode === 'pins') {
      complaints.forEach((c) => {
        const { pinColor, iconChar } = getCategoryIconDetails(c.category, c.severity, c.status);
        const isCritical = c.severity === 'critical' && c.status !== 'resolved';
        const isSelected = selectedId === c.id;

        const customHtml = `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            ${isCritical ? '<div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(214,69,69,0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : ''}
            <div style="
              background-color: ${pinColor};
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 2px solid white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
              transition: transform 0.2s ease;
            ">
              ${iconChar}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'nagar-map-marker',
          html: customHtml,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
        });

        const marker = L.marker([c.latitude, c.longitude], { icon: customIcon }).addTo(markersLayer);

        const statusLabel = c.status === 'resolved' ? 'Resolved' : c.status.replace('_', ' ').toUpperCase();
        const popupContent = `
          <div style="font-family: system-ui, -apple-system, sans-serif; width: 240px; padding: 2px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 9px; font-weight: 800; color: #667085; text-transform: uppercase;">
                ${c.ward} • ${c.locality}
              </span>
              <span style="font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${pinColor}20; color: ${pinColor};">
                ${statusLabel}
              </span>
            </div>
            
            <div style="font-size: 13px; font-weight: 800; color: #17212B; line-height: 1.3;">
              ${c.title}
            </div>

            ${c.imageUrl ? `
              <div style="margin-top: 6px; width: 100%; height: 95px; border-radius: 8px; overflow: hidden; background: #f1f5f9;">
                <img src="${c.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="issue" />
              </div>
            ` : ''}

            <div style="margin-top: 6px; display: flex; gap: 4px; align-items: center; flex-wrap: wrap;">
              <span style="background: #1261A0; color: white; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
                ${c.category}
              </span>
              <span style="background: #FFF8ED; color: #8B5E3C; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid #E5E7EB;">
                👍 ${c.supportsCount} Upvotes
              </span>
            </div>

            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 10px; color: #64748b; font-family: monospace;">${c.ticketId}</span>
              <a href="/complaints/${c.id}" style="display: inline-block; background: #F28C28; color: white; text-decoration: none; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px;">
                Open Ticket →
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => onSelectComplaint(c));
      });
    }

    // 2. HOTSPOT & HEATMAP DENSITY VIEW
    if (viewMode === 'hotspots') {
      // Cluster complaints by locality
      const clusters: Record<string, { lat: number; lon: number; count: number; critical: number; locality: string; city: string }> = {};

      complaints.forEach((c) => {
        const key = `${c.city}-${c.locality}`;
        if (!clusters[key]) {
          clusters[key] = {
            lat: c.latitude,
            lon: c.longitude,
            count: 0,
            critical: 0,
            locality: c.locality,
            city: c.city,
          };
        }
        clusters[key].count += 1;
        if (c.severity === 'critical' && c.status !== 'resolved') {
          clusters[key].critical += 1;
        }
      });

      Object.values(clusters).forEach((cluster) => {
        const radius = Math.min(800 + cluster.count * 250, 3000);
        const hasCritical = cluster.critical > 0;
        const color = hasCritical ? '#D64545' : cluster.count > 3 ? '#F28C28' : '#1261A0';

        const circle = L.circle([cluster.lat, cluster.lon], {
          color,
          fillColor: color,
          fillOpacity: 0.35,
          weight: 2,
          radius,
        }).addTo(hotspotsLayer);

        circle.bindTooltip(`
          <div style="font-family: system-ui, sans-serif; font-size: 11px; font-weight: bold; padding: 4px;">
            <div style="font-size: 12px; color: ${color}; font-weight: 800;">📍 ${cluster.locality} (${cluster.city})</div>
            <div>Total Issues: ${cluster.count}</div>
            ${cluster.critical ? `<div style="color: #D64545;">🚨 Critical Risks: ${cluster.critical}</div>` : ''}
          </div>
        `, { sticky: true });
      });
    }
  }, [complaints, viewMode, selectedId, L]);

  // Flood Risk Zones Layer
  useEffect(() => {
    if (!floodZonesLayerRef.current || !L) return;
    const floodLayer = floodZonesLayerRef.current;
    floodLayer.clearLayers();

    if (showFloodZones) {
      FLOOD_RISK_ZONES.forEach((zone) => {
        const color = zone.riskLevel === 'critical' ? '#dc2626' : zone.riskLevel === 'high' ? '#ea580c' : '#d97706';
        const circle = L.circle([zone.latitude, zone.longitude], {
          color,
          fillColor: color,
          fillOpacity: 0.28,
          weight: 2,
          dashArray: '6, 6',
          radius: zone.radiusMeters,
        }).addTo(floodLayer);

        circle.bindTooltip(`
          <div style="font-family: system-ui, sans-serif; font-size: 11px; padding: 6px; max-width: 220px;">
            <div style="font-size: 12px; font-weight: 800; color: ${color};">🌊 ${zone.name}</div>
            <div style="font-weight: 700; color: #334155; margin-top: 2px;">Risk: ${zone.riskLevel.toUpperCase()}</div>
            <div style="color: #64748b; font-size: 10px; margin-top: 4px;">${zone.monsoonVulnerabilityNotes}</div>
          </div>
        `, { sticky: true });
      });
    }
  }, [showFloodZones, L]);

  // Export complaints as GeoJSON
  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: complaints.map((c) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [c.longitude, c.latitude],
        },
        properties: {
          ticketId: c.ticketId,
          title: c.title,
          category: c.category,
          severity: c.severity,
          status: c.status,
          ward: c.ward,
          locality: c.locality,
          city: c.city,
          createdAt: c.createdAt,
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nagar360-civic-data-${new Date().toISOString().split('T')[0]}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // GPS Locate Current Position
  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current || !L) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        setIsLocating(false);

        const map = mapInstanceRef.current;
        map.flyTo([latitude, longitude], 14, { duration: 1.5 });

        // Add GPS user beacon
        const userIcon = L.divIcon({
          className: 'user-gps-beacon',
          html: `
            <div style="position: relative; width: 24px; height: 24px;">
              <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(18,97,160,0.3); animation: ping 2s infinite;"></div>
              <div style="background: #1261A0; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(18,97,160,0.8);"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker([latitude, longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>📍 Your Detected Location</b>')
          .openPopup();
      },
      () => {
        setIsLocating(false);
        alert('Could not retrieve GPS location. Please ensure location permissions are granted.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  if (!isMounted) {
    return (
      <div className="w-full h-full min-h-[480px] bg-slate-100 rounded-3xl flex items-center justify-center text-gray-500 text-xs font-semibold">
        Loading Nagar360 Interactive Map...
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-3xl overflow-hidden border border-gray-200 shadow-md relative transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none h-screen' : 'h-full min-h-[500px]'
      }`}
    >
      {/* Top Left Floating Controls (Pins vs Hotspots & GPS) */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-2">
        {/* View Mode Toggle */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-gray-300 shadow-md flex items-center gap-1 text-[11px] font-bold text-gray-700">
          <button
            onClick={() => setViewMode('pins')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              viewMode === 'pins' ? 'bg-[#1261A0] text-white shadow-xs' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Markers ({complaints.length})</span>
          </button>
          <button
            onClick={() => setViewMode('hotspots')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              viewMode === 'hotspots' ? 'bg-[#D64545] text-white shadow-xs' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Hotspots & Clusters</span>
          </button>
        </div>

        {/* GPS Locate Me Button */}
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className="bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-gray-300 shadow-md hover:bg-gray-50 text-[#1261A0] transition-colors flex items-center gap-1 text-[11px] font-bold"
          title="Locate Me (GPS)"
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin text-amber-500' : ''}`} />
          <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My GPS'}</span>
        </button>

        {/* Flood Risk Zones Layer Toggle */}
        <button
          onClick={() => setShowFloodZones(!showFloodZones)}
          className={`backdrop-blur-md px-3 py-1.5 rounded-2xl border shadow-md transition-all flex items-center gap-1.5 text-[11px] font-bold ${
            showFloodZones
              ? 'bg-rose-600 text-white border-rose-600'
              : 'bg-white/95 text-slate-700 border-gray-300 hover:bg-gray-50'
          }`}
          title="Toggle Flood Risk & Monsoon Vulnerability Zones"
        >
          <Waves className="w-3.5 h-3.5 text-blue-400" />
          <span>Flood Zones</span>
        </button>

        {/* Export GeoJSON Button */}
        <button
          onClick={handleExportGeoJSON}
          className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-gray-300 shadow-md hover:bg-gray-50 text-slate-700 transition-colors flex items-center gap-1 text-[11px] font-bold"
          title="Export Mapped Data as GeoJSON"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden md:inline">Export GIS</span>
        </button>
      </div>

      {/* Top Right Floating Controls (Tile Switcher & Fullscreen) */}
      <div className="absolute top-3 right-14 z-[400] flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-gray-300 shadow-md flex items-center gap-1 text-[11px] font-bold text-gray-700">
          <Layers className="w-3.5 h-3.5 text-[#1261A0] ml-1.5 hidden sm:inline" />
          <button
            onClick={() => setTileMode('standard')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              tileMode === 'standard' ? 'bg-[#1261A0] text-white' : 'hover:bg-gray-100'
            }`}
          >
            Street
          </button>
          <button
            onClick={() => setTileMode('dark')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              tileMode === 'dark' ? 'bg-[#1261A0] text-white' : 'hover:bg-gray-100'
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setTileMode('satellite')}
            className={`px-2.5 py-1 rounded-xl transition-all ${
              tileMode === 'satellite' ? 'bg-[#1261A0] text-white' : 'hover:bg-gray-100'
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-gray-300 shadow-md hover:bg-gray-50 text-gray-700"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Floating Legend & Hint */}
      <div className="absolute bottom-4 left-4 z-[400] flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-gray-300 shadow-md flex items-center gap-3 text-[10px] font-bold text-gray-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Medium/Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Resolved</span>
          </div>
        </div>

        <div className="hidden md:flex bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-semibold px-3 py-2 rounded-2xl items-center gap-1.5 shadow-md">
          <PlusCircle className="w-3.5 h-3.5 text-[#F28C28]" />
          <span>Click anywhere on map to drop pin & file complaint</span>
        </div>
      </div>

      {/* Leaflet DOM Node */}
      <div id="nagar360-leaflet-map" className="w-full h-full min-h-[500px]" />
    </div>
  );
};
