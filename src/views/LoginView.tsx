import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  ShieldCheck,
  ArrowRight,
  Phone,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  CreditCard,
  LogOut,
} from 'lucide-react';
import { ADMIN_EMAIL } from '../firebase/firestoreService';

export const LoginView: React.FC = () => {
  const {
    loginAsFarmer,
    loginAsAdmin,
    initialLoginRole,
    firebaseUser,
    signInWithGoogleAuth,
    signOutAuth,
    isFirebaseConnected,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>(initialLoginRole || 'user');
  const [identifier, setIdentifier] = useState('8431413473');
  const [otpCode, setOtpCode] = useState('4821');
  const [adminKey, setAdminKey] = useState('khed-coop-2026');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleFarmerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Please enter your 10-Digit Unique Biomass ID (UBID) or registered mobile number.');
      return;
    }
    const success = loginAsFarmer(identifier);
    if (!success) {
      setErrorMessage(
        `Identifier "${identifier}" not found in village cooperative biomass register. Please verify or use a demo account.`
      );
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsAdmin();
  };

  const handleGoogleSignInClick = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      await signInWithGoogleAuth();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google sign-in was cancelled or failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const setDemoUser = (ubid: string) => {
    setIdentifier(ubid);
    setErrorMessage('');
    loginAsFarmer(ubid);
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Biogas Plant Background from Uploaded Asset & Fallback URL */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('/assets/aistudio/image_306a5fa8.png'), url('https://www.xylem.com/siteassets/solutions/energy/biogas_pl.png')`,
        }}
      >
        {/* Rich dark overlay gradient for readability with sunset biogas refinery atmospheric presence */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-stone-900/65 to-stone-950/80 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto">
        <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cloud Firestore & Firebase Auth Connected</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
            Select Your Biomass Portal
          </h1>
          <p className="text-sm text-stone-200 drop-shadow">
            Authenticate securely using Google Sign-In with Firebase Auth or enter your 10-Digit Kisan UBID Card.
          </p>
        </div>

        {/* GOOGLE SIGN-IN HERO PROMPT */}
        <div className="mb-8 p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-white/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Firebase Authentication
              </span>
              {firebaseUser && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#14532D]">
                  Active Session
                </span>
              )}
            </div>
          <h2 className="text-base font-bold text-slate-900">
            {firebaseUser ? `Signed in as ${firebaseUser.displayName || firebaseUser.email}` : 'Sign In with Google Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {firebaseUser
              ? `Connected to Firestore. Role permissions evaluated for ${firebaseUser.email}.`
              : `Use your Google account (${ADMIN_EMAIL} for verified Cooperative Manager).`}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          {firebaseUser ? (
            <button
              onClick={signOutAuth}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          ) : (
            <button
              onClick={handleGoogleSignInClick}
              disabled={isGoogleLoading}
              className="px-5 py-3 text-xs font-bold text-slate-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-3 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>{isGoogleLoading ? 'Connecting...' : 'Sign In with Google'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Role 1: Farmer / Rural User Portal */}
        <button
          type="button"
          onClick={() => {
            setSelectedRole('user');
            setErrorMessage('');
          }}
          className={`p-6 rounded-3xl border text-left transition-all cursor-pointer backdrop-blur-md ${
            selectedRole === 'user'
              ? 'bg-white border-[#14532D] shadow-xl ring-2 ring-[#14532D]/30'
              : 'bg-white/90 border-white/60 hover:bg-white hover:border-stone-300 shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#14532D] flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            {selectedRole === 'user' && (
              <span className="text-xs font-bold text-[#14532D] bg-emerald-50 px-2.5 py-1 rounded-md">
                Selected
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Farmer / Rural User Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Read-Only ledger of cattle dung & crop stubble deposits, wallet earnings, keypad SMS alerts, and free bio-slurry vouchers.
          </p>
          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-emerald-800">
            Strict Read-Only Ledger (Anti-Fraud)
          </div>
        </button>

        {/* Role 2: Village Administrator / Cooperative Manager Portal */}
        <button
          type="button"
          onClick={() => {
            setSelectedRole('admin');
            setErrorMessage('');
          }}
          className={`p-6 rounded-3xl border text-left transition-all cursor-pointer backdrop-blur-md ${
            selectedRole === 'admin'
              ? 'bg-white border-slate-900 shadow-xl ring-2 ring-slate-900/30'
              : 'bg-white/90 border-white/60 hover:bg-white hover:border-stone-300 shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            {selectedRole === 'admin' && (
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                Selected
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Village Cooperative Manager Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            10-Digit UBID quick intake logging, smart scale weighment, buying price rates, and bulk tanker evacuation logistics.
          </p>
          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-slate-700">
            Gram Panchayat Center Operator Console
          </div>
        </button>
      </div>

      {/* Login Credentials Box */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl">
        {selectedRole === 'user' ? (
          <form onSubmit={handleFarmerLogin} className="space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Farmer Identification (Passbook or UBID)
              </h2>
              <p className="text-xs text-slate-500">
                Sign in with your 10-Digit Unique Biomass ID (UBID) or registered mobile number.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  10-Digit Unique Biomass ID (UBID) or Mobile
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 8431413473"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-slate-900 text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532D] transition-all"
                    maxLength={15}
                  />
                  <div className="absolute right-3 top-3 text-slate-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Printed on your physical plastic Biomass Smart Card
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Verification OTP (Sent to Keypad Phone)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="4-digit OTP"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-slate-900 text-sm font-mono tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532D] transition-all"
                    maxLength={6}
                  />
                  <div className="absolute right-3 top-3 text-slate-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Simulated OTP pre-filled for rapid evaluation
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 text-sm font-bold text-white bg-[#14532D] hover:bg-[#0f3f22] rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Access Farmer Portal</span>
              <ArrowRight className="w-4 h-4 text-emerald-300" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Village Cooperative Manager Sign In
              </h2>
              <p className="text-xs text-slate-500">
                Authorized entry console for Gram Panchayat center managers operating Bluetooth weighment scales.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Cooperative Center ID
                </label>
                <input
                  type="text"
                  readOnly
                  value="MH-PUN-KHED-04 (Cooperative Supervisor Console)"
                  className="w-full px-4 py-3 bg-stone-100 border border-stone-300 rounded-xl text-slate-800 text-sm font-mono cursor-not-allowed font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Manager Security Passkey
                </label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-slate-900 text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Village Manager Console</span>
              <ArrowRight className="w-4 h-4 text-emerald-300" />
            </button>
          </form>
        )}

        {/* Quick Demo Credentials Bar */}
        <div className="mt-8 pt-6 border-t border-stone-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              1-Click Demo Evaluation Profiles
            </span>
            <span className="text-[11px] text-slate-400">Click to authenticate instantly</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setDemoUser('8431413473')}
              className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-left transition-colors cursor-pointer"
            >
              <span className="text-xs font-bold text-[#14532D] block">Rameshwar Patil</span>
              <span className="text-[11px] text-emerald-800 font-mono block">UBID: 8431413473 (Farmer)</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoUser('9823418820')}
              className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-left transition-colors cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-900 block">Sunita Devi</span>
              <span className="text-[11px] text-slate-600 font-mono block">UBID: 9823418820 (Farmer)</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoUser('7019234812')}
              className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-left transition-colors cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-900 block">Balasaheb Deshmukh</span>
              <span className="text-[11px] text-slate-600 font-mono block">UBID: 7019234812 (Farmer)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
