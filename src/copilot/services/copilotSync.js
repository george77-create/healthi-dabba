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
 * Exception reasons for "Customer Not Available"
 */
export const NOT_AVAILABLE_REASONS = [
  { id: 'door_locked', label: 'Door Locked / House Closed', icon: 'Lock' },
  { id: 'phone_unreachable', label: 'Phone Not Reachable / No Answer', icon: 'PhoneOff' },
  { id: 'customer_refused', label: 'Customer Refused / Postponed to Dinner', icon: 'XCircle' },
  { id: 'security_handover', label: 'Left with Building Watchman / Security', icon: 'ShieldCheck' },
  { id: 'address_not_found', label: 'Address Incorrect / Landmark Missing', icon: 'MapPinOff' },
];
