import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle,
  Locate,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getNavigationUrl, playCopilotSound } from '../services/copilotSync';

const KITCHEN_HUB = {
  lat: 13.6288,
  lng: 79.4192,
  name: 'Central Godown & Kitchen Hub',
  address: 'Annamaiah Circle, AIR Bypass Road, Tirupati'
};

export default function CopilotMapView({
  stops = [],
  focusedStopId = null,
  onSelectStop,
  onOpenScanner,
  onOpenNotAvailable
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [selectedStop, setSelectedStop] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Sync selected stop with external focusedStopId
  useEffect(() => {
    if (focusedStopId) {
      const found = stops.find(s => s.id === focusedStopId);
      if (found) setSelectedStop(found);
    }
  }, [focusedStopId, stops]);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }

      if (!mapInstanceRef.current) {
        const centerLat = stops.length > 0 && stops[0].coordinates ? stops[0].coordinates.lat : KITCHEN_HUB.lat;
        const centerLng = stops.length > 0 && stops[0].coordinates ? stops[0].coordinates.lng : KITCHEN_HUB.lng;

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 14,
          zoomControl: false,
          attributionControl: false
        });

        L.control.zoom({ position: 'topright' }).addTo(map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          subdomains: ['a', 'b', 'c']
        }).addTo(map);

        const group = L.layerGroup().addTo(map);
        layersGroupRef.current = group;
        mapInstanceRef.current = map;
      }
    } catch (err) {
      console.error("Leaflet map init error:", err);
    }

    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (e) {}
    };
  }, []);

  // 2. Render Markers & Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    const bounds = L.latLngBounds();

    // Central Kitchen Marker
    const kitchenIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="background-color: #1A3D17; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(26,61,23,0.4); border: 2.5px solid #FFFFFF;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const kMarker = L.marker([KITCHEN_HUB.lat, KITCHEN_HUB.lng], { icon: kitchenIcon });
    kMarker.bindTooltip("<b>Central Kitchen & Hub</b>", { direction: 'top' });
    group.addLayer(kMarker);
    bounds.extend([KITCHEN_HUB.lat, KITCHEN_HUB.lng]);

    // Customer Stops Markers
    const latLngs = [[KITCHEN_HUB.lat, KITCHEN_HUB.lng]];

    stops.forEach((stop, index) => {
      const lat = stop.coordinates?.lat || (KITCHEN_HUB.lat + (index + 1) * 0.004);
      const lng = stop.coordinates?.lng || (KITCHEN_HUB.lng + (index + 1) * 0.003);
      latLngs.push([lat, lng]);
      bounds.extend([lat, lng]);

      const isDelivered = stop.todayDeliveryStatus === 'Delivered';
      const isNotAvailable = stop.todayDeliveryStatus === 'Not Available';
      const isSelected = selectedStop?.id === stop.id;

      let bgColor = '#1A3D17'; // Default pending
      let innerContent = `${index + 1}`;

      if (isDelivered) {
        bgColor = '#2E7D32';
        innerContent = '✓';
      } else if (isNotAvailable) {
        bgColor = '#C85A32';
        innerContent = '!';
      }

      const markerHtml = `
        <div style="
          background-color: ${bgColor}; 
          color: white; 
          width: ${isSelected ? '38px' : '32px'}; 
          height: ${isSelected ? '38px' : '32px'}; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: bold; 
          font-size: ${isSelected ? '14px' : '12px'}; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.25); 
          border: ${isSelected ? '3px solid #FAF9F5' : '2px solid #FFFFFF'};
          transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
          transition: all 0.2s ease;
        ">
          ${innerContent}
        </div>
      `;

      const stopIcon = L.divIcon({
        className: 'custom-stop-marker',
        html: markerHtml,
        iconSize: [isSelected ? 38 : 32, isSelected ? 38 : 32],
        iconAnchor: [isSelected ? 19 : 16, isSelected ? 19 : 16]
      });

      const marker = L.marker([lat, lng], { icon: stopIcon });
      marker.on('click', () => {
        setSelectedStop(stop);
        if (onSelectStop) onSelectStop(stop.id);
        playCopilotSound('click');
      });

      group.addLayer(marker);
    });

    // Draw connecting Route Polyline
    if (latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: '#1A3D17',
        weight: 3.5,
        opacity: 0.7,
        dashArray: '6, 8',
        lineJoin: 'round'
      });
      group.addLayer(polyline);
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [stops, selectedStop]);

  // Handle Locate My Bike
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        const map = mapInstanceRef.current;
        if (map) {
          map.setView([latitude, longitude], 16);

          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const riderIcon = L.divIcon({
              className: 'custom-rider-marker',
              html: `
                <div style="background-color: #0284C7; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 6px rgba(2, 132, 199, 0.35); animation: pulse 2s infinite;"></div>
              `,
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            });
            userMarkerRef.current = L.marker([latitude, longitude], { icon: riderIcon }).addTo(map);
          }
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn("Location error:", err);
        alert("Could not fetch GPS location. Please check location permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden border border-edge bg-cream-100 flex flex-col shadow-sm">
      
      {/* Map Viewport */}
      <div ref={mapContainerRef} className="w-full flex-1 min-h-[360px] z-0" />

      {/* Floating Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleLocateMe}
          title="Locate My Bike (GPS)"
          className={`w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-edge/80 shadow-md flex items-center justify-center text-charcoal hover:bg-white transition-all apple-press ${
            isLocating ? 'animate-spin text-forest-700' : ''
          }`}
        >
          <Locate className="w-5 h-5" />
        </button>
      </div>

      {/* Map Legend Overlay (Top Left) */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-edge/80 shadow-sm text-[11px] font-semibold flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-forest-700 inline-block" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] inline-block" />
          <span>Delivered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta-700 inline-block" />
          <span>Issue</span>
        </div>
      </div>

      {/* Selected Customer Bottom Callout Card */}
      {selectedStop && (
        <div className="absolute bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-20 bg-white/95 backdrop-blur-xl p-4 rounded-3xl border border-edge shadow-apple-modal animate-slide-up">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-50 text-forest-700 border border-forest-100">
                  Stop #{stops.findIndex(s => s.id === selectedStop.id) + 1}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  selectedStop.todayDeliveryStatus === 'Delivered' 
                    ? 'bg-forest-50 text-[#2E7D32] border-forest-200' 
                    : selectedStop.todayDeliveryStatus === 'Not Available'
                    ? 'bg-terracotta-50 text-terracotta-700 border-terracotta-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {selectedStop.todayDeliveryStatus || 'Pending'}
                </span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-charcoal font-apple leading-tight">
                {selectedStop.name}
              </h4>
              <p className="text-xs text-charcoal-muted line-clamp-1 mt-0.5">
                {selectedStop.address}
              </p>
            </div>

            <button
              onClick={() => setSelectedStop(null)}
              className="text-xs text-charcoal-subtle hover:text-charcoal px-2 py-1"
            >
              ✕
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-edge/60">
            {/* 1. Navigate via Google Maps */}
            <a
              href={getNavigationUrl(selectedStop.coordinates, selectedStop.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-2xl bg-forest-700 hover:bg-forest-800 text-cream-50 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm apple-press"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate</span>
            </a>

            {/* 2. Direct Call */}
            <a
              href={`tel:${selectedStop.phone}`}
              className="py-2.5 px-3 rounded-2xl bg-cream-100 hover:bg-cream-200 border border-edge text-charcoal text-xs font-bold flex items-center justify-center gap-1.5 apple-press"
            >
              <Phone className="w-3.5 h-3.5 text-forest-700" />
              <span>Call</span>
            </a>

            {/* 3. Scan & Deliver */}
            {selectedStop.todayDeliveryStatus !== 'Delivered' ? (
              <button
                type="button"
                onClick={() => {
                  if (onOpenScanner) onOpenScanner(selectedStop);
                }}
                className="col-span-2 sm:col-span-1 py-2.5 px-3 rounded-2xl bg-terracotta-700 hover:bg-terracotta-800 text-cream-50 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm apple-press"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan Dabba</span>
              </button>
            ) : (
              <div className="col-span-2 sm:col-span-1 py-2 px-3 rounded-2xl bg-forest-50 border border-forest-100 text-[#2E7D32] text-xs font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
