import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Camera, 
  QrCode, 
  CheckCircle2, 
  Sparkles, 
  Keyboard, 
  AlertCircle,
  RefreshCw,
  Zap
} from 'lucide-react';
import { playCopilotSound, triggerHaptic } from '../services/copilotSync';

export default function CopilotQRScanner({
  isOpen,
  onClose,
  targetCustomer = null,
  expectedDabba = null,
  allAvailableDabbas = [],
  onScanSuccess
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Suggested code candidates
  const suggestedCodes = [];
  if (expectedDabba) suggestedCodes.push(expectedDabba);
  if (targetCustomer?.dabbasHeld && targetCustomer.dabbasHeld.length > 0) {
    targetCustomer.dabbasHeld.forEach(c => {
      if (!suggestedCodes.includes(c)) suggestedCodes.push(c);
    });
  }
  // Add 2 generic active boxes if list is small
  if (suggestedCodes.length < 3 && allAvailableDabbas.length > 0) {
    allAvailableDabbas.slice(0, 3).forEach(d => {
      if (!suggestedCodes.includes(d.code)) suggestedCodes.push(d.code);
    });
  }

  // Start Camera Stream
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    async function startCamera() {
      try {
        setCameraError(null);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          });

          if (mounted) {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              await videoRef.current.play();
              setCameraActive(true);
            }
          }
        } else {
          setCameraError("Camera not supported on this browser.");
        }
      } catch (err) {
        console.warn("Camera access error:", err);
        if (mounted) {
          setCameraError("Camera permission denied or camera unavailable. You can use Quick Tap or Manual Entry below.");
        }
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Process code completion
  const handleProcessCode = (code) => {
    if (!code) return;
    const cleanCode = code.trim().toUpperCase();

    setIsVerifying(true);
    setScannedResult(cleanCode);
    playCopilotSound('success');
    triggerHaptic([100, 50, 120]);

    setTimeout(() => {
      onScanSuccess(cleanCode, targetCustomer);
      setIsVerifying(false);
      setScannedResult(null);
      setManualCode('');
      onClose();
    }, 800);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleProcessCode(manualCode);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-charcoal/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#FAF9F5] rounded-3xl shadow-2xl border border-edge overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-edge">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-charcoal tracking-tight font-apple">
                Scan Dabba QR Sticker
              </h3>
              <p className="text-xs text-charcoal-muted">
                {targetCustomer ? `${targetCustomer.name} (${targetCustomer.id})` : 'Verify Circular Dabba'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-cream-100 hover:bg-cream-200 border border-edge flex items-center justify-center text-charcoal-muted hover:text-charcoal transition-colors apple-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewport / Laser Scanner */}
        <div className="p-4 sm:p-5 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[320px] rounded-3xl overflow-hidden bg-charcoal border-2 border-forest-700/40 shadow-inner flex items-center justify-center">
            
            {/* Live Camera Feed */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                cameraActive ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Target Viewfinder Guides */}
            <div className="relative z-10 w-48 h-48 border-2 border-dashed border-white/60 rounded-2xl flex items-center justify-center pointer-events-none">
              {/* Corner Targets */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-forest-200 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-forest-200 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-forest-200 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-forest-200 rounded-br-lg" />

              {/* Animated Laser Beam */}
              {cameraActive && !scannedResult && (
                <div className="absolute left-2 right-2 h-0.5 bg-forest-300 shadow-[0_0_12px_#4ade80] animate-pulse" 
                     style={{ animation: 'bounce 2.2s infinite' }} />
              )}

              {/* Success Result Badge Overlay */}
              {scannedResult && (
                <div className="bg-forest-700 text-white p-3 rounded-2xl shadow-xl flex flex-col items-center gap-1.5 animate-scale-in">
                  <CheckCircle2 className="w-7 h-7 text-forest-200" />
                  <span className="text-xs font-bold">{scannedResult} Verified</span>
                </div>
              )}
            </div>

            {/* Camera Permission / Error Fallback Notice */}
            {cameraError && !cameraActive && (
              <div className="absolute inset-0 p-4 bg-charcoal/90 text-center flex flex-col items-center justify-center text-cream-50 space-y-2">
                <Camera className="w-8 h-8 text-cream-200/50" />
                <p className="text-xs text-cream-200/80 px-2 leading-relaxed">
                  {cameraError}
                </p>
              </div>
            )}
          </div>

          <p className="text-[11px] text-charcoal-muted mt-2 text-center">
            Align dabba lid QR label within the center box
          </p>
        </div>

        {/* Quick Tap Candidates (Instant 1-Click Scan) */}
        {suggestedCodes.length > 0 && (
          <div className="px-5 pb-3">
            <span className="text-[10px] uppercase font-bold text-charcoal-subtle tracking-wider block mb-1.5">
              Quick Verify (1-Tap):
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedCodes.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleProcessCode(code)}
                  className="py-1.5 px-3 rounded-xl bg-white border border-forest-200 text-forest-800 hover:bg-forest-50 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all apple-press"
                >
                  <Zap className="w-3 h-3 text-terracotta-700" />
                  <span>{code}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manual Code Input Form */}
        <form onSubmit={handleManualSubmit} className="p-4 sm:p-5 bg-white border-t border-edge flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Or enter code: e.g. DB-102"
              className="w-full pl-9 pr-3 py-2.5 bg-cream-100 rounded-xl border border-edge text-xs font-medium text-charcoal placeholder:text-charcoal-subtle uppercase focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700"
            />
            <Keyboard className="w-4 h-4 text-charcoal-muted absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            disabled={!manualCode.trim() || isVerifying}
            className="py-2.5 px-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream-50 text-xs font-bold shadow-sm transition-all apple-press disabled:opacity-40"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
