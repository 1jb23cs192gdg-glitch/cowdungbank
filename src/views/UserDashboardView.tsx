import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  Scale,
  ShieldAlert,
  Sprout,
  Receipt,
  Phone,
  Lock,
  QrCode,
  Droplets,
  Flame,
  CheckCircle2,
  Gift,
  X,
  FileText,
  BadgeCheck,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { BiomassType } from '../types';

export const UserDashboardView: React.FC = () => {
  const {
    currentFarmer,
    activeRole,
    claimBioSlurryVoucher,
    navigateToView,
    setInitialLoginRole,
  } = useApp();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [litersToClaim, setLitersToClaim] = useState<number>(50);
  const [newlyClaimedCode, setNewlyClaimedCode] = useState<string | null>(null);

  // Authentication Guard Check
  if (activeRole !== 'user' || !currentFarmer) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Farmer Authentication Required
        </h2>
        <p className="text-sm text-slate-600">
          Access to the read-only biomass ledger, wallet credits, and free bio-slurry quota requires logging in with your 10-Digit Unique Biomass ID (UBID) or registered mobile number.
        </p>
        <button
          onClick={() => {
            setInitialLoginRole('user');
            navigateToView('login');
          }}
          className="px-6 py-2.5 text-xs font-bold text-white bg-[#14532D] hover:bg-[#0f3f22] rounded-xl shadow-sm cursor-pointer"
        >
          Sign In with 10-Digit UBID
        </button>
      </div>
    );
  }

  const handleClaimVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (litersToClaim <= 0) return;
    const res = claimBioSlurryVoucher(litersToClaim);
    if (res.success && res.code) {
      setNewlyClaimedCode(res.code);
    }
  };

  const filteredLedger = currentFarmer.ledger.filter((entry) => {
    const matchesType = typeFilter === 'all' || entry.biomassType === typeFilter;
    const matchesSearch =
      entry.biomassType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.loggedByManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.qualityGrade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. STRICT READ-ONLY INTEGRITY BANNER */}
      <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span>
            <strong className="text-white">Strict Read-Only Ledger Mode:</strong> Farmer accounts are view-only to prevent tampering. All dung and stubble deposits are digitally weighed and sealed by your Village Cooperative Center supervisor.
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-amber-400 font-mono shrink-0 pl-8 sm:pl-0">
          <span>Kisan Passbook Verified</span>
          <span>·</span>
          <span>SIH26195</span>
        </div>
      </div>

      {/* 2. FARMER HEADER & KISAN BIOMASS PASSBOOK CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentFarmer.name}
            </h1>
            
            {/* Status Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#14532D] border border-emerald-300">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
              Verified Farmer - Eligible for Free Bio-Slurry Fertilizer
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
            <span>Location: <strong className="text-slate-800">{currentFarmer.village}, {currentFarmer.gramPanchayat}</strong></span>
            <span>·</span>
            <span>District: <strong className="text-slate-800">{currentFarmer.district}, {currentFarmer.state}</strong></span>
            <span>·</span>
            <span>Mobile: <strong className="text-slate-800 font-mono">{currentFarmer.phone}</strong></span>
          </div>

          {/* UBID Passbook Pill */}
          <div className="inline-flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">10-Digit UBID Card:</span>
            <span className="font-mono font-extrabold text-sm sm:text-base text-[#14532D] tracking-wider">
              {currentFarmer.ubid}
            </span>
          </div>
        </div>

        {/* Financial & Quota Summary Cards */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
          {/* Unified Wallet Balance */}
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-5 text-right flex-1 sm:flex-initial sm:min-w-[190px]">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block">
              Unified Wallet Balance
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#14532D] font-mono tabular-nums">
              ₹{currentFarmer.walletBalance.toFixed(2)}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
              Direct DBT / Bank Linked
            </span>
          </div>

          {/* Free Bio-Slurry Quota */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 text-right flex-1 sm:flex-initial sm:min-w-[190px]">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide block">
              Free Bio-Slurry Quota
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-900 font-mono tabular-nums">
              {currentFarmer.bioSlurryQuotaLiters} <span className="text-base font-bold font-sans">Liters</span>
            </span>
            <span className="text-[10px] text-amber-700 font-medium block mt-0.5">
              Available at Village Dispenser
            </span>
          </div>
        </div>
      </div>

      {/* 3. LIVE METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Cattle Dung Deposited */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-[#14532D]">
              Total Cattle Dung Deposited
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#14532D] flex items-center justify-center font-bold">
              🐄
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tabular-nums">
            {currentFarmer.totalDungKg.toFixed(1)} <span className="text-base font-semibold text-slate-500 font-sans">kg</span>
          </div>
          <p className="text-xs text-slate-500">
            Supplied to GOBARdhan CBG anaerobic digestors for clean cooking gas.
          </p>
        </div>

        {/* Metric 2: Agri-Stubble Deposited */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Total Stubble Deposited
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              🌾
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tabular-nums">
            {currentFarmer.totalStubbleKg.toFixed(1)} <span className="text-base font-semibold text-slate-500 font-sans">kg</span>
          </div>
          <p className="text-xs text-slate-500">
            Paddy straw & stubble diverted from open field burning into bio-energy.
          </p>
        </div>

        {/* Metric 3: Wallet Income */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Total Wallet Credits
            </span>
            <Wallet className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="text-3xl font-black text-emerald-800 font-mono tabular-nums">
            ₹{currentFarmer.walletBalance.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500">
            Transparent cash earnings credited directly per weighed kilogram.
          </p>
        </div>

        {/* Metric 4: Free Bio-Slurry Quota */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Free Bio-Slurry Quota
            </span>
            <Droplets className="w-5 h-5 text-teal-700" />
          </div>
          <div className="text-3xl font-black text-teal-800 font-mono tabular-nums">
            {currentFarmer.bioSlurryQuotaLiters} <span className="text-base font-semibold text-slate-500 font-sans">L</span>
          </div>
          <p className="text-xs text-slate-500">
            Enriched NPK organic fertilizer earned at 0.35L per kg biomass.
          </p>
        </div>

      </div>

      {/* 4. CIRCULAR SOIL RESTORATION & ENVIRONMENTAL IMPACT */}
      <div className="bg-gradient-to-br from-[#14532D] via-[#0f3f22] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-emerald-800/60">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
              <Sprout className="w-3.5 h-3.5 text-emerald-300" />
              <span>Circular Bio-Economy Metrics</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Your Personal Farm Soil & Climate Scorecard
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Every cart of crop residue and cattle dung you deposit protects northern skies from smog and returns live organic microbial carbon to your family farmland.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => {
                setShowClaimModal(true);
                setNewlyClaimedCode(null);
              }}
              disabled={currentFarmer.bioSlurryQuotaLiters <= 0}
              className={`px-6 py-3.5 text-xs font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                currentFarmer.bioSlurryQuotaLiters > 0
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 font-black'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Droplets className="w-4 h-4 text-slate-950" />
              <span>Claim Free Bio-Slurry Voucher</span>
            </button>
          </div>
        </div>

        {/* 4 Metric counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          <div className="space-y-1">
            <span className="text-xs text-emerald-300 font-medium block">Stubble Smoke Averted</span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white tabular-nums">
              {currentFarmer.environmentalImpact.stubbleBurningAvoidedKg} <span className="text-sm font-sans font-normal text-emerald-200">kg</span>
            </div>
            <p className="text-[11px] text-emerald-200/80">Prevented particulate air pollution</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-emerald-300 font-medium block">Greenhouse CO₂ Cut</span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white tabular-nums">
              {currentFarmer.environmentalImpact.co2AvertedKg} <span className="text-sm font-sans font-normal text-emerald-200">kg</span>
            </div>
            <p className="text-[11px] text-emerald-200/80">Methane & carbon emissions diverted</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-emerald-300 font-medium block">Soil Humus Restored</span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white tabular-nums">
              {currentFarmer.environmentalImpact.soilHumusRestoredSqM} <span className="text-sm font-sans font-normal text-emerald-200">m²</span>
            </div>
            <p className="text-[11px] text-emerald-200/80">Microbial living soil area enriched</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-emerald-300 font-medium block">CBG Biogas Generated</span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white tabular-nums">
              {currentFarmer.environmentalImpact.methaneCapturedCubicM} <span className="text-sm font-sans font-normal text-emerald-200">m³</span>
            </div>
            <p className="text-[11px] text-emerald-200/80">Clean cooking & vehicle fuel captured</p>
          </div>
        </div>
      </div>

      {/* 5. ACTIVE BIO-SLURRY PICKUP VOUCHERS LIST */}
      {currentFarmer.vouchers.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#14532D]" />
              <h3 className="text-base font-bold text-slate-900">
                Your Free Bio-Slurry Pickup Vouchers ({currentFarmer.vouchers.length})
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Present code at village cooperative dispenser tank
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFarmer.vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-[#14532D] text-sm tracking-wider">
                    {voucher.code}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      voucher.status === 'Available'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {voucher.status}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-teal-600" />
                  <span>{voucher.quantityLiters} Liters Enriched Bio-Slurry</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Location: <strong className="text-slate-800">{voucher.collectionHub}</strong>
                </div>
                <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-stone-200">
                  Issued: {voucher.issueDate} · Valid till: {voucher.expiryDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. GRID: DAILY DEPOSIT HISTORY TABLE (8 COLS) & SMS ALERT SIMULATOR (4 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* DAILY DEPOSIT HISTORY TABLE (8 COLS) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Daily Biomass Deposit Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Tamper-evident record of cattle dung & crop residue drop-offs verified at village smart scales.
              </p>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#14532D]"
              >
                <option value="all">All Biomass Categories</option>
                <option value="Cattle Dung">Cattle Dung (Cow/Buffalo)</option>
                <option value="Crop Residue / Stubble">Crop Residue / Stubble</option>
                <option value="Agri-Husk / Straw">Agri-Husk / Straw</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-slate-500 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Date & Receipt</th>
                  <th className="py-3 px-3">Biomass Type & Grade</th>
                  <th className="py-3 px-3 text-right">Weight (kg)</th>
                  <th className="py-3 px-3 text-right">Buy Rate (₹/kg)</th>
                  <th className="py-3 px-3 text-right">Wallet Credit (₹)</th>
                  <th className="py-3 px-3 text-right">Free Slurry (+L)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-slate-800">
                {filteredLedger.length > 0 ? (
                  filteredLedger.map((entry) => (
                    <tr key={entry.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-900 block">{entry.dateTime}</span>
                        <span className="text-[11px] text-slate-400 font-mono block">
                          {entry.receiptNo}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 block">
                          {entry.biomassType}
                        </span>
                        <span className="text-[11px] text-emerald-800 font-medium">
                          {entry.qualityGrade}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums text-slate-900 text-sm">
                        {entry.weightKg.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                        ₹{entry.ratePerKg.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-extrabold text-[#14532D] tabular-nums text-sm">
                        +₹{entry.walletCredit.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-700 tabular-nums">
                        +{entry.bioSlurryQuotaEarnedLiters} L
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No deposit records match your selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-stone-100">
            <span>Showing {filteredLedger.length} ledger transactions</span>
            <span className="font-mono text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Cryptographic Village Seal Verified
            </span>
          </div>
        </div>

        {/* SMS ALERT PREVIEW BOX (FEATURE-PHONE SIMULATOR) (4 COLS) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#14532D]" />
              <h3 className="text-base font-bold text-slate-900">
                SMS Alert Preview Box
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Simulated real-time keypad feature-phone SMS received over 2G GSM cellular network without requiring a smartphone or internet data.
            </p>
          </div>

          {/* Feature Phone Device Frame */}
          <div className="bg-slate-900 rounded-3xl p-4 border-2 border-slate-800 shadow-xl space-y-3">
            
            {/* Phone Screen Header */}
            <div className="bg-emerald-950/80 border border-emerald-800/60 rounded-t-xl p-2.5 flex items-center justify-between text-[11px] text-emerald-300 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>BSNL GSM</span>
              </div>
              <span className="font-bold">INBOX (SMS)</span>
            </div>

            {/* Screen Messages Feed */}
            <div className="bg-slate-950 p-3 rounded-b-xl space-y-3 max-h-[380px] overflow-y-auto">
              {currentFarmer.smsLogs.length > 0 ? (
                currentFarmer.smsLogs.map((sms) => (
                  <div
                    key={sms.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs text-slate-200"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="text-emerald-400 font-bold">{sms.sender}</span>
                      <span>{sms.timestamp}</span>
                    </div>
                    <p className="font-mono text-[11px] leading-relaxed text-slate-200">
                      {sms.message}
                    </p>
                    <div className="flex justify-end text-[10px] text-emerald-400 font-mono">
                      ✓ Delivered to 2G Keypad
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-600 font-mono">
                  No SMS logs recorded.
                </div>
              )}
            </div>

            <div className="text-center text-[10px] text-slate-400 font-mono">
              Keypad Device Mirror · 10-Digit UBID Linked
            </div>
          </div>
        </div>

      </div>

      {/* 7. CLAIM FREE BIO-SLURRY VOUCHER MODAL */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Claim Free Organic Bio-Slurry
                </h3>
              </div>
              <button
                onClick={() => setShowClaimModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!newlyClaimedCode ? (
              <form onSubmit={handleClaimVoucherSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Convert your earned biomass deposits into a free collection voucher for fermented liquid bio-slurry fertilizer rich in nitrogen, phosphorus, and potassium.
                </p>

                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                  <span className="font-semibold">Available Free Quota:</span>
                  <span className="font-mono font-black text-base">
                    {currentFarmer.bioSlurryQuotaLiters} Liters
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Select Liters to Claim
                  </label>
                  <select
                    value={litersToClaim}
                    onChange={(e) => setLitersToClaim(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#14532D]"
                  >
                    <option value={20} disabled={currentFarmer.bioSlurryQuotaLiters < 20}>20 Liters (Mini Canister)</option>
                    <option value={50} disabled={currentFarmer.bioSlurryQuotaLiters < 50}>50 Liters (Standard Drum)</option>
                    <option value={100} disabled={currentFarmer.bioSlurryQuotaLiters < 100}>100 Liters (Tanker Quota)</option>
                    <option value={currentFarmer.bioSlurryQuotaLiters}>
                      All Available ({currentFarmer.bioSlurryQuotaLiters} Liters)
                    </option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowClaimModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={currentFarmer.bioSlurryQuotaLiters < litersToClaim || litersToClaim <= 0}
                    className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow cursor-pointer ${
                      currentFarmer.bioSlurryQuotaLiters >= litersToClaim && litersToClaim > 0
                        ? 'bg-[#14532D] hover:bg-[#0f3f22]'
                        : 'bg-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Issue Bio-Slurry Voucher
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Bio-Slurry Voucher Issued!
                </h4>
                
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">Voucher Code:</span>
                    <span className="font-mono font-black text-[#14532D] text-base">{newlyClaimedCode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">Quantity:</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">{litersToClaim} Liters Free Bio-Slurry</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">Collection Hub:</span>
                    <span className="text-xs text-slate-800 font-medium">Khed GOBARdhan Bio-Slurry Dispenser Tank #1</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  An SMS containing this pickup code has been dispatched to your mobile. Present this code or SMS to the cooperative attendant at the dispenser tank.
                </p>

                <button
                  onClick={() => setShowClaimModal(false)}
                  className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
