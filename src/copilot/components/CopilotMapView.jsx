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
  Compass,
  Zap,
  Clock,
  Layers,
  ChevronUp,
  ChevronDown,
  ListOrdered,
  ArrowRight
} from 'lucide-react';
import { 
  getNavigationUrl, 
  playCopilotSound, 
  calculateDistanceKm, 
  optimizeEasiestRoute 
} from '../services/copilotSync';

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
  onOpenNotAvailable,
  onApplyOptimizedRoute
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [selectedStop, setSelectedStop] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoadingRoads, setIsLoadingRoads] = useState(false);
  const [isOptimized, setIsOptimized] = useState(true);
  const [showDirectionsDrawer, setShowDirectionsDrawer] = useState(false);

  // Road directions data from OSRM
  const [routeStats, setRouteStats] = useState({
    distanceKm: '—',
    durationMins: '—',
    steps: []
  });

  // Effective stops sequence (Optimized Easiest Route vs Original)
  const activeStops = isOptimized ? optimizeEasiestRoute(KITCHEN_HUB, stops) : stops;

  // Sync selected stop with external focusedStopId
  useEffect(() => {
    if (focusedStopId) {
      const found = activeStops.find(s => s.id === focusedStopId);
      if (found) setSelectedStop(found);
    }
  }, [focusedStopId, activeStops]);

  // 1. Initialize Leaflet Map Instance once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }

      if (!mapInstanceRef.current) {
        const centerLat = activeStops.length > 0 && activeStops[0].coordinates ? activeStops[0].coordinates.lat : KITCHEN_HUB.lat;
        const centerLng = activeStops.length > 0 && activeStops[0].coordinates ? activeStops[0].coordinates.lng : KITCHEN_HUB.lng;

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

  // 2. Fetch and Draw REAL ROAD CURVES (Directions along actual streets)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    let isMounted = true;
    group.clearLayers();
    const bounds = L.latLngBounds();

    // Central Kitchen Hub Marker
    const kitchenIcon = L.divIcon({
      className: 'custom-hub-marker',
      html: `
        <div style="background: #1A3D17; color: white; border: 2.5px solid white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(26,61,23,0.4); font-size: 16px;">
          🍳
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const kMarker = L.marker([KITCHEN_HUB.lat, KITCHEN_HUB.lng], { icon: kitchenIcon });
    kMarker.bindTooltip("<b>Central Kitchen & Hub</b><br/>Tirupati Dispatch Center", { direction: 'top' });
    group.addLayer(kMarker);
    bounds.extend([KITCHEN_HUB.lat, KITCHEN_HUB.lng]);

    // Customer Stops Markers
    const points = [[KITCHEN_HUB.lat, KITCHEN_HUB.lng]];

    activeStops.forEach((stop, index) => {
      const lat = stop.coordinates?.lat || (KITCHEN_HUB.lat + (index + 1) * 0.0035);
      const lng = stop.coordinates?.lng || (KITCHEN_HUB.lng + (index + 1) * 0.0028);
      points.push([lat, lng]);
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
          box-shadow: 0 4px 12px rgba(0,0,0,0.25); 
          border: ${isSelected ? '3px solid #C85A32' : '2px solid #FFFFFF'};
          transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
          transition: all 0.2s ease;
          cursor: pointer;
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

    // Fetch and Draw Real Road Curves from OSRM
    async function fetchRoadCurves() {
      if (points.length < 2) return;

      setIsLoadingRoads(true);

      // Temporary smooth dashed guide while road curve is loading
      const guideLine = L.polyline(points, {
        color: '#1A3D17',
        weight: 3,
        opacity: 0.45,
        dashArray: '4, 8'
      });
      group.addLayer(guideLine);

      try {
        // Limit to first 12 stops to stay well within OSRM public URL limits
        const routePoints = points.slice(0, 14);
        const coordString = routePoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson&steps=true`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4500);

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.routes && data.routes[0]) {
            const primaryRoute = data.routes[0];
            const roadCoords = primaryRoute.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

            // Remove dashed guide line and render real road curve line
            group.removeLayer(guideLine);

            // 1. Dark Road Outer Casing (High visibility on all map zooms)
            const roadCasing = L.polyline(roadCoords, {
              color: '#0D230C',
              weight: 6.5,
              opacity: 0.95,
              lineCap: 'round',
              lineJoin: 'round'
            });
            group.addLayer(roadCasing);

            // 2. Vibrant Forest Emerald Core Line
            const roadCore = L.polyline(roadCoords, {
              color: '#34D399',
              weight: 3.5,
              opacity: 1,
              lineCap: 'round',
              lineJoin: 'round'
            });
            group.addLayer(roadCore);

            // Calculate metrics & extracted turn directions
            const distKm = (primaryRoute.distance / 1000).toFixed(1);
            const durationMins = Math.round(primaryRoute.duration / 60);

            // Extract turn-by-turn steps
            const extractedSteps = [];
            if (primaryRoute.legs) {
              primaryRoute.legs.forEach((leg, legIdx) => {
                const targetCustomer = activeStops[legIdx];
                if (leg.steps) {
                  leg.steps.forEach(step => {
                    if (step.name && step.distance > 30) {
                      extractedSteps.push({
                        instruction: `${step.maneuver?.type === 'turn' ? 'Turn onto ' : 'Continue on '} ${step.name}`,
                        distance: `${Math.round(step.distance)}m`,
                        stopName: targetCustomer?.name
                      });
                    }
                  });
                }
                if (targetCustomer) {
                  extractedSteps.push({
                    instruction: `Arrive at Stop #${legIdx + 1}: ${targetCustomer.name}`,
                    distance: 'Destination',
                    isStopArrival: true,
                    stop: targetCustomer
                  });
                }
              });
            }

            setRouteStats({
              distanceKm: `${distKm} km`,
              durationMins: `${durationMins} mins`,
              steps: extractedSteps.slice(0, 10)
            });
          }
        }
      } catch (err) {
        console.debug("OSRM real road route fallback:", err);
      } finally {
        if (isMounted) setIsLoadingRoads(false);
      }
    }

    fetchRoadCurves();

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }

    return () => {
      isMounted = false;
    };
  }, [activeStops, selectedStop, isOptimized]);

  // Handle Locate My Bike (GPS)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
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
        alert("GPS location unavailable. Please verify location permissions.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-3xl overflow-hidden border border-edge bg-cream-100 flex flex-col shadow-sm">
      
      {/* 1. Map Viewport */}
      <div ref={mapContainerRef} className="w-full flex-1 min-h-[400px] z-0" />

      {/* 2. Top Route Statistics & Easiest Route Switcher Banner */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Real Road Metrics Pill */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-edge shadow-md flex items-center gap-3 text-xs font-bold text-charcoal">
          <div className="flex items-center gap-1.5 text-forest-800">
            <Compass className="w-4 h-4 text-forest-700 animate-spin-slow" />
            <span>{isLoadingRoads ? 'Routing...' : routeStats.distanceKm}</span>
          </div>
          <span className="text-edge">|</span>
          <div className="flex items-center gap-1.5 text-charcoal-muted">
            <Clock className="w-3.5 h-3.5 text-terracotta-700" />
            <span>{routeStats.durationMins} riding</span>
          </div>
        </div>

        {/* Right: Easiest Route Optimization Toggle & Directions Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Easiest Route Button */}
          <button
            type="button"
            onClick={() => {
              setIsOptimized(prev => !prev);
              playCopilotSound('click');
            }}
            className={`px-3 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 shadow-md transition-all apple-press ${
              isOptimized
                ? 'bg-forest-700 text-cream-50 border-forest-800'
                : 'bg-white/95 backdrop-blur-md text-charcoal border-edge hover:bg-white'
            }`}
            title="Sort stops for shortest travel distance"
          >
            <Zap className={`w-3.5 h-3.5 ${isOptimized ? 'text-cream-100' : 'text-amber-600'}`} />
            <span>{isOptimized ? 'Easiest Route ON' : 'Default Order'}</span>
          </button>

          {/* Turn-by-Turn Directions Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowDirectionsDrawer(prev => !prev)}
            className="px-3 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-edge shadow-md text-xs font-bold text-charcoal flex items-center gap-1.5 hover:bg-white apple-press"
          >
            <ListOrdered className="w-3.5 h-3.5 text-forest-700" />
            <span>Turns</span>
            {showDirectionsDrawer ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>

          {/* GPS Locate Me Button */}
          <button
            type="button"
            onClick={handleLocateMe}
            className={`w-9 h-9 rounded-2xl bg-white/95 backdrop-blur-md border border-edge shadow-md flex items-center justify-center text-charcoal hover:bg-white transition-all apple-press ${
              isLocating ? 'animate-spin text-forest-700' : ''
            }`}
            title="My Live GPS Location"
          >
            <Locate className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 3. Turn-by-Turn Real Street Directions Drawer */}
      {showDirectionsDrawer && routeStats.steps.length > 0 && (
        <div className="absolute top-16 left-3 right-3 sm:right-auto sm:w-80 z-20 bg-white/95 backdrop-blur-xl p-4 rounded-3xl border border-edge shadow-apple-modal animate-slide-up max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-edge">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-forest-700" />
              <h4 className="font-bold text-xs text-charcoal uppercase tracking-wider">
                Turn-by-Turn Road Route
              </h4>
            </div>
            <button
              onClick={() => setShowDirectionsDrawer(false)}
              className="text-xs text-charcoal-muted hover:text-charcoal"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            {routeStats.steps.map((st, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl text-xs flex items-start justify-between gap-2 ${
                  st.isStopArrival 
                    ? 'bg-forest-50 border border-forest-100 font-bold text-forest-800' 
                    : 'bg-cream-50/70 border border-edge/60 text-charcoal'
                }`}
              >
                <div className="flex items-start gap-1.5">
                  <span className="text-[10px] text-charcoal-muted mt-0.5">•</span>
                  <span>{st.instruction}</span>
                </div>
                <span className="text-[10px] text-charcoal-muted font-bold whitespace-nowrap">
                  {st.distance}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Selected Customer Bottom Callout Card */}
      {selectedStop && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4 z-20 bg-white/95 backdrop-blur-xl p-4 rounded-3xl border border-edge shadow-apple-modal animate-slide-up">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-50 text-forest-700 border border-forest-100">
                  Stop #{activeStops.findIndex(s => s.id === selectedStop.id) + 1}
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
            {/* 1. Turn-by-Turn GPS Voice Navigation */}
            <a
              href={getNavigationUrl(selectedStop.coordinates, selectedStop.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-2xl bg-forest-700 hover:bg-forest-800 text-cream-50 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm apple-press"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Voice GPS</span>
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
