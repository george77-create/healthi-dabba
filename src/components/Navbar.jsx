import React from 'react';
import { 
  User, 
  Bike, 
  ChefHat, 
  ShieldCheck, 
  Package,
  LogOut,
  Lock
} from 'lucide-react';

export default function Navbar({ 
  currentRole, 
  setCurrentRole,
  currentUser,
  onLogout
}) {
  const roles = [
    { id: 'customer', label: 'Customer App', icon: User },
    { id: 'delivery', label: 'Driver Cockpit', icon: Bike },
    { id: 'kitchen', label: 'Kitchen & Godown', icon: ChefHat },
    { id: 'admin', label: 'Admin OS', icon: ShieldCheck },
  ];

  // If logged in as specific non-admin role, highlight or filter
  const isAdmin = !currentUser || currentUser.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-edge/80 transition-all">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-6">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-forest-700 flex items-center justify-center text-cream-50 shadow-apple-sm flex-shrink-0">
              <Package className="w-5 h-5 text-cream-100" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-charcoal tracking-tight font-apple">Healthi Dabba</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-forest-50 text-forest-700 rounded-full border border-forest-100/80">
                  {currentUser?.role ? currentUser.role.toUpperCase() : 'SYSTEM'}
                </span>
              </div>
              <p className="text-[11px] text-charcoal-muted tracking-tight hidden sm:block">
                Tirupati Hub • Zero-Loss Box Circulation OS
              </p>
            </div>
          </div>

          {/* Desktop Role Switcher (Admin has full multi-portal oversight) */}
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
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-cream-50 border border-edge text-xs">
                <div className="w-6 h-6 rounded-full bg-forest-700 text-white font-bold flex items-center justify-center text-[10px]">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left">
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
                className="px-3.5 py-2 text-xs font-bold rounded-2xl border border-edge bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-charcoal apple-press shadow-xs flex items-center gap-1.5 transition-all"
                title="Lock Session & Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Scrollbar (Tablet & Phone for Admins) */}
        {isAdmin && (
          <div className="md:hidden flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar border-t border-edge/60">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = currentRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setCurrentRole(role.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs rounded-xl font-bold whitespace-nowrap flex-shrink-0 apple-press ${
                    isActive
                      ? 'bg-forest-700 text-cream-50 font-bold shadow-apple-sm'
                      : 'bg-white text-charcoal-muted border border-edge hover:bg-cream-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
}
