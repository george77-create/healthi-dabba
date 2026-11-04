import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { 
  X, 
  Camera, 
  QrCode, 
  CheckCircle2, 
  Sparkles, 
  Keyboard, 
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Zap,
  Package,
  User,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { playCopilotSound, triggerHaptic } from '../services/copilotSync';

export default function CopilotQRScanner({
  isOpen,
  onClose,
  targetCustomer = null,
  allAvailableDabbas = [],
  damagedLedger = [],
  pendingCustomers = [],
  onScanSuccess
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [manualCode, setManualCode] = useState('');
  
  // Verification dialog states
  const [verificationResult, setVerificationResult] = useState(null); 
  // { status: 'success' | 'damaged' | 'not_found', dabbaCode: string, dabba: object, customer: object }

  // 1. Start Camera and Continuous QR Decoding Loop
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setVerificationResult(null);

    async function startCameraAndScanner() {
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

          if (isMounted) {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              await videoRef.current.play();
              setCameraActive(true);
              scanQRCodeFrames();
            }
          }
        } else {
          setCameraError("Camera is not supported on this browser.");
        }
      } catch (err) {
        console.warn("Camera access error:", err);
        if (isMounted) {
          setCameraError("Camera permission denied. You can use Quick Tap or Manual Code Entry below.");
        }
      }
    }

    startCameraAndScanner();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  // Real-time Frame Decoding Loop using jsQR & BarcodeDetector fallback
  const scanQRCodeFrames = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const scanFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Decode QR using jsQR library
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          // Detected QR Code from camera frame!
          handleVerifyDabbaCode(code.data);
          return; // Stop loop once detected
        }
      }

      animationFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  if (!isOpen) return null;

  // Extract clean dabba code from string or URL
  const extractDabbaCode = (raw) => {
    if (!raw) return '';
    const upper = raw.trim().toUpperCase();
    const match = upper.match(/DB-?\d+/);
    if (match) {
      const num = match[0].replace(/\D/g, '');
      return `DB-${num}`;
    }
    return upper;
  };

  // 2. Perform Real Verification Against Dabbas Database
  const handleVerifyDabbaCode = (rawCode) => {
    const cleanCode = extractDabbaCode(rawCode);
    if (!cleanCode) return;

    // A. Check if permanently Damaged / Scrapped
    const damagedEntry = damagedLedger.find(d => d.retiredCode === cleanCode);
    if (damagedEntry) {
      playCopilotSound('alert');
      triggerHaptic([150, 100, 150]);
      setVerificationResult({
        status: 'damaged',
        dabbaCode: cleanCode,
        damagedInfo: damagedEntry
      });
      return;
    }

    // B. Check if active in Fleet Inventory
    const dabbaInFleet = allAvailableDabbas.find(d => d.code === cleanCode);
    if (!dabbaInFleet) {
      playCopilotSound('alert');
      triggerHaptic([100, 50, 100]);
      setVerificationResult({
        status: 'not_found',
        dabbaCode: cleanCode
      });
      return;
    }

    // C. Dabba is Valid & Active!
    playCopilotSound('success');
    triggerHaptic([100, 50, 120]);

    // Match with target customer or pending customers
    const assignedCustomer = targetCustomer || 
      pendingCustomers.find(c => c.dabbasHeld && c.dabbasHeld.includes(cleanCode)) ||
      pendingCustomers[0];

    setVerificationResult({
      status: 'success',
      dabbaCode: cleanCode,
      dabba: dabbaInFleet,
      selectedCustomer: assignedCustomer
    });
  };

  // 3. Confirm Final Delivery
  const handleConfirmDelivery = (customerToDeliver) => {
    if (!verificationResult || verificationResult.status !== 'success') return;

    const target = customerToDeliver || verificationResult.selectedCustomer || targetCustomer || pendingCustomers[0];
    
    playCopilotSound('success');
    triggerHaptic([100, 50, 150]);

    onScanSuccess(verificationResult.dabbaCode, target);
    onClose();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleVerifyDabbaCode(manualCode);
  };

  // Suggested code quick chips (Active boxes for current customer or in fleet)
  const suggestedCodes = [];
  if (targetCustomer?.dabbasHeld) {
    targetCustomer.dabbasHeld.forEach(c => {
      if (!suggestedCodes.includes(c)) suggestedCodes.push(c);
    });
  }
  allAvailableDabbas.slice(0, 4).forEach(d => {
    if (!suggestedCodes.includes(d.code) && suggestedCodes.length < 4) {
      suggestedCodes.push(d.code);
    }
  });

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-charcoal/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#FAF9F5] rounded-3xl shadow-2xl border border-edge overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden Canvas for QR frame processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-edge">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-charcoal tracking-tight font-apple">
                Dabba QR Verification
              </h3>
              <p className="text-xs text-charcoal-muted">
                {targetCustomer ? `${targetCustomer.name} (Stop Stop)` : 'Live Circular Box Verification'}
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

        {/* ========================================================================= */}
        {/* VERIFICATION RESULT DIALOGS */}
        {/* ========================================================================= */}

        {/* 1. SUCCESS: Valid Box Verified */}
        {verificationResult && verificationResult.status === 'success' && (
          <div className="p-5 bg-white space-y-4 animate-scale-in">
            <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-cream-100" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-forest-800 border border-forest-200 uppercase">
                  Verified In Fleet
                </span>
                <h4 className="font-extrabold text-base text-forest-900 mt-1">
                  Box #{verificationResult.dabbaCode} Verified Active
                </h4>
                <p className="text-xs text-forest-800/80 mt-0.5">
                  Current Status: {verificationResult.dabba.status.replace('_', ' ')} • Holder: {verificationResult.dabba.holder}
                </p>
              </div>
            </div>

            {/* Target Customer Assignment */}
            <div className="p-3.5 bg-cream-100/80 rounded-2xl border border-edge space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-charcoal-muted uppercase text-[10px] tracking-wider">
                  Deliver To Customer:
                </span>
                <span className="font-bold text-forest-800">
                  {verificationResult.selectedCustomer?.name || 'Select Customer'}
                </span>
              </div>
              <p className="text-xs text-charcoal leading-relaxed font-medium">
                📍 {verificationResult.selectedCustomer?.address || 'Tirupati Delivery Stop'}
              </p>
            </div>

            {/* If no customer was pre-selected, show 1-tap customer chips */}
            {!targetCustomer && pendingCustomers.length > 1 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-charcoal-subtle uppercase tracking-wider block">
                  Select Customer for Box #{verificationResult.dabbaCode}:
                </span>
                <div className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {pendingCustomers.slice(0, 5).map((cust, idx) => (
                    <button
                      key={cust.id}
                      type="button"
                      onClick={() => handleConfirmDelivery(cust)}
                      className={`p-2 rounded-xl text-left text-xs border flex items-center justify-between transition-all apple-press ${
                        verificationResult.selectedCustomer?.id === cust.id
                          ? 'bg-forest-50 border-forest-700 font-bold text-forest-900'
                          : 'bg-white border-edge text-charcoal hover:bg-cream-100'
                      }`}
                    >
                      <span>#{idx + 1} {cust.name}</span>
                      <span className="text-[10px] text-charcoal-muted">{cust.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setVerificationResult(null);
                  scanQRCodeFrames();
                }}
                className="py-3 px-4 rounded-2xl border border-edge bg-white text-xs font-bold text-charcoal hover:bg-cream-100 transition-colors apple-press"
              >
                Scan Another
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDelivery(verificationResult.selectedCustomer)}
                className="flex-1 py-3 px-4 rounded-2xl bg-forest-700 hover:bg-forest-800 text-cream-50 text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all apple-press"
              >
                <CheckCircle2 className="w-4 h-4 text-cream-100" />
                <span>Confirm & Mark Delivered</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. ERROR: Box is Damaged / Retired */}
        {verificationResult && verificationResult.status === 'damaged' && (
          <div className="p-5 bg-white space-y-4 animate-scale-in">
            <div className="p-4 rounded-2xl bg-terracotta-50 border border-terracotta-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-terracotta-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <ShieldAlert className="w-6 h-6 text-cream-100" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-terracotta-800 border border-terracotta-200 uppercase">
                  Decommissioned Box
                </span>
                <h4 className="font-extrabold text-base text-terracotta-900 mt-1">
                  Box #{verificationResult.dabbaCode} is SCRAPPED / DAMAGED
                </h4>
                <p className="text-xs text-terracotta-800/80 mt-1 leading-relaxed">
                  Reason: <b>{verificationResult.damagedInfo?.reasonCategory}</b> on {verificationResult.damagedInfo?.decommissionDate}.
                  <br />
                  <span className="text-rose-700 font-bold">⚠️ DO NOT DELIVER THIS BOX. RETURN TO GODOWN!</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setVerificationResult(null);
                scanQRCodeFrames();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-forest-700 hover:bg-forest-800 text-cream-50 text-xs font-bold shadow-md apple-press"
            >
              Scan a Different Box
            </button>
          </div>
        )}

        {/* 3. WARNING: Box Not Found in Fleet */}
        {verificationResult && verificationResult.status === 'not_found' && (
          <div className="p-5 bg-white space-y-4 animate-scale-in">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <AlertCircle className="w-6 h-6 text-cream-100" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-amber-800 border border-amber-200 uppercase">
                  Not in Fleet
                </span>
                <h4 className="font-extrabold text-base text-amber-900 mt-1">
                  Box #{verificationResult.dabbaCode} Not Registered
                </h4>
                <p className="text-xs text-amber-800/80 mt-1">
                  This box code was not found in the active circular dabbas fleet. Please check the code or verify with Kitchen Godown.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setVerificationResult(null);
                  scanQRCodeFrames();
                }}
                className="flex-1 py-3 px-4 rounded-2xl border border-edge bg-white text-xs font-bold text-charcoal hover:bg-cream-100 apple-press"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDelivery(targetCustomer || pendingCustomers[0])}
                className="flex-1 py-3 px-4 rounded-2xl bg-amber-700 text-white text-xs font-bold shadow-md apple-press"
              >
                Deliver Anyway
              </button>
            </div>
          </div>
        )}

        {/* Camera Viewport (Active when no result is currently shown) */}
        {!verificationResult && (
          <>
            <div className="p-4 sm:p-5 flex flex-col items-center">
              <div className="relative w-full aspect-square max-w-[300px] rounded-3xl overflow-hidden bg-charcoal border-2 border-forest-700/40 shadow-inner flex items-center justify-center">
                
                {/* Live Camera Stream */}
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    cameraActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Laser Guides */}
                <div className="relative z-10 w-48 h-48 border-2 border-dashed border-white/60 rounded-2xl flex items-center justify-center pointer-events-none">
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

                  {cameraActive && (
                    <div 
                      className="absolute left-2 right-2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" 
                      style={{ animation: 'bounce 2s infinite' }}
                    />
                  )}
                </div>

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
                Point camera at physical dabba QR sticker to verify
              </p>
            </div>

            {/* 1-Tap Quick Verify Suggestions */}
            {suggestedCodes.length > 0 && (
              <div className="px-5 pb-3">
                <span className="text-[10px] uppercase font-bold text-charcoal-subtle tracking-wider block mb-1.5">
                  Quick Verify Fleet Box (1-Tap):
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedCodes.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleVerifyDabbaCode(code)}
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
                  placeholder="Enter code: e.g. DB-102"
                  className="w-full pl-9 pr-3 py-2.5 bg-cream-100 rounded-xl border border-edge text-xs font-bold text-charcoal placeholder:text-charcoal-subtle uppercase focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700"
                />
                <Keyboard className="w-4 h-4 text-charcoal-muted absolute left-3 top-3" />
              </div>
              <button
                type="submit"
                disabled={!manualCode.trim()}
                className="py-2.5 px-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream-50 text-xs font-bold shadow-sm transition-all apple-press disabled:opacity-40"
              >
                Verify Box
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
