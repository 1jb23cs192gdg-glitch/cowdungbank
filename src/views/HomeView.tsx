import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { T2ADiagram } from '../components/T2ADiagram';
import {
  ArrowRight,
  Flame,
  Sprout,
  ShieldCheck,
  Truck,
  CheckCircle2,
  PhoneCall,
  AlertTriangle,
  Droplets,
  Coins,
  Scale,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setCurrentView, navigateToView, prices } = useApp();
  const [selectedCrisis, setSelectedCrisis] = useState<'stubble' | 'soil' | 'import'>('stubble');

  return (
    <div className="relative min-h-screen">
      {/* Pasture & Cow Background for Home Page */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-700"
        style={{
          backgroundImage: `url('/assets/cow_pasture.jpg'), url('https://static.vecteezy.com/system/resources/thumbnails/037/292/672/small_2x/ai-generated-cow-on-a-green-field-with-pasture-photo.jpg')`,
          backgroundPosition: 'center 20%',
        }}
      >
        {/* Soft atmospheric gradient overlay for optimal readability while keeping lush pasture visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/80 via-[#FAF8F5]/88 to-[#FAF8F5]/96 backdrop-blur-[1.5px]" />
      </div>

      <div className="relative z-10 space-y-20 pb-20">
        
        {/* 1. HERO SECTION WITH FIXED, DARKENED COW-IN-PASTURE BACKGROUND OVERLAY */}
        <section className="relative overflow-hidden py-14 sm:py-20 -mt-6">
          {/* Fixed Cow-in-Pasture background */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{
              backgroundImage: `url('/assets/cow_pasture.jpg'), url('https://static.vecteezy.com/system/resources/thumbnails/037/292/672/small_2x/ai-generated-cow-on-a-green-field-with-pasture-photo.jpg')`,
              backgroundAttachment: 'fixed',
              backgroundPosition: 'center 20%',
            }}
          />
          {/* Darkened overlay to ensure text contrast is maintained */}
          <div className="absolute inset-0 z-0 bg-stone-950/80 backdrop-blur-[1.5px]" />
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-stone-950/90 via-stone-900/80 to-stone-950/85" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              
              {/* Left Column: Value Proposition & Tagline */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                
                {/* Mandatory Tagline Banner */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 w-fit backdrop-blur-md shadow-sm">
                  <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold tracking-tight">
                    "From Stubble & Dung to Clean Energy & Fertile Soil"
                  </span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] text-balance drop-shadow-md">
                    PUNARNAVA
                  </h1>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight drop-shadow">
                    Rural India's Unified Cow Dung & Agri-Biomass Bank
                  </p>
                  <p className="text-base sm:text-lg text-stone-200 leading-relaxed max-w-xl text-balance drop-shadow-sm">
                    Eliminating crop stubble burning and open cattle dung dumping. An Amul-style village cooperative converting rural agricultural residue into GOBARdhan Compressed Biogas (CBG) and free organic bio-slurry fertilizer.
                  </p>
                </div>

                {/* High-Impact CTA Buttons: [Explore Biomass Engine] and [Login to Portal] */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('three-pillars');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3.5 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all hover:border-white/50 shadow-md cursor-pointer whitespace-nowrap backdrop-blur-md"
                  >
                    Explore Biomass Engine
                  </button>
                  <button
                    onClick={() => setCurrentView('login')}
                    className="px-6 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg hover:shadow-emerald-900/50 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>Login to Portal</span>
                    <ArrowRight className="w-4 h-4 text-emerald-200" />
                  </button>
                </div>

                {/* Key Trust Signals */}
                <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-stone-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Tamper-Proof Read-Only Farmer Ledger</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span>Instant 2G Keypad Phone SMS Receipts</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Visual Focal Carrier */}
              <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                <img
                  src="/images/hero_biomass_ecosystem_1793281153886.jpg"
                  alt="Rural India Biomass Bank and GOBARdhan CBG plant"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-300">
                    Village Cooperative Model
                  </span>
                  <p className="text-sm font-semibold text-slate-100">
                    Daily weighment of cow dung and crop stubble with instant mobile wallet credits.
                  </p>
                </div>
              </div>

            </div>

            {/* 4-Column Rural Proof & KPI Strip */}
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white/95 backdrop-blur-md rounded-2xl border border-white/40 shadow-2xl text-slate-900">
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  Total Cattle Dung Collected
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#14532D] font-mono tabular-nums">
                  1,120.0 <span className="text-sm font-sans font-semibold text-slate-500">kg</span>
                </span>
                <span className="text-[11px] text-emerald-800 font-semibold mt-0.5 block">
                  Fed to GOBARdhan CBG digesters
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  Crop Stubble Diverted
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono tabular-nums">
                  720.5 <span className="text-sm font-sans font-semibold text-slate-500">kg</span>
                </span>
                <span className="text-[11px] text-amber-800 font-semibold mt-0.5 block">
                  Zero open-field smoke burning
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  Farmer Wallet Credits Paid
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#14532D] font-mono tabular-nums">
                  ₹3,510.00
                </span>
                <span className="text-[11px] text-slate-600 font-semibold mt-0.5 block">
                  Direct village cooperative payout
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  Free Bio-Slurry Reclaimed
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0F766E] font-mono tabular-nums">
                  595 <span className="text-sm font-sans font-semibold text-slate-500">Liters</span>
                </span>
                <span className="text-[11px] text-teal-800 font-semibold mt-0.5 block">
                  Rebuilding farm soil organic carbon
                </span>
              </div>
            </div>

          </div>
        </section>

      {/* 2. INTERACTIVE CRISIS SECTION (RURAL ORGANIC CRISIS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            Rural India's Urgent Problem Statement
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            India's Rural Organic Crisis
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Burning agricultural residue and neglecting bovine biomass destroys soil health and drains national resources.
          </p>
        </div>

        {/* 3 Interactive Crisis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Stubble Burning */}
          <div
            onClick={() => setSelectedCrisis('stubble')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer ${
              selectedCrisis === 'stubble'
                ? 'bg-white border-[#14532D] shadow-md ring-2 ring-[#14532D]/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
              Crisis 01
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
              Stubble Burning & Air Pollution
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Over 35 million tonnes of post-harvest paddy straw and wheat stubble are burnt across North India every autumn. This causes toxic AQI spikes (900+), particulate smog, and destroys surface soil micro-flora.
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono tabular-nums text-slate-700">
              <span>Burnt Residue</span>
              <span className="font-bold text-amber-800">35M Tonnes/Yr</span>
            </div>
          </div>

          {/* Card 2: Degraded Agricultural Soil */}
          <div
            onClick={() => setSelectedCrisis('soil')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer ${
              selectedCrisis === 'soil'
                ? 'bg-white border-[#14532D] shadow-md ring-2 ring-[#14532D]/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-red-700 uppercase tracking-wide">
              Crisis 02
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
              Degraded Agricultural Soil
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Decades of intensive chemical fertilizer (synthetic Urea & DAP) overuse have depleted Soil Organic Carbon (SOC) below 0.3% across prime farmland, hardening topsoil and killing earthworms.
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono tabular-nums text-slate-700">
              <span>Soil Organic Carbon</span>
              <span className="font-bold text-red-700">&lt;0.35% (Depleted)</span>
            </div>
          </div>

          {/* Card 3: Rural Energy & Fertilizer Import Crisis */}
          <div
            onClick={() => setSelectedCrisis('import')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer ${
              selectedCrisis === 'import'
                ? 'bg-white border-[#14532D] shadow-md ring-2 ring-[#14532D]/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#14532D] flex items-center justify-center mb-4">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#14532D] uppercase tracking-wide">
              Crisis 03
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
              Rural Energy & Fertilizer Imports
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              India imports over $18 billion worth of LNG fuel and synthetic fertilizer subsidies annually, while 500+ million cattle produce tonnes of uncollected dung that emits uncaptured methane into open air.
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono tabular-nums text-slate-700">
              <span>National Subsidy Drain</span>
              <span className="font-bold text-[#14532D]">₹1.75 Lakh Crore</span>
            </div>
          </div>

        </div>

        {/* Selected Crisis Expanded Explainer */}
        <div className="mt-6 p-6 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              The PUNARNAVA Cooperative Solution
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-300 font-medium">
              {selectedCrisis === 'stubble' && 'Decentralized Crop Stubble Aggregation & Monetization'}
              {selectedCrisis === 'soil' && 'Fermented Bio-Slurry Replaces Synthetic Urea Free of Cost'}
              {selectedCrisis === 'import' && 'GOBARdhan SATAT CBG Biogas Refineries on Rural Feeder Routes'}
            </span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {selectedCrisis === 'stubble' &&
              'Instead of setting fire to paddy stubble, farmers drop off bundled bales at the village cooperative center. They receive cash at ₹1.50/kg into their wallet, eliminating seasonal smog while earning additional post-harvest income.'}
            {selectedCrisis === 'soil' &&
              'For every kilogram of dung and stubble deposited, the farmer earns quota for certified Bio-Slurry (liquid bio-manure). Returning this fermented digestate to the fields restores soil organic humus, water retention, and crop root depth without chemical burns.'}
            {selectedCrisis === 'import' &&
              'Village centers aggregate rural biomass holdings. Milk-run tankers transport the feedstock to regional GOBARdhan CBG refineries, producing green vehicle-grade bio-CNG that displaces imported fossil fuels.'}
          </p>
        </div>

      </section>

      {/* 3. THE THREE PILLARS (AGRI-BIOMASS FOCUS) */}
      <section id="three-pillars" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
            Operational Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            The Three Pillars of the Rural Biomass Bank
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A cooperative model modeled on the Amul dairy revolution, applied to cattle dung and crop residue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1: Deposit */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#14532D] flex items-center justify-center font-bold text-lg">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Deposit (Village Cooperative)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Farmers drop off cattle dung or bundled crop stubble at local village centers using a 10-Digit Biomass Card without needing smartphones.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#14532D] shrink-0" />
                  <span>10-Digit Unique Biomass ID (UBID)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#14532D] shrink-0" />
                  <span>Smart Bluetooth weighing scale verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#14532D] shrink-0" />
                  <span>Instant 2G phone SMS confirmation</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-[#14532D] font-bold">
              Village Level Intake
            </div>
          </div>

          {/* Pillar 2: Energise */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-lg">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Energise (CBG Refineries)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                GPS-driven milk-run logistics aggregate rural biomass clusters to power GOBARdhan Compressed Biogas (CBG) facilities.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>2.0 Tonnes cluster economic pickup trigger</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>Hydraulic bulk tractor-tanker fleet</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>High-efficiency anaerobic biomethane conversion</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-amber-900 font-bold">
              National SATAT Bio-Energy
            </div>
          </div>

          {/* Pillar 3: Monetise & Restore */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold text-lg">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Monetise & Restore (Fertilizer Loop)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Earn daily wallet income while receiving FREE or discounted nutrient-dense organic Bio-Slurry fertilizer to restore soil health.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Direct cash payment per kg weighed</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Free Bio-Slurry liquid quota allocation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>Replaces 100% of chemical urea costs</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-[#0F766E] font-bold">
              PM-PRANAM Soil Rejuvenation
            </div>
          </div>

        </div>
      </section>

      {/* 4. T2A (TRASH-TO-AYURVEDA) SPOTLIGHT CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <T2ADiagram />
      </section>

      {/* 5. VILLAGE COLLECTION DEPOT LOGISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                  Field Operations & Cooperative Weighment
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Calibrated Hardware & Milk-Run Evacuation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every village collection center operates with battery-backed hanging crane scales. When a farmer deposits crop residue or cattle dung, weight is logged on the Village Cooperative Portal in under 15 seconds.
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-semibold">Local Center:</span>
                  <span className="font-mono">Khed Gram Panchayat Hub #4</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-semibold">Current Cluster Holding:</span>
                  <span className="font-mono font-bold text-slate-900">1.84 / 2.00 Tonnes (92%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Dispatch Alert:</span>
                  <span className="text-emerald-800 font-bold">Automated Milk-Run Activated</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateToView('admin-dashboard')}
                  className="px-5 py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Open Village Cooperative Console</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full bg-slate-100">
              <img
                src="/images/waste_segregation_logistics_1793281154707.jpg"
                alt="Village biomass depot with digital crane scale and electric pickup vehicle"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <span className="font-bold">Village Collection Center #4</span>
                <p className="text-slate-200 text-[11px]">Calibrated digital weighing of crop stubble sacks with instant farmer wallet credit.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION TO PORTALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#14532D] to-[#0f3f22] rounded-2xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Access Your Village Biomass Account
            </h3>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Login as a verified farmer with your 10-Digit UBID to inspect deposits and claim free organic bio-slurry, or open the cooperative manager interface to record daily collections.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <button
              onClick={() => setCurrentView('login')}
              className="px-6 py-3.5 text-xs font-bold text-[#14532D] bg-white hover:bg-emerald-50 rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              Sign In with 10-Digit UBID
            </button>
            <button
              onClick={() => setCurrentView('about')}
              className="px-6 py-3.5 text-xs font-bold text-white bg-emerald-900/80 hover:bg-emerald-900 rounded-xl transition-all border border-emerald-700/50 cursor-pointer whitespace-nowrap"
            >
              Read National Policy Goals
            </button>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
};
