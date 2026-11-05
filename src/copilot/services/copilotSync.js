// Driver Copilot Sync & Utility Service
// Healthi Dabba — Real-Time Logistics Sync Engine

/**
 * Plays a crisp synthesized audio chime using Web Audio API.
 * type: 'success' (pleasant double beep) | 'alert' (low warning tone) | 'click'
 */
export function playCopilotSound(type = 'success') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'success') {
      // Pleasant double chime: 523Hz (C5) -> 659Hz (E5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.15);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12);
      gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.12);
      osc2.stop(ctx.currentTime + 0.35);
    } else if (type === 'alert') {
      // Warning double pulse (330Hz -> 261Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      osc.frequency.setValueAtTime(261.63, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else {
      // Soft click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (err) {
    // Audio context may be restricted before user interaction
    console.debug('Copilot audio chime muted:', err);
  }
}

/**
 * Triggers mobile haptic vibration if supported by phone.
 */
export function triggerHaptic(pattern = [80, 40, 80]) {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (e) {}
}

/**
 * Formats Google Maps turn-by-turn navigation URL for bike/car.
 */
export function getNavigationUrl(coordinates, address) {
  if (coordinates && coordinates.lat && coordinates.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&travelmode=two-wheeler`;
  }
  const cleanAddr = encodeURIComponent(address || 'Tirupati, Andhra Pradesh');
  return `https://www.google.com/maps/dir/?api=1&destination=${cleanAddr}&travelmode=two-wheeler`;
}

/**
 * Calculates geographic distance in kilometers between two lat/lng points using Haversine formula.
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Optimizes the stop sequence to find the "Easiest & Shortest Route"
 * Starts from Central Hub, progressively picks the nearest next customer (Nearest-Neighbor algorithm).
 */
export function optimizeEasiestRoute(hub, stops = []) {
  if (stops.length <= 1) return [...stops];

  const remaining = [...stops];
  const sorted = [];
  let currentPos = { lat: hub.lat, lng: hub.lng };

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let shortestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const s = remaining[i];
      const sLat = s.coordinates?.lat || hub.lat;
      const sLng = s.coordinates?.lng || hub.lng;
      const dist = calculateDistanceKm(currentPos.lat, currentPos.lng, sLat, sLng);
      if (dist < shortestDist) {
        shortestDist = dist;
        nearestIdx = i;
      }
    }

    const [nearestStop] = remaining.splice(nearestIdx, 1);
    sorted.push(nearestStop);
    currentPos = {
      lat: nearestStop.coordinates?.lat || currentPos.lat,
      lng: nearestStop.coordinates?.lng || currentPos.lng
    };
  }

  return sorted;
}

// ============================================================================
// REAL-TIME CLOUD & LOCAL TWO-WAY SYNC ENGINE (CROSS-DEVICE & CROSS-TAB)
// ============================================================================

const SYNC_TOPIC = 'healthi_dabba_sync_george_live';
const CLOUD_SYNC_URL = `https://ntfy.sh/${SYNC_TOPIC}`;

let localChannel = null;
try {
  if (typeof window !== 'undefined' && window.BroadcastChannel) {
    localChannel = new BroadcastChannel('healthi_dabba_sync_channel');
  }
} catch (e) {}

/**
 * Publishes a live sync event to both local browser tabs AND cross-device cloud stream.
 */
export async function publishLiveSyncEvent(eventPayload) {
  const messageWithMeta = {
    ...eventPayload,
    senderId: typeof window !== 'undefined' ? (window.__healthi_client_id || (window.__healthi_client_id = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`)) : 'server',
    sentAt: Date.now()
  };

  // 1. Same-device instant tab-to-tab sync via BroadcastChannel
  try {
    if (localChannel) {
      localChannel.postMessage(messageWithMeta);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('healthi_sync_event', { detail: messageWithMeta }));
    }
  } catch (e) {
    console.debug('Local broadcast error:', e);
  }

  // 2. Cross-device Cloud Pub/Sub via lightweight EventStream (Phone -> Laptop / Laptop -> Phone)
  try {
    if (typeof fetch !== 'undefined') {
      await fetch(CLOUD_SYNC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageWithMeta)
      });
    }
  } catch (err) {
    console.debug('Cloud sync publish notice:', err);
  }
}

/**
 * Listens for live sync events from both local tabs AND cross-device cloud stream.
 * Triggers callback when a delivery, pickup, or not-available event happens.
 */
export function subscribeToLiveSync(onMessageCallback) {
  if (typeof window === 'undefined') return () => {};

  const myClientId = window.__healthi_client_id || (window.__healthi_client_id = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);

  const handleMessage = (data) => {
    if (!data) return;
    // Prevent echo loop from same client tab
    if (data.senderId === myClientId) return;
    onMessageCallback(data);
  };

  // 1. Local Broadcast Channel listener
  const channelListener = (e) => {
    handleMessage(e.data);
  };
  if (localChannel) {
    localChannel.addEventListener('message', channelListener);
  }

  // 2. In-window custom event listener
  const domListener = (e) => {
    handleMessage(e.detail);
  };
  window.addEventListener('healthi_sync_event', domListener);

  // 3. Cross-device Cloud SSE Stream listener
  let eventSource = null;
  try {
    if (typeof window.EventSource !== 'undefined') {
      eventSource = new EventSource(`${CLOUD_SYNC_URL}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const envelope = JSON.parse(event.data);
          if (envelope.message) {
            const parsed = typeof envelope.message === 'string' ? JSON.parse(envelope.message) : envelope.message;
            handleMessage(parsed);
          }
        } catch (e) {}
      };
    }
  } catch (err) {
    console.debug('SSE Cloud sync notice:', err);
  }

  // Cleanup unsubscriber
  return () => {
    if (localChannel) {
      localChannel.removeEventListener('message', channelListener);
    }
    window.removeEventListener('healthi_sync_event', domListener);
    if (eventSource) {
      eventSource.close();
    }
  };
}

/**
 * Exception reasons for "Customer Not Available"
 */
export const NOT_AVAILABLE_REASONS = [
  { id: 'door_locked', label: 'Door Locked / House Closed', icon: 'Lock' },
  { id: 'phone_unreachable', label: 'Phone Not Reachable / No Answer', icon: 'PhoneOff' },
  { id: 'customer_refused', label: 'Customer Refused / Postponed to Dinner', icon: 'XCircle' },
  { id: 'security_handover', label: 'Left with Building Watchman / Security', icon: 'ShieldCheck' },
  { id: 'address_not_found', label: 'Address Incorrect / Landmark Missing', icon: 'MapPinOff' },
];
