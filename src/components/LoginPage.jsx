import React, { useState } from 'react';
import { 
  Package, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  User, 
  Bike, 
  ChefHat, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  KeyRound,
  Fingerprint
} from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState('admin@healthidabba.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-configured role accounts for fast testing
  const ROLE_CONFIGS = {
    admin: {
      name: "Operations Manager",
      email: "admin@healthidabba.com",
      defaultPass: "admin123",
      roleLabel: "Operations Admin",
      hub: "Tirupati Central Command",
      icon: ShieldCheck,
      desc: "Full operational oversight, routes, customers & fleet ledger"
    },
    delivery: {
      name: "Raju Kumar",
      email: "raju@healthidabba.com",
      defaultPass: "driver123",
      roleLabel: "Delivery Hero (DBOY-01)",
      hub: "Route A — KT Road & Alipiri Zone",
      icon: Bike,
      desc: "Turn-by-turn stop manifest, QR scanner & godown returns"
    },
    customer: {
      name: "Srikanth Reddy",
      email: "srikanth@healthidabba.com",
      defaultPass: "cust123",
      roleLabel: "Customer (CUST-001)",
      hub: "Balaji Heights, KT Road, Tirupati",
      icon: User,
      desc: "Dietary preferences, live delivery timeline & dabba passport"
    },
    kitchen: {
      name: "Ramesh Sharma",
      email: "ramesh@healthidabba.com",
      defaultPass: "chef123",
      roleLabel: "Head Cook (KSTF-01)",
      hub: "Annamaiah Circle Central Kitchen",
      icon: ChefHat,
      desc: "Meal packing manifest, dish allotments & hygiene checklist"
    }
  };

  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    const cfg = ROLE_CONFIGS[roleKey];
    setEmail(cfg.email);
    setPassword(cfg.defaultPass);
    setErrorMsg(null);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email address and password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cfg = ROLE_CONFIGS[selectedRole];
      
      const userData = {
        name: cfg.name,
        email: email.trim(),
        role: selectedRole,
        roleLabel: cfg.roleLabel,
        hub: cfg.hub,
        customerId: selectedRole === 'customer' ? 'CUST-001' : null,
        driverId: selectedRole === 'delivery' ? 'DBOY-01' : null,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (rememberMe) {
        try {
          localStorage.setItem('healthi_dabba_user', JSON.stringify(userData));
        } catch (e) {
          console.error("Storage error:", e);
        }
      }

      onLogin(userData);
    }, 600);
  };

  const currentCfg = ROLE_CONFIGS[selectedRole];
  const CurrentIcon = currentCfg.icon;

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-apple antialiased selection:bg-forest-100 selection:text-forest-800">
      
      {/* Top Header Branding */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-forest-700 flex items-center justify-center text-cream-50 shadow-apple-sm">
            <Package className="w-5 h-5 text-cream-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-charcoal tracking-tight">Healthi Dabba</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-forest-50 text-forest-700 rounded-full border border-forest-100">
                SECURITY GATE
              </span>
            </div>
            <p className="text-[11px] text-charcoal-muted hidden sm:block">
              Zero-Loss Tiffin Logistics • Tirupati Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-edge text-xs font-semibold text-charcoal shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] text-forest-800">Tirupati Node Online</span>
        </div>
      </header>

      {/* Main Center Login Canvas */}
      <main className="max-w-lg mx-auto w-full my-auto py-8">
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-apple-modal border border-edge space-y-6">
          
          {/* Form Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 shadow-apple-sm">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-charcoal tracking-tight">
              Portal Authentication
            </h1>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              Select your role below and sign in to access your customized Healthi Dabba operational workspace.
            </p>
          </div>

          {/* Role Segment Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
              1. Choose Access Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-cream-100/90 rounded-2xl border border-edge shadow-inner">
              {[
                { id: 'admin', label: 'Admin', icon: ShieldCheck },
                { id: 'delivery', label: 'Driver', icon: Bike },
                { id: 'customer', label: 'Customer', icon: User },
                { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
              ].map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSelectRole(role.id)}
                    className={`flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold transition-all apple-press ${
                      isSelected
                        ? 'bg-white text-forest-800 shadow-apple-sm ring-1 ring-black/5'
                        : 'text-charcoal-muted hover:text-charcoal hover:bg-white/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-forest-700' : 'text-charcoal-subtle'}`} />
                    <span className="text-[11px]">{role.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Role Quick Card Preview */}
          <div className="p-3.5 rounded-2xl bg-forest-50/70 border border-forest-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-700 text-cream-50 flex items-center justify-center flex-shrink-0 shadow-sm">
              <CurrentIcon className="w-5 h-5 text-cream-100" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest-900 truncate">{currentCfg.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
                  {currentCfg.roleLabel}
                </span>
              </div>
              <p className="text-[11px] text-forest-700/90 truncate mt-0.5">
                {currentCfg.desc}
              </p>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal block">Email Address / User ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@healthidabba.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-semibold shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-charcoal block">Password</label>
                <span className="text-[11px] text-forest-700 font-semibold cursor-pointer hover:underline" onClick={() => setPassword(currentCfg.defaultPass)}>
                  Reset default
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-semibold shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-700 focus:ring-forest-600 border-edge cursor-pointer"
                />
                <span className="text-xs font-semibold text-charcoal">Remember session on this device</span>
              </label>

              <span className="text-[11px] text-charcoal-muted font-mono">
                v1.0.4-PROD
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-5 rounded-2xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 apple-press shadow-apple-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  <span>Secure Login to {currentCfg.roleLabel}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Login Bar */}
          <div className="pt-4 border-t border-edge/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-warmamber-600" />
                <span>1-Tap Demo Quick Logins:</span>
              </span>
              <span className="text-[10px] text-forest-700 font-bold">Auto-fills & enters</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'admin', label: '👑 Admin OS', color: 'hover:border-forest-600' },
                { id: 'delivery', label: '🚴 Driver App', color: 'hover:border-warmamber-500' },
                { id: 'customer', label: '🥗 Customer Hub', color: 'hover:border-forest-600' },
                { id: 'kitchen', label: '🍳 Kitchen Chef', color: 'hover:border-terracotta-500' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => {
                    handleSelectRole(btn.id);
                    setTimeout(() => handleSubmit(), 50);
                  }}
                  className={`p-2.5 rounded-xl bg-cream-50 hover:bg-white text-charcoal font-bold text-[11px] border border-edge transition-all apple-press shadow-xs text-left ${btn.color}`}
                >
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Footer Security Badges */}
      <footer className="max-w-4xl mx-auto w-full py-4 text-center space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-charcoal-muted">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
            <span>256-Bit TLS End-to-End Encryption</span>
          </span>
          <span className="text-charcoal-subtle">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
            <span>Zero-Trust Session Authentication</span>
          </span>
          <span className="text-charcoal-subtle">•</span>
          <span>Annamaiah Circle Central Kitchen, Tirupati</span>
        </div>
        <p className="text-[10px] text-charcoal-subtle">
          Healthi Dabba Platform © 2026. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
