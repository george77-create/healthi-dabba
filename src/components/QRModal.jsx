import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  QrCode, 
  Camera, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function QRModal({ 
  isOpen, 
  onClose, 
  title = "Scan Dabba Barcode", 
  subtitle = "Center the physical box QR label within the scanning frame", 
  actionType = "deliver", 
  expectedDabbas = [],
  onScanComplete 
}) {
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [scannedResult, setScannedResult] = useState(null);

  if (!isOpen) return null;

  const handleSimulateScan = (code) => {
    setIsScanning(false);
    setScannedResult(code);
    setTimeout(() => {
      onScanComplete(code, actionType);
      handleClose();
    }, 800);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleSimulateScan(manualCode.trim().toUpperCase());
  };

  const handleClose = () => {
    setScannedResult(null);
    setManualCode('');
    setIsScanning(true);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-apple-modal border border-edge overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-edge">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-charcoal">{title}</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">{subtitle}</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-muted hover:bg-cream-100 apple-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder (Apple-style Camera Interface) */}
        <div className="p-6">
          <div className="relative aspect-square max-h-60 mx-auto rounded-2xl bg-charcoal flex flex-col items-center justify-center overflow-hidden border-2 border-forest-700/40 shadow-inner">
            
            {/* Viewfinder Corner Brackets */}
            <div className="absolute inset-7 pointer-events-none">
              <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-forest-500 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-forest-500 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-forest-500 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-forest-500 rounded-br-lg"></div>
              
              {/* Natural Laser Sweep (Forest sage line, strictly NO neon) */}
              {isScanning && (
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-forest-500 to-transparent absolute animate-laser"></div>
              )}
            </div>

            {/* Camera Visual Feedback */}
            {scannedResult ? (
              <div className="flex flex-col items-center justify-center text-center p-5 bg-forest-900/85 rounded-2xl backdrop-blur-md">
                <CheckCircle2 className="w-12 h-12 text-forest-100 mb-2" />
                <span className="text-[10px] uppercase tracking-widest text-cream-200 font-bold">Verification Confirmed</span>
                <span className="text-xl font-extrabold text-white tracking-widest mt-0.5">{scannedResult}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-5 text-cream-300">
                <Camera className="w-8 h-8 mb-2 text-cream-200 opacity-70 animate-bounce" />
                <span className="text-xs font-bold">Center box QR barcode here</span>
                <span className="text-[11px] text-cream-300/60 mt-1">Camera lens auto-focusing</span>
              </div>
            )}
          </div>

          {/* Quick Simulation One-Click Buttons */}
          <div className="mt-5">
            <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-2">
              Quick Test Simulation (Tap to Scan):
            </span>
            <div className="flex flex-wrap gap-2">
              {(expectedDabbas.length > 0 ? expectedDabbas : ['DB-104', 'DB-112', 'DB-098', 'DB-125']).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleSimulateScan(code)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-cream-100 border border-edge text-charcoal hover:bg-forest-50 hover:border-forest-500 hover:text-forest-700 transition-all apple-press shadow-apple-sm"
                >
                  ⚡ Scan {code}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Fallback */}
          <form onSubmit={handleManualSubmit} className="mt-5 pt-4 border-t border-edge">
            <label className="block text-xs font-bold text-charcoal mb-1.5">
              Manual Box ID Entry
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. DB-104"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-bold tracking-wider uppercase"
              />
              <button
                type="submit"
                disabled={!manualCode.trim()}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-forest-700 text-white disabled:opacity-40 apple-press flex items-center gap-1 shadow-apple-sm"
              >
                <span>Verify</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-cream-50/80 border-t border-edge text-center">
          <p className="text-[11px] text-charcoal-muted font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
            <span>Digital handshake logged with tamper-proof timestamp.</span>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
