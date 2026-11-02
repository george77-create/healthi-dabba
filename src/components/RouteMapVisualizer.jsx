import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

const KITCHEN_GODOWN = { 
  lat: 13.6288, 
  lng: 79.4192, 
  name: 'Central Godown & Kitchen', 
  address: 'Annamaiah Circle, AIR Bypass Road, Tirupati' 
};

export default function RouteMapVisualizer({
  route,
  stops = [],
  focusedStop = null,
  onSelectStop,
  viewMode = 'm', // 'm' = clean roadmap, 'k' = satellite
  displayMode = 'pin', // 'pin' = clean single pin focus, 'directions' = connected real road route
  getCustomerCoordinates
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const layersGroupRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const [isLoadingRoads, setIsLoadingRoads] = useState(false);

  // 1. Initialize Leaflet Map Instance once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }

      if (!mapInstanceRef.current) {
        const initialLat = focusedStop && getCustomerCoordinates ? getCustomerCoordinates(focusedStop).lat : KITCHEN_GODOWN.lat;
        const initialLng = focusedStop && getCustomerCoordinates ? getCustomerCoordinates(focusedStop).lng : KITCHEN_GODOWN.lng;

        const map = L.map(mapContainerRef.current, {
          center: [initialLat, initialLng],
          zoom: 14,
          zoomControl: false,
          attributionControl: false
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const group = L.layerGroup().addTo(map);
        layersGroupRef.current = group;
        mapInstanceRef.current = map;
      }
    } catch (err) {
      console.error("Leaflet init error:", err);
      setMapError(true);
    }

    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (e) {
        console.error("Leaflet cleanup error:", e);
      }
    };
  }, []);

  // 2. Handle Roadmap vs Satellite View Switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }

      let tileUrl = '';
      let maxZoom = 19;

      if (viewMode === 'k') {
        // High-resolution satellite imagery (Esri World Imagery)
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        maxZoom = 18;
      } else {
        // Clean OpenStreetMap style roads
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        maxZoom = 19;
      }

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      tileLayerRef.current = tileLayer;
    } catch (err) {
      console.error("Leaflet tile layer error:", err);
    }
  }, [viewMode]);

  // 3. Render Pins & Real Road Route Curves
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    let isMounted = true;

    try {
      group.clearLayers();

      const godownLatLng = [KITCHEN_GODOWN.lat, KITCHEN_GODOWN.lng];

      // Helper to create the Godown Hub marker
      const createGodownMarker = () => {
        const icon = L.divIcon({
          className: 'hd-map-marker',
          html: `
            <div style="
              background: #1A3D17; 
              color: #FAF9F5; 
              border: 2px solid #FFFFFF; 
              border-radius: 9999px; 
              padding: 5px 11px; 
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 11px; 
              font-weight: 800; 
              box-shadow: 0 4px 14px rgba(0,0,0,0.35); 
              display: flex; 
              align-items: center; 
              gap: 5px; 
              cursor: pointer;
              white-space: nowrap;
              transform: translate(-50%, -50%);
            ">
              <span style="font-size: 13px;">🍳</span>
              <span>Godown Hub</span>
            </div>
          `,
          iconSize: [0, 0]
        });

        return L.marker(godownLatLng, { icon }).bindPopup(`
          <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; min-width: 180px;">
            <strong style="color: #1A3D17; font-size: 13px;">🍳 Central Kitchen Godown</strong>
            <p style="margin: 4px 0 0; color: #666; font-size: 11px;">Madhapur Hitec City Hub</p>
          </div>
        `);
      };

      // Helper to create a Customer Stop Marker
      const createStopMarker = (stop, idx) => {
        const coord = getCustomerCoordinates ? getCustomerCoordinates(stop) : { lat: 17.4485, lng: 78.3908 };
        const stopLatLng = [coord.lat, coord.lng];
        const hasPickup = stop.dabbasHeld && stop.dabbasHeld.length > 0;

        const icon = L.divIcon({
          className: 'hd-map-marker',
          html: `
            <div style="
              background: #C85A32; 
              color: #FAF9F5; 
              border: 2px solid #FFFFFF; 
              border-radius: 9999px; 
              padding: 6px 12px; 
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 11px; 
              font-weight: 800; 
              box-shadow: 0 0 0 3px rgba(200,90,50,0.45), 0 6px 16px rgba(0,0,0,0.35); 
              display: flex; 
              align-items: center; 
              gap: 6px; 
              cursor: pointer;
              white-space: nowrap;
              transform: translate(-50%, -50%);
            ">
              <span style="
                background: rgba(255,255,255,0.25); 
                width: 18px; 
                height: 18px; 
                border-radius: 50%; 
                display: inline-flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 10px;
                font-weight: 900;
              ">#${idx + 1}</span>
              <span>${stop.name}</span>
              ${hasPickup ? '<span style="font-size: 11px;" title="Collect Box">📦</span>' : ''}
            </div>
          `,
          iconSize: [0, 0]
        });

        const marker = L.marker(stopLatLng, { icon });
        marker.bindPopup(`
          <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; min-width: 200px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <strong style="color: #1A3D17; font-size: 13px;">Stop #${idx + 1}: ${stop.name}</strong>
            </div>
            <p style="margin: 3px 0; color: #555; font-size: 11px; line-height: 1.3;">📍 ${stop.address}</p>
            <p style="margin: 3px 0; color: #1A3D17; font-size: 11px; font-weight: 600;">📞 ${stop.phone}</p>
            ${hasPickup ? `<div style="margin-top: 6px; padding: 4px 8px; background: #fffbeb; border-radius: 6px; border: 1px solid #fde68a; font-size: 10px; color: #92400e; font-weight: bold;">⚠️ Empty Box Return: ${stop.dabbasHeld.join(', ')}</div>` : ''}
          </div>
        `);

        return { marker, latLng: stopLatLng };
      };

      // Helper to fetch and draw REAL ROAD curves from OSRM routing engine
      const drawRealRoadRoute = async (points) => {
        if (points.length < 2) return;

        // Draw initial straight guide line while loading road network curves
        const guideLine = L.polyline(points, {
          color: '#1A3D17',
          weight: 3.5,
          opacity: 0.6,
          dashArray: '6, 8'
        });
        group.addLayer(guideLine);

        setIsLoadingRoads(true);

        try {
          const coordParam = points.map(([lat, lng]) => `${lng},${lat}`).join(';');
          const url = `https://router.project-osrm.org/route/v1/driving/${coordParam}?overview=full&geometries=geojson`;
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            if (isMounted && data.routes && data.routes[0]?.geometry?.coordinates) {
              const roadCoordinates = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);

              // Remove guide line and render real road curve line
              group.removeLayer(guideLine);

              const roadPolyline = L.polyline(roadCoordinates, {
                color: '#1A3D17',
                weight: 5,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round'
              });
              group.addLayer(roadPolyline);

              const bounds = L.latLngBounds(roadCoordinates);
              map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
              setIsLoadingRoads(false);
              return;
            }
          }
        } catch (err) {
          console.warn("OSRM road calculation fallback:", err);
        }

        if (isMounted) {
          setIsLoadingRoads(false);
          const bounds = L.latLngBounds(points);
          map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
        }
      };

      // =========================================================================
      // CASE A: 'pin' MODE (Clean Single Pin Focus on Customer Location)
      // =========================================================================
      if (displayMode === 'pin') {
        if (focusedStop) {
          // Show ONLY that customer's exact pin
          const stopIdx = stops.findIndex(s => s.id === focusedStop.id);
          const { marker, latLng } = createStopMarker(focusedStop, stopIdx >= 0 ? stopIdx : 0);
          group.addLayer(marker);

          // Center smoothly at 16x zoom
          map.setView(latLng, 16);
        } else {
          // If All Circuit selected in pin mode, show Godown Hub pin
          const godownMarker = createGodownMarker();
          group.addLayer(godownMarker);

          map.setView(godownLatLng, 14);
        }
      }

      // =========================================================================
      // CASE B: 'directions' MODE (Real Road Driving Route following Street Curves)
      // =========================================================================
      else if (displayMode === 'directions') {
        const godownMarker = createGodownMarker();
        group.addLayer(godownMarker);

        if (focusedStop) {
          // Route from Godown to Focused Customer
          const stopIdx = stops.findIndex(s => s.id === focusedStop.id);
          const { marker, latLng } = createStopMarker(focusedStop, stopIdx >= 0 ? stopIdx : 0);
          group.addLayer(marker);

          // Fetch real road curves following Hyderabad streets
          drawRealRoadRoute([godownLatLng, latLng]);

        } else if (stops.length > 0) {
          // Full Circuit Loop: Godown ➔ Stop 1 ➔ Stop 2 ➔ Return Hub
          const allPoints = [godownLatLng];

          stops.forEach((stop, idx) => {
            const { marker, latLng } = createStopMarker(stop, idx);
            group.addLayer(marker);
            allPoints.push(latLng);
          });

          // Return loop back to Godown
          const circuitPoints = [...allPoints, godownLatLng];
          drawRealRoadRoute(circuitPoints);
        } else {
          map.setView(godownLatLng, 14);
        }
      }
    } catch (err) {
      console.error("Leaflet render error:", err);
    }

    return () => {
      isMounted = false;
    };
  }, [stops, focusedStop, displayMode, getCustomerCoordinates]);

  // Fallback if Leaflet fails in environment
  if (mapError) {
    const query = focusedStop && getCustomerCoordinates 
      ? `${getCustomerCoordinates(focusedStop).lat},${getCustomerCoordinates(focusedStop).lng}` 
      : `${KITCHEN_GODOWN.lat},${KITCHEN_GODOWN.lng}`;
    return (
      <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-edge shadow-apple-sm bg-cream-100">
        <iframe
          title="Map Route Visualizer"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=${viewMode}&z=15&hl=en&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Fast, Clean Native Leaflet Map Viewport */}
      <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-edge shadow-apple-sm bg-cream-100">
        <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

        {/* Dynamic Mode Badge at top right */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <div className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-extrabold text-charcoal shadow-apple-sm border border-black/5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse"></span>
            <span>
              {displayMode === 'pin' 
                ? (focusedStop ? `Single Pin Focus: #${stops.findIndex(s => s.id === focusedStop.id) + 1} ${focusedStop.name}` : 'Godown Hub Pin')
                : (isLoadingRoads ? 'Calculating Real Road Curves...' : (focusedStop ? `Real Road Route: Godown ➔ ${focusedStop.name}` : 'Real Road Delivery Loop'))}
            </span>
          </div>
        </div>

        {/* Road Engine Indicator at bottom left */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <div className="px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-[9px] font-bold text-charcoal-muted shadow-apple-sm border border-black/5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Real Driving Roads & Curves</span>
          </div>
        </div>
      </div>
    </div>
  );
}
