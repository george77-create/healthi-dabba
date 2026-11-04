import React from 'react';
import { 
  User, 
  Bike, 
  ChefHat, 
  ShieldCheck, 
  Package,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  currentRole, 
  setCurrentRole,
  currentUser,
  onLogout
}) {
  const roles = [
    { id: 'admin', label: 'Admin OS', shortLabel: 'Admin', icon: ShieldCheck },
    { id: 'delivery', label: 'Driver Cockpit', shortLabel: 'Cockpit', icon: Bike },
    { id: 'kitchen', label: 'Kitchen & Godown', shortLabel: 'Kitchen', icon: ChefHat },
    { id: 'customer', label: 'Customer App', shortLabel: 'Customer', icon: User },
  ];

  const isAdmin = !currentUser || currentUser.role === 'admin';

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-edge/80 transition-all">
        <div className="max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-6">
            
            {/* Brand Identity */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-forest-700 flex items-center justify-center text-cream-50 shadow-apple-sm flex-shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-cream-100" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold text-base sm:text-lg text-charcoal tracking-tight font-apple">Healthi Dabba</span>
                  <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-forest-50 text-forest-700 rounded-full border border-forest-100/80">
                    {currentUser?.role ? currentUser.role.toUpperCase() : 'ADMIN'}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-charcoal-muted tracking-tight hidden sm:block">
                  Tirupati Central Hub • Zero-Loss Box Circulation OS
                </p>
              </div>
            </div>

            {/* Desktop Role Switcher (Hidden on Mobile) */}
            {isAdmin ? (
              <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-cream-100/90 rounded-2xl border border-edge/80 shadow-apple-sm flex-1 max-w-2xl">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isActive = currentRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setCurrentRole(role.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 lg:px-4 text-xs rounded-xl font-bold whitespace-nowrap apple-press transition-all duration-150 ${
                        isActive
                          ? 'bg-white text-forest-800 shadow-apple-sm ring-1 ring-black/5'
                          : 'text-charcoal-muted hover:text-charcoal hover:bg-white/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-forest-700' : 'text-charcoal-subtle'}`} />
                      <span className="whitespace-nowrap">{role.label}</span>
                    </button>
                  );
                })}
              </nav>
            ) : (
              <div className="hidden md:flex items-center gap-2 p-1.5 bg-cream-100 rounded-2xl border border-edge">
                <span className="text-xs font-bold text-forest-900 px-3 py-1.5 rounded-xl bg-white shadow-xs">
                  Active View: {roles.find(r => r.id === currentRole)?.label}
                </span>
              </div>
            )}

            {/* Right User Profile & Sign Out Button */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              {currentUser && (
                <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl bg-cream-50 border border-edge text-xs">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-forest-700 text-white font-bold flex items-center justify-center text-[10px]">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="font-bold text-charcoal block leading-none">{currentUser.name}</span>
                    <span className="text-[10px] text-charcoal-muted leading-none">{currentUser.roleLabel}</span>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold rounded-2xl border border-edge bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-charcoal apple-press shadow-xs flex items-center gap-1.5 transition-all"
                  title="Lock Session & Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* NATIVE MOBILE APP BOTTOM NAVIGATION BAR (THUMB REACHABLE) */}
      {/* ========================================================================= */}
      {isAdmin && (
        <nav 
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-edge/80 px-2 py-1 shadow-2xl flex items-center justify-around safe-area-pb"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
        >
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = currentRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => {
                  setCurrentRole(role.id);
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all apple-press ${
                  isActive
                    ? 'text-forest-800 font-extrabold'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                <div className={`p-1.5 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-forest-100/80 text-forest-800 scale-110 shadow-xs' 
                    : 'text-charcoal-subtle'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 font-bold leading-none">
                  {role.shortLabel}
                </span>
                {isActive ? (
                  <span className="w-1 h-1 rounded-full bg-forest-700 mt-1"></span>
                ) : (
                  <span className="w-1 h-1 rounded-full bg-transparent mt-1"></span>
                )}
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
}
