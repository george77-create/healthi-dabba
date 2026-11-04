import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Send, 
  Lock, 
  PhoneOff, 
  XCircle, 
  ShieldCheck, 
  MapPinOff,
  Clock,
  Sparkles
} from 'lucide-react';
import { NOT_AVAILABLE_REASONS, playCopilotSound, triggerHaptic } from '../services/copilotSync';

export default function CopilotNotAvailableModal({
  isOpen,
  onClose,
  customer,
  onSubmitReport
}) {
  const [selectedReason, setSelectedReason] = useState('door_locked');
  const [driverNotes, setDriverNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !customer) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    playCopilotSound('alert');
    triggerHaptic([100, 50, 100]);

    const reasonObj = NOT_AVAILABLE_REASONS.find(r => r.id === selectedReason);
    const reasonLabel = reasonObj ? reasonObj.label : 'Customer Not Available';

    setTimeout(() => {
      onSubmitReport({
        customerId: customer.id,
        customerName: customer.name,
        reasonId: selectedReason,
        reasonLabel: reasonLabel,
        notes: driverNotes.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().slice(0, 10)
      });
      setIsSubmitting(false);
      setDriverNotes('');
      onClose();
    }, 350);
  };

  const getReasonIcon = (id) => {
    switch (id) {
      case 'door_locked': return <Lock className="w-4 h-4 text-terracotta-700" />;
      case 'phone_unreachable': return <PhoneOff className="w-4 h-4 text-terracotta-700" />;
      case 'customer_refused': return <XCircle className="w-4 h-4 text-terracotta-700" />;
      case 'security_handover': return <ShieldCheck className="w-4 h-4 text-forest-700" />;
      case 'address_not_found': return <MapPinOff className="w-4 h-4 text-terracotta-700" />;
      default: return <AlertTriangle className="w-4 h-4 text-terracotta-700" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-charcoal/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-[#FAF9F5] sm:rounded-3xl rounded-t-3xl shadow-2xl border border-edge overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-white border-b border-edge">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-50 border border-terracotta-100 flex items-center justify-center text-terracotta-700 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-charcoal tracking-tight font-apple">
                Customer Not Available
              </h3>
              <p className="text-xs text-charcoal-muted">
                {customer.name} • {customer.id}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-cream-100 hover:bg-cream-200 border border-edge/80 flex items-center justify-center text-charcoal-muted hover:text-charcoal transition-colors apple-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Address Preview */}
          <div className="p-3.5 bg-white rounded-2xl border border-edge/80 text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-subtle">
              Delivery Address:
            </span>
            <p className="font-medium text-charcoal leading-relaxed">
              {customer.address}
            </p>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2.5">
              Select Primary Reason:
            </label>
            <div className="space-y-2">
              {NOT_AVAILABLE_REASONS.map((r) => {
                const isSelected = selectedReason === r.id;
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setSelectedReason(r.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all apple-press ${
                      isSelected 
                        ? 'bg-white border-terracotta-700 ring-2 ring-terracotta-700/20 shadow-sm' 
                        : 'bg-white/80 border-edge hover:bg-white hover:border-edge/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-terracotta-100' : 'bg-cream-100'
                      }`}>
                        {getReasonIcon(r.id)}
                      </div>
                      <span className={`text-xs font-semibold ${
                        isSelected ? 'text-charcoal font-bold' : 'text-charcoal/80'
                      }`}>
                        {r.label}
                      </span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-terracotta-700 bg-terracotta-700' : 'border-edge'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Driver Notes */}
          <div>
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
              Rider Notes (Optional):
            </label>
            <textarea
              rows={2}
              value={driverNotes}
              onChange={(e) => setDriverNotes(e.target.value)}
              placeholder="e.g. Called twice at 12:45 PM, no response. Neighbor said out of station."
              className="w-full p-3 bg-white rounded-2xl border border-edge text-xs text-charcoal placeholder:text-charcoal-subtle focus:outline-none focus:ring-2 focus:ring-terracotta-700/20 focus:border-terracotta-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-4 rounded-2xl border border-edge bg-white text-xs font-bold text-charcoal hover:bg-cream-100 transition-colors apple-press"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-terracotta-700 hover:bg-terracotta-800 text-cream-50 text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all apple-press disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Logging...' : 'Submit & Notify Admin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
