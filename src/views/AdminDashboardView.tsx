import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ClipboardEdit,
  Users,
  BadgeDollarSign,
  Truck,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Sprout,
  ArrowRight,
  Phone,
  RefreshCw,
  X,
  Lock,
  Droplets,
  Layers,
  Scale,
} from 'lucide-react';
import { BiomassType, QualityGrade, FarmerProfile } from '../types';

export const AdminDashboardView: React.FC = () => {
  const {
    activeRole,
    currentAdmin,
    farmers,
    prices,
    villageStorage,
    logBiomassDeposit,
    updateBiomassPrice,
    dispenseBioSlurryByAdmin,
    triggerMilkRunLogistics,
    showToast,
    navigateToView,
    setInitialLoginRole,
  } = useApp();

  // If not logged in as admin, block access
  if (activeRole !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Administrator Access Restricted
        </h2>
        <p className="text-sm text-slate-600">
          This management console is strictly for verified Village Cooperative Center Managers and weighment attendants. Please authenticate with your credentials.
        </p>
        <button
          onClick={() => {
            setInitialLoginRole('admin');
            navigateToView('login');
          }}
          className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm cursor-pointer"
        >
          Sign In as Administrator
        </button>
      </div>
    );
  }

  // Quick Entry Form State
  const [ubidInput, setUbidInput] = useState('8431413473');
  const [selectedType, setSelectedType] = useState<BiomassType>('Cattle Dung');
  const [weightInput, setWeightInput] = useState<number>(50);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A - Optimal Moisture (<20%)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Directory Search State
  const [directorySearch, setDirectorySearch] = useState('');
  const [viewingFarmer, setViewingFarmer] = useState<FarmerProfile | null>(null);
  const [dispenseFarmer, setDispenseFarmer] = useState<FarmerProfile | null>(null);
  const [dispenseLiters, setDispenseLiters] = useState<number>(50);

  // Price Board State
  const [editingPrices, setEditingPrices] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    prices.forEach((p) => {
      map[p.category] = p.ratePerKg;
    });
    return map;
  });

  // Calculate live preview of payout
  const activePriceObj = prices.find((p) => p.category === selectedType);
  const baseRate = activePriceObj ? activePriceObj.ratePerKg : 2.0;
  let multiplier = 1.0;
  if (qualityGrade.includes('Grade B')) multiplier = 0.85;
  if (qualityGrade.includes('Grade C')) multiplier = 0.70;
  const effectiveRate = Number((baseRate * multiplier).toFixed(2));
  const estimatedCredit = Number((effectiveRate * (weightInput || 0)).toFixed(2));
  const estimatedSlurry = Math.round((weightInput || 0) * 0.35);

  // Matched Farmer preview
  const matchedFarmer = farmers[ubidInput.trim()] || null;

  // Handle Quick Deposit Submission
  const handleQuickDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ubidInput.trim()) {
      showToast('Please enter a 10-digit UBID or phone number.', 'warning');
      return;
    }
    if (weightInput <= 0) {
      showToast('Please enter a valid weight in kg.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = logBiomassDeposit({
        ubid: ubidInput.trim(),
        biomassType: selectedType,
        weightKg: weightInput,
        qualityGrade,
      });

      setIsSubmitting(false);
      if (res.success) {
        setWeightInput(50);
      }
    }, 250);
  };

  // Handle Price Board Save
  const handleSavePrice = (cat: BiomassType) => {
    const newRate = editingPrices[cat];
    if (newRate !== undefined && newRate > 0) {
      updateBiomassPrice(cat, newRate);
    }
  };

  // Handle Admin Dispense Bio Slurry
  const handleConfirmDispense = (e: React.FormEvent) => {
    e.preventDefault();
    if (dispenseFarmer && dispenseLiters > 0) {
      dispenseBioSlurryByAdmin(dispenseFarmer.ubid, dispenseLiters);
      setDispenseFarmer(null);
    }
  };

  // Filtered Farmers
  const farmerList = Object.values(farmers).filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
      f.ubid.includes(directorySearch) ||
      f.village.toLowerCase().includes(directorySearch.toLowerCase());
    return matchesSearch;
  });

  const storagePercentage = Math.min(
    100,
    Math.round((villageStorage.currentTonnes / villageStorage.thresholdTonnes) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Supervisor Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#14532D]">
            <span>{currentAdmin.centerName}</span>
            <span>·</span>
            <span className="font-mono text-slate-500">{currentAdmin.centerCode}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Village Cooperative Manager Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Supervisor: <strong className="text-slate-800">{currentAdmin.name}</strong> · Taluka: {currentAdmin.taluka}, District: {currentAdmin.district}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-stone-50 rounded-2xl px-5 py-3 text-right border border-stone-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
              Registered Farmers
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {Object.keys(farmers).length}
            </span>
          </div>
          <div className="bg-emerald-50 rounded-2xl px-5 py-3 text-right border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block">
              Village Holding
            </span>
            <span className="text-2xl font-black text-[#14532D] font-mono tabular-nums">
              {villageStorage.currentTonnes.toFixed(2)} <span className="text-xs font-bold font-sans">Tonnes</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid: MODULE 1 (Quick Entry Form) & MODULE 4 (Bulk Milk-Run Logistics) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* MODULE 1: QUICK ENTRY LOG PANEL (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                Module 01: Core Intake & Scale Weighment
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Quick Entry Biomass Deposit Log
              </h2>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#14532D] flex items-center justify-center">
              <ClipboardEdit className="w-5 h-5" />
            </div>
          </div>

          <form onSubmit={handleQuickDepositSubmit} className="space-y-5">
            
            {/* UBID Input & Quick Match Pill */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Farmer 10-Digit UBID / Phone Number
                </label>
                {matchedFarmer && (
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#14532D]" />
                    {matchedFarmer.name} ({matchedFarmer.village})
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={ubidInput}
                  onChange={(e) => setUbidInput(e.target.value)}
                  placeholder="e.g. 8431413473"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-slate-900 text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              {/* Quick Pick UBID shortcuts */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] text-slate-400">Quick pick:</span>
                <button
                  type="button"
                  onClick={() => setUbidInput('8431413473')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-mono cursor-pointer transition-all ${
                    ubidInput === '8431413473'
                      ? 'bg-[#14532D] text-white font-bold'
                      : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                  }`}
                >
                  8431413473 (Rameshwar Patil)
                </button>
                <button
                  type="button"
                  onClick={() => setUbidInput('9823418820')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-mono cursor-pointer transition-all ${
                    ubidInput === '9823418820'
                      ? 'bg-[#14532D] text-white font-bold'
                      : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                  }`}
                >
                  9823418820 (Sunita Devi)
                </button>
                <button
                  type="button"
                  onClick={() => setUbidInput('7019234812')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-mono cursor-pointer transition-all ${
                    ubidInput === '7019234812'
                      ? 'bg-[#14532D] text-white font-bold'
                      : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                  }`}
                >
                  7019234812 (Balasaheb Deshmukh)
                </button>
              </div>
            </div>

            {/* Biomass Type Selection (STRICT: ONLY CATTLE DUNG & AGRI RESIDUE) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Biomass Type (Rural Agri-Streams Only)
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as BiomassType)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-slate-900 text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532D]"
              >
                <option value="Cattle Dung">Cattle Dung (Cow/Buffalo Fresh Manure - CBG Base)</option>
                <option value="Crop Residue / Stubble">Crop Residue / Stubble (Paddy Straw & Wheat Stubble)</option>
                <option value="Agri-Husk / Straw">Agri-Husk / Straw (Mustard/Gram/Millet Husks)</option>
              </select>
            </div>

            {/* Weight / Quantity & Quality Grade (2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Weight (kg) - Smart Scale Input
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={weightInput}
                  onChange={(e) => setWeightInput(Number(e.target.value))}
                  placeholder="Weight in kg"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-slate-900 text-sm font-mono font-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Moisture / Quality Grade
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532D]"
                >
                  <option value="Grade A - Optimal Moisture (<20%)">Grade A - Optimal Moisture (&lt;20%, 100% Rate)</option>
                  <option value="Grade B - Medium Moisture (20-35%)">Grade B - Medium Moisture (20-35%, 85% Rate)</option>
                  <option value="Grade C - High Moisture (>35%)">Grade C - High Moisture (&gt;35%, 70% Rate)</option>
                </select>
              </div>
            </div>

            {/* Real-Time Payout Calculation & Slurry Yield Preview */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-800 font-semibold block">
                    Computed Buy Rate:
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    ₹{effectiveRate.toFixed(2)}/kg
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wide block">
                    Instant Wallet Credit:
                  </span>
                  <span className="text-2xl font-black text-[#14532D] font-mono tabular-nums">
                    ₹{estimatedCredit.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-emerald-200/70 flex items-center justify-between text-xs text-emerald-950 font-medium">
                <span>Free Bio-Slurry Quota Credit:</span>
                <span className="font-bold text-teal-800 font-mono">+{estimatedSlurry} Liters</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 text-sm font-black text-white bg-[#14532D] hover:bg-[#0f3f22] rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-emerald-300" />
              <span>{isSubmitting ? 'Recording & Crediting Wallet...' : 'Log Deposit & Credit Farmer Wallet'}</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              *Submitting instantly credits the farmer's wallet, earns free bio-slurry quota, dispatches a simulated SMS to their keypad phone, and updates the village storage holding.
            </p>
          </form>
        </div>

        {/* MODULE 4: BULK DISPATCH & MILK-RUN LOGISTICS MONITOR (5 COLS) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Module 04: Bulk Field Logistics
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                CBG Milk-Run Tanker Evacuation
              </h2>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          {/* Village Storage Capacity Status Indicator */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-700">
                Village Aggregate Holding:
              </span>
              <span className="text-sm font-mono font-black text-slate-900 tabular-nums">
                {villageStorage.currentTonnes.toFixed(2)} / {villageStorage.thresholdTonnes.toFixed(2)} Tonnes
              </span>
            </div>

            {/* Capacity Progress Bar */}
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden p-0.5 border border-stone-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  storagePercentage >= 90
                    ? 'bg-amber-600 animate-pulse'
                    : storagePercentage >= 70
                    ? 'bg-teal-600'
                    : 'bg-[#14532D]'
                }`}
                style={{ width: `${storagePercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>{storagePercentage}% Capacity</span>
              <span>Economic Threshold: 2.00 Tonnes</span>
            </div>
          </div>

          {/* Economic Dispatch Alert Trigger */}
          {villageStorage.currentTonnes >= 1.8 && !villageStorage.activeDispatch && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Economic Dispatch Level Reached!</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Aggregated storage has reached {villageStorage.currentTonnes.toFixed(2)} Tonnes. Dispatching the bulk tractor-tanker will transport the batch directly to the regional MahaBio SATAT CBG Biogas Refinery.
              </p>
            </div>
          )}

          {/* Active Dispatch Status Card if Dispatched */}
          {villageStorage.activeDispatch ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  {villageStorage.activeDispatch.status}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800">
                  ETA ~{villageStorage.activeDispatch.etaMinutes} mins
                </span>
              </div>
              <div className="text-xs text-emerald-950 font-mono space-y-1 pt-1">
                <div>Vehicle: {villageStorage.activeDispatch.vehicleNo}</div>
                <div>Driver: {villageStorage.activeDispatch.driverName} ({villageStorage.activeDispatch.driverPhone})</div>
                <div>Destination: {villageStorage.activeDispatch.destinationCBGPlant}</div>
              </div>
            </div>
          ) : (
            <button
              onClick={triggerMilkRunLogistics}
              className="w-full py-3.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all shadow cursor-pointer flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4 text-emerald-300" />
              <span>Trigger CBG Bulk Tractor-Tanker Evacuation</span>
            </button>
          )}

          {/* Depot Storage Breakdown */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
              Holding by Biomass Stream:
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-slate-500 block text-[10px] uppercase">Cattle Dung</span>
                <span className="font-black text-slate-900 text-sm">{villageStorage.holdingDungKg} kg</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-slate-500 block text-[10px] uppercase">Crop Stubble</span>
                <span className="font-black text-slate-900 text-sm">{villageStorage.holdingStubbleKg} kg</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-mono pt-1">
              Last Dispatched: {villageStorage.lastDispatchDate}
            </div>
          </div>

        </div>

      </div>

      {/* MODULE 3: REAL-TIME BIOMASS PRICING CONFIGURATOR */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Module 03: Cooperative Pricing Controls
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Biomass Buying Rate Configurator
            </h2>
            <p className="text-xs text-slate-500">
              Set and update fair-value purchase prices per kilogram paid directly to farmers for cattle dung and crop stubble.
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <BadgeDollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {prices.map((item) => (
            <div
              key={item.category}
              className="p-5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-3 flex flex-col justify-between"
            >
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  {item.category}
                </span>
                <div className="text-xs text-slate-500 space-y-1 mt-1 font-mono">
                  <div>Energy: {item.energyYield}</div>
                  <div>Slurry: {item.fertilizerYield}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200/70">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      step={0.1}
                      min={0.1}
                      value={editingPrices[item.category] ?? item.ratePerKg}
                      onChange={(e) =>
                        setEditingPrices({
                          ...editingPrices,
                          [item.category]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full pl-7 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSavePrice(item.category)}
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Save Rate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODULE 2: REGISTERED FARMERS MANAGEMENT DIRECTORY */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
              Module 02: Community Kisan Registry
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Registered Farmers Directory
            </h2>
            <p className="text-xs text-slate-500">
              Inspect member deposit histories or dispense free organic bio-slurry quotas directly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search name, UBID or village..."
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl w-60 sm:w-72 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#14532D]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-slate-500 uppercase font-bold tracking-wider">
                <th className="py-3 px-3">Farmer Name & Village</th>
                <th className="py-3 px-3">10-Digit UBID</th>
                <th className="py-3 px-3 text-right">Total Dung (kg)</th>
                <th className="py-3 px-3 text-right">Total Stubble (kg)</th>
                <th className="py-3 px-3 text-right">Wallet Balance (₹)</th>
                <th className="py-3 px-3 text-right">Bio-Slurry Quota (L)</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-slate-800">
              {farmerList.map((farmer) => (
                <tr key={farmer.ubid} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 block text-sm">{farmer.name}</span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {farmer.village}, {farmer.district}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    {farmer.ubid}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                    {farmer.totalDungKg.toFixed(1)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                    {farmer.totalStubbleKg.toFixed(1)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-extrabold text-[#14532D] tabular-nums text-sm">
                    ₹{farmer.walletBalance.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-800 tabular-nums">
                    {farmer.bioSlurryQuotaLiters} L
                  </td>
                  <td className="py-3.5 px-3 text-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setViewingFarmer(farmer)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                    >
                      View Ledger
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDispenseFarmer(farmer);
                        setDispenseLiters(50);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Dispense Slurry
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: VIEW FARMER LEDGER DETAILS */}
      {viewingFarmer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Biomass Ledger: {viewingFarmer.name}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  UBID: {viewingFarmer.ubid} · {viewingFarmer.village} ({viewingFarmer.phone})
                </span>
              </div>
              <button
                onClick={() => setViewingFarmer(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-emerald-800 font-semibold block">Total Dung:</span>
                <span className="font-mono font-bold text-sm text-emerald-950">
                  {viewingFarmer.totalDungKg} kg
                </span>
              </div>
              <div>
                <span className="text-emerald-800 font-semibold block">Total Stubble:</span>
                <span className="font-mono font-bold text-sm text-emerald-950">
                  {viewingFarmer.totalStubbleKg} kg
                </span>
              </div>
              <div className="text-right">
                <span className="text-emerald-800 font-semibold block">Current Balance:</span>
                <span className="font-mono font-black text-sm text-[#14532D]">
                  ₹{viewingFarmer.walletBalance.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Deposit Transactions ({viewingFarmer.ledger.length})
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                {viewingFarmer.ledger.map((entry) => (
                  <div key={entry.id} className="p-3 text-xs flex items-center justify-between hover:bg-stone-50">
                    <div>
                      <span className="font-bold text-slate-900 block">{entry.biomassType}</span>
                      <span className="text-[11px] text-slate-500 block">
                        {entry.qualityGrade} · ₹{entry.ratePerKg}/kg
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {entry.dateTime} · {entry.receiptNo}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-slate-800 block">{entry.weightKg} kg</span>
                      <span className="font-extrabold text-[#14532D] text-[11px]">
                        +₹{entry.walletCredit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingFarmer(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADMIN DIRECT BIO-SLURRY DISPENSING */}
      {dispenseFarmer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Dispense Bio-Slurry to Farmer
                </h3>
              </div>
              <button
                onClick={() => setDispenseFarmer(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispense} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                <span className="text-slate-500 block">Beneficiary Farmer:</span>
                <span className="font-bold text-slate-900 block text-sm">{dispenseFarmer.name}</span>
                <span className="text-[11px] font-mono text-slate-500">UBID: {dispenseFarmer.ubid} · {dispenseFarmer.village}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Quantity in Liters
                </label>
                <input
                  type="number"
                  min={10}
                  step={10}
                  value={dispenseLiters}
                  onChange={(e) => setDispenseLiters(Number(e.target.value))}
                  placeholder="e.g. 50"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-slate-900 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#14532D]"
                />
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Dispensing generates an official pickup voucher and transmits a confirmation SMS to the farmer's registered phone.
              </p>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDispenseFarmer(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#14532D] hover:bg-[#0f3f22] rounded-xl shadow cursor-pointer"
                >
                  Authorize & Send SMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
