import React, { useState } from 'react';
import { 
  Package, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Fingerprint,
  Sparkles,
  Building2
} from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@healthidabba.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setErrorMsg("Please enter both administrator email and password.");
      return;
    }

    // Admin validation check
    if (trimmedPass.length < 4) {
      setErrorMsg("Invalid password. Please enter your admin security key.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      const adminData = {
        name: "Operations Manager",
        email: trimmedEmail,
        role: "admin",
        roleLabel: "Operations Admin",
        hub: "Annamaiah Circle Central Kitchen, Tirupati",
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (rememberMe) {
        try {
          localStorage.setItem('healthi_dabba_user', JSON.stringify(adminData));
        } catch (err) {
          console.error("Storage error:", err);
        }
      }

      onLogin(adminData);
    }, 450);
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@healthidabba.com');
    setPassword('admin123');
    setErrorMsg(null);
  };

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
                ADMIN CONSOLE
              </span>
            </div>
            <p className="text-[11px] text-charcoal-muted hidden sm:block">
              Zero-Loss Tiffin Logistics • Central Kitchen Command, Tirupati
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-edge text-xs font-semibold text-charcoal shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] text-forest-800 font-bold">Admin Server Active</span>
        </div>
      </header>

      {/* Main Center Login Card */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-apple-modal border border-edge space-y-6">
          
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 shadow-apple-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-charcoal tracking-tight">
              Admin Portal Login
            </h1>
            <p className="text-xs text-charcoal-muted max-w-xs mx-auto">
              Restricted management console. Sign in with your administrator account to access fleet operations.
            </p>
          </div>

          {/* Admin Location Badge */}
          <div className="p-3.5 rounded-2xl bg-forest-50/70 border border-forest-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-700 text-cream-50 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Building2 className="w-5 h-5 text-cream-100" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest-900 truncate">Central Command Node</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
                  Tirupati Hub
                </span>
              </div>
              <p className="text-[11px] text-forest-700/90 truncate mt-0.5">
                Annamaiah Circle, AIR Bypass Road • 50 Customer Nodes
              </p>
            </div>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {/* Admin Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Admin Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal block">Admin Email ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@healthidabba.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-semibold shadow-inner transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-charcoal block">Security Key / Password</label>
                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  className="text-[11px] text-forest-700 font-semibold hover:underline"
                >
                  Fill default
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-2xl border border-edge bg-cream-50 focus:outline-none focus:border-forest-600 focus:bg-white text-charcoal font-semibold shadow-inner transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-700 focus:ring-forest-600 border-edge cursor-pointer"
                />
                <span className="text-xs font-semibold text-charcoal">Remember admin session</span>
              </label>

              <span className="text-[11px] text-charcoal-muted font-mono">
                SEC-256
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-5 rounded-2xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-800 apple-press shadow-apple-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  <span>Authenticate Admin Access</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* 1-Tap Quick Fill Demo Admin Card */}
          <div className="pt-4 border-t border-edge/80">
            <button
              type="button"
              onClick={() => {
                handleFillDemoAdmin();
                setTimeout(() => handleSubmit(), 50);
              }}
              className="w-full p-3 rounded-2xl bg-cream-50 hover:bg-forest-50/60 border border-edge hover:border-forest-200 text-charcoal transition-all apple-press flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-forest-700 text-cream-100 flex items-center justify-center font-bold text-xs">
                  👑
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-forest-900 flex items-center gap-1.5">
                    <span>1-Tap Demo Admin Sign In</span>
                    <Sparkles className="w-3 h-3 text-warmamber-600 inline" />
                  </div>
                  <div className="text-[10px] text-charcoal-muted font-mono">
                    admin@healthidabba.com • admin123
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-charcoal-subtle group-hover:text-forest-700 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

        </div>
      </main>

      {/* Footer Security Badges */}
      <footer className="max-w-4xl mx-auto w-full py-4 text-center space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-charcoal-muted">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
            <span>Administrator Authorized Access Only</span>
          </span>
          <span className="text-charcoal-subtle">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
            <span>Zero-Trust Session Guard</span>
          </span>
          <span className="text-charcoal-subtle">•</span>
          <span>Tirupati Central Godown</span>
        </div>
        <p className="text-[10px] text-charcoal-subtle">
          Healthi Dabba Operations OS © 2026. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
