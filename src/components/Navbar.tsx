import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, Lock, LogOut, Sprout } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    navigateToView,
    activeRole,
    currentFarmer,
    currentAdmin,
    logout,
    firebaseUser,
    signInWithGoogleAuth,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'about' | 'login' | 'user-dashboard' | 'admin-dashboard') => {
    navigateToView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-[#14532D] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Sprout className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-[#14532D] transition-colors leading-none">
              PUNARNAVA
            </span>
            <span className="text-[11px] font-bold text-amber-800 tracking-wider uppercase mt-0.5">
              Rural Biomass & Cow Dung Bank
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-[#14532D] cursor-pointer ${
              currentView === 'home' ? 'text-[#14532D] font-black border-b-2 border-[#14532D]' : ''
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => handleNavClick('about')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-[#14532D] cursor-pointer ${
              currentView === 'about' ? 'text-[#14532D] font-black border-b-2 border-[#14532D]' : ''
            }`}
          >
            About & Our Goal
          </button>

          {/* Role-Protected Nav Link */}
          {activeRole === 'user' && currentFarmer && (
            <button
              onClick={() => handleNavClick('user-dashboard')}
              className={`whitespace-nowrap transition-colors py-1 hover:text-[#14532D] cursor-pointer ${
                currentView === 'user-dashboard' ? 'text-[#14532D] font-black border-b-2 border-[#14532D]' : ''
              }`}
            >
              Farmer Biomass Ledger
            </button>
          )}

          {activeRole === 'admin' && (
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className={`whitespace-nowrap transition-colors py-1 hover:text-[#14532D] cursor-pointer ${
                currentView === 'admin-dashboard' ? 'text-[#14532D] font-black border-b-2 border-[#14532D]' : ''
              }`}
            >
              Cooperative Manager Portal
            </button>
          )}
        </nav>

        {/* Primary Action / Auth Status */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {activeRole ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-900">
                  {activeRole === 'user' ? currentFarmer?.name : currentAdmin.name}
                </span>
                <span className="block text-[11px] text-slate-500 font-mono">
                  {activeRole === 'user' ? `UBID: ${currentFarmer?.ubid}` : (firebaseUser?.email || currentAdmin.centerCode)}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => signInWithGoogleAuth()}
                className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                title="Sign in with Google"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google Sign-In</span>
              </button>

              <button
                onClick={() => handleNavClick('login')}
                className="px-4 py-2 text-xs font-bold text-white bg-[#14532D] hover:bg-[#0f3f22] rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-300" />
                <span>Portal Login</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
              currentView === 'home' ? 'bg-emerald-50 text-[#14532D] font-bold' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
              currentView === 'about' ? 'bg-emerald-50 text-[#14532D] font-bold' : 'text-slate-700'
            }`}
          >
            About & Our Goal
          </button>

          {activeRole === 'user' && currentFarmer && (
            <button
              onClick={() => handleNavClick('user-dashboard')}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
                currentView === 'user-dashboard' ? 'bg-emerald-50 text-[#14532D] font-bold' : 'text-slate-700'
              }`}
            >
              Farmer Biomass Ledger
            </button>
          )}

          {activeRole === 'admin' && (
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
                currentView === 'admin-dashboard' ? 'bg-emerald-50 text-[#14532D] font-bold' : 'text-slate-700'
              }`}
            >
              Cooperative Manager Portal
            </button>
          )}

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            {activeRole ? (
              <button
                onClick={logout}
                className="w-full py-2.5 text-center text-xs font-bold text-slate-700 bg-stone-100 rounded-xl"
              >
                Sign Out ({activeRole === 'user' ? currentFarmer?.name : currentAdmin.name})
              </button>
            ) : (
              <>
                <button
                  onClick={() => signInWithGoogleAuth()}
                  className="w-full py-2.5 text-center text-xs font-bold text-slate-800 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center justify-center gap-2"
                >
                  <span>Sign In with Google</span>
                </button>
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#14532D] rounded-xl shadow-sm"
                >
                  Portal Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
