import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Printer, 
  Download, 
  Sparkles, 
  QrCode, 
  Check, 
  Layers, 
  SlidersHorizontal,
  Package,
  FileText
} from 'lucide-react';

export default function DabbaStickerModal({ isOpen, onClose, dabbas = [] }) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'godown' | 'range'
  const [rangeStart, setRangeStart] = useState('DB-101');
  const [rangeEnd, setRangeEnd] = useState('DB-150');
  const [qrImages, setQrImages] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSize, setSelectedSize] = useState('compact'); // 'compact' (mini 2x1.5") | 'standard' (3x2")

  // Filter dabbas based on selection
  const filteredDabbas = dabbas.filter(d => {
    if (filterMode === 'godown') return d.status === 'in_godown';
    if (filterMode === 'range') {
      const getNum = (str) => parseInt(str.replace(/\D/g, '') || '0', 10);
      const startNum = getNum(rangeStart);
      const endNum = getNum(rangeEnd);
      const currentNum = getNum(d.code);
      return currentNum >= startNum && currentNum <= endNum;
    }
    return true;
  });

  // Generate QR codes for all filtered dabbas
  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;

    async function generateAllQRs() {
      setIsGenerating(true);
      const newImages = {};
      
      for (const d of filteredDabbas) {
        if (isCancelled) return;
        try {
          const url = await QRCode.toDataURL(d.code, {
            width: 180,
            margin: 1,
            color: {
              dark: '#1A3D17', // Forest green dark pattern
              light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
          });
          newImages[d.code] = url;
        } catch (err) {
          console.error("QR generation failed for", d.code, err);
        }
      }

      if (!isCancelled) {
        setQrImages(newImages);
        setIsGenerating(false);
      }
    }

    generateAllQRs();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, filterMode, rangeStart, rangeEnd, dabbas.length]);

  if (!isOpen) return null;

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Download standalone printable HTML sheet
  const handleDownloadSheet = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Healthi Dabba - Printable QR Sticker Sheet</title>
  <style>
    @page { size: A4; margin: 10mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff; margin: 0; padding: 10px; }
    .sheet-title { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #1A3D17; padding-bottom: 8px; }
    .sheet-title h1 { margin: 0; font-size: 20px; color: #1A3D17; }
    .sheet-title p { margin: 3px 0 0; font-size: 11px; color: #666; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .sticker { border: 1.5px dashed #333; border-radius: 12px; padding: 8px; background: #fff; text-align: center; page-break-inside: avoid; display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 160px; box-sizing: border-box; }
    .sticker-brand { font-size: 9px; font-weight: 800; color: #1A3D17; letter-spacing: 0.5px; text-transform: uppercase; }
    .sticker-hub { font-size: 8px; color: #777; margin-bottom: 4px; }
    .qr-img { width: 85px; height: 85px; object-fit: contain; }
    .code-box { font-size: 14px; font-weight: 900; color: #111; letter-spacing: 1px; font-family: monospace; margin-top: 2px; }
    .spec-text { font-size: 7.5px; color: #555; text-transform: uppercase; font-weight: 600; margin-top: 2px; }
  </style>
</head>
<body>
  <div class="sheet-title">
    <h1>HEALTHI DABBA • OFFICIAL QR STICKER SHEET</h1>
    <p>Tirupati Central Godown • Zero-Loss Circulation Ledger • ${filteredDabbas.length} Labels</p>
  </div>
  <div class="grid">
    ${filteredDabbas.map(d => `
      <div class="sticker">
        <div>
          <div class="sticker-brand">HEALTHI DABBA</div>
          <div class="sticker-hub">Tirupati Central Godown</div>
        </div>
        <img class="qr-img" src="${qrImages[d.code] || ''}" alt="${d.code}" />
        <div>
          <div class="code-box">${d.code}</div>
          <div class="spec-text">Food Grade SS-304 • Scan Daily</div>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Healthi_Dabba_Stickers_${filteredDabbas.length}_Boxes.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download individual sticker
  const handleDownloadSingleSticker = (code) => {
    const dataUrl = qrImages[code];
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `QR_Sticker_${code}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      
      {/* Print Specific Inline Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-sticker-sheet, #printable-sticker-sheet * {
            visibility: visible;
          }
          #printable-sticker-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 10px !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-5xl h-[92vh] sm:max-h-[92vh] flex flex-col shadow-apple-modal border border-edge overflow-hidden">
        
        {/* Mobile Swipe Handle */}
        <div className="w-12 h-1 bg-charcoal/20 rounded-full mx-auto mt-2 sm:hidden"></div>

        {/* Header */}
        <div className="p-3.5 sm:p-6 border-b border-edge flex items-center justify-between bg-cream-50/70">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-forest-700 text-cream-50 flex items-center justify-center shadow-apple-sm flex-shrink-0">
              <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-cream-100" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-base sm:text-lg font-bold text-charcoal truncate">QR Sticker Sheet</h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-forest-100 text-forest-800 flex-shrink-0">
                  {filteredDabbas.length} Labels
                </span>
              </div>
              <p className="text-[11px] text-charcoal-muted truncate hidden sm:block">
                Print or export compact adhesive stickers for physical stainless steel tiffins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleDownloadSheet}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal font-bold text-xs border border-edge flex items-center gap-1.5 apple-press shadow-xs"
              title="Download standalone HTML file with all sticker labels"
            >
              <Download className="w-4 h-4 text-forest-700" />
              <span className="hidden sm:inline">Export HTML</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs flex items-center gap-1.5 apple-press shadow-apple-sm"
              title="Print directly on adhesive paper (Ctrl+P)"
            >
              <Printer className="w-4 h-4 text-cream-100" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal flex items-center justify-center border border-edge apple-press ml-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-edge bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-charcoal-muted flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>

            <div className="inline-flex rounded-xl bg-cream-100 p-1 border border-edge">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  filterMode === 'all'
                    ? 'bg-white text-forest-800 shadow-apple-sm'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                All Boxes ({dabbas.length})
              </button>
              <button
                onClick={() => setFilterMode('godown')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  filterMode === 'godown'
                    ? 'bg-white text-forest-800 shadow-apple-sm'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                In Godown Only ({dabbas.filter(d => d.status === 'in_godown').length})
              </button>
              <button
                onClick={() => setFilterMode('range')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  filterMode === 'range'
                    ? 'bg-white text-forest-800 shadow-apple-sm'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                Custom Range
              </button>
            </div>
          </div>

          {filterMode === 'range' && (
            <div className="flex items-center gap-2">
              <span className="text-charcoal-muted font-bold text-[11px]">From:</span>
              <input
                type="text"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value.toUpperCase())}
                className="w-20 px-2 py-1 text-xs font-mono font-bold border border-edge rounded-lg text-center"
                placeholder="DB-101"
              />
              <span className="text-charcoal-muted font-bold text-[11px]">To:</span>
              <input
                type="text"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value.toUpperCase())}
                className="w-20 px-2 py-1 text-xs font-mono font-bold border border-edge rounded-lg text-center"
                placeholder="DB-150"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-charcoal-muted font-bold text-[11px]">Sticker Size:</span>
            <div className="inline-flex rounded-xl bg-cream-100 p-1 border border-edge">
              <button
                onClick={() => setSelectedSize('compact')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                  selectedSize === 'compact' ? 'bg-white text-forest-800 shadow-xs' : 'text-charcoal-muted'
                }`}
              >
                Compact (2.5" x 1.5")
              </button>
              <button
                onClick={() => setSelectedSize('standard')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                  selectedSize === 'standard' ? 'bg-white text-forest-800 shadow-xs' : 'text-charcoal-muted'
                }`}
              >
                Standard (3" x 2")
              </button>
            </div>
          </div>

        </div>

        {/* Sticker Sheet Grid Preview */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-cream-50/50">
          
          {isGenerating ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-charcoal">Rendering Crisp Laser QR Vectors...</p>
            </div>
          ) : filteredDabbas.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Package className="w-10 h-10 text-charcoal-subtle mx-auto" />
              <p className="text-xs font-bold text-charcoal">No boxes match the selected filter</p>
              <p className="text-[11px] text-charcoal-muted">Adjust the range or switch to "All Boxes"</p>
            </div>
          ) : (
            <div 
              id="printable-sticker-sheet"
              className={`grid gap-3.5 ${
                selectedSize === 'compact' 
                  ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4' 
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
              }`}
            >
              {filteredDabbas.map((d) => {
                const qrUrl = qrImages[d.code];
                return (
                  <div
                    key={d.code}
                    className="relative bg-white rounded-2xl border-2 border-dashed border-charcoal/30 p-3 flex flex-col items-center justify-between text-center hover:border-forest-600 hover:shadow-apple-sm transition-all group"
                    style={{ minHeight: selectedSize === 'compact' ? '180px' : '220px' }}
                  >
                    {/* Top Sticker Header */}
                    <div className="w-full pb-1 border-b border-edge/60 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-forest-600"></span>
                        <span className="text-[9px] font-black tracking-wider text-forest-800 uppercase">
                          Healthi Dabba
                        </span>
                      </div>
                      <span className="text-[8px] font-semibold text-charcoal-muted">
                        Tirupati Hub
                      </span>
                    </div>

                    {/* High-Resolution QR Vector */}
                    <div className="my-2 p-1 bg-white rounded-xl shadow-xs border border-edge/50">
                      {qrUrl ? (
                        <img 
                          src={qrUrl} 
                          alt={`QR for ${d.code}`} 
                          className={selectedSize === 'compact' ? 'w-24 h-24' : 'w-32 h-32'}
                        />
                      ) : (
                        <div className="w-24 h-24 flex items-center justify-center bg-cream-50 rounded-lg text-[10px] text-charcoal-muted">
                          Generating...
                        </div>
                      )}
                    </div>

                    {/* Bottom Monospace Code & Spec */}
                    <div className="w-full pt-1 border-t border-edge/60">
                      <div className="font-mono text-sm font-black text-charcoal tracking-wider">
                        {d.code}
                      </div>
                      <div className="text-[8px] font-bold text-forest-700 uppercase tracking-tight">
                        Food Grade SS 304 • Scan Daily
                      </div>
                    </div>

                    {/* Individual Download Hover Pill */}
                    <button
                      onClick={() => handleDownloadSingleSticker(d.code)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-forest-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-apple-sm no-print"
                      title="Download PNG for this sticker"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="p-4 border-t border-edge bg-white flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-charcoal-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-medium">
              A4 Label Paper Compatible • 4x6 / 3x8 Avery standard peel-and-stick grid
            </span>
          </div>

          <div className="flex items-center gap-3 font-semibold text-[11px]">
            <span>Water-resistant laser print recommended</span>
            <span className="text-charcoal-subtle">•</span>
            <span className="text-forest-700 font-bold">Never reuse scrapped box IDs</span>
          </div>
        </div>

      </div>
    </div>
  );
}
