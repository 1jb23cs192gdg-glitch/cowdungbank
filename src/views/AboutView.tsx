import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle,
  Award,
  ArrowRight,
  Sprout,
  Flame,
  Droplets,
  Coins,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useApp();

  const policies = [
    {
      title: 'GOBARdhan Scheme',
      authority: 'Department of Drinking Water and Sanitation & Ministry of Jal Shakti',
      summary:
        'Galvanizing Organic Bio-Agro Resources Dhan: Focuses on managing cattle dung and agricultural post-harvest residue into bio-gas, enriched organic bio-slurry, and Compressed Biogas.',
      alignment:
        'PUNARNAVA establishes village-level collection centers that aggregate cow dung and crop stubble, guaranteeing guaranteed fair purchase rates for participating farmers.',
    },
    {
      title: 'National Bioenergy Programme & SATAT CBG Mandate',
      authority: 'Ministry of Petroleum & Natural Gas (MoPNG) / MNRE',
      summary:
        'Sustainable Alternative Towards Affordable Transportation (SATAT): Mandates setting up 5,000 commercial CBG plants across India to produce vehicle-grade green fuel from agricultural biomass.',
      alignment:
        'Our milk-run logistics monitor aggregates rural village holding clusters to feed regional SATAT CBG refineries directly with calibrated supply.',
    },
    {
      title: 'PM-PRANAM Scheme',
      authority: 'Ministry of Chemicals & Fertilizers, Government of India',
      summary:
        'PM Programme for Restoration, Awareness, Nourishment and Amelioration of Mother Earth: Promotes balanced use of chemical fertilizers combined with organic bio-fertilizers and bio-slurry.',
      alignment:
        'Farmers receive free quotas of fermented Bio-Slurry liquid manure for every kilogram of biomass deposited, actively rebuilding soil organic carbon without synthetic chemical burns.',
    },
    {
      title: 'NITI Aayog Circular Bio-Economy Framework',
      authority: 'NITI Aayog / Government of India',
      summary:
        'Strategy for converting post-harvest crop residue and bovine bio-resources into high-value rural wealth, preventing seasonal air pollution and promoting rural entrepreneurship.',
      alignment:
        'Operates an Amul-style decentralized cooperative banking model where farmers monetize crop residue directly at village weighment counters.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 1. HERO HEADER */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
          Problem Statement T2A: Rural Agri-Biomass & Energy Ecosystem (SIH26195)
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight text-balance">
          Building India's Amul-Style Village Biomass Cooperative Network
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          <span className="font-semibold text-[#14532D]">PUNARNAVA</span> eliminates open crop residue burning and unorganized cattle dung dumping by providing farmers with a reliable village biomass bank. In exchange for agricultural residue and dung, farmers earn daily wallet income and reclaim free organic bio-slurry to rejuvenate soil fertility.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentView('login')}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#14532D] hover:bg-[#0f3f22] rounded-xl shadow cursor-pointer inline-flex items-center gap-2"
          >
            <span>Access Cooperative Portals</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
          </button>
        </div>
      </div>

      {/* 2. OUR CORE STRATEGIC GOALS */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Our Triple Strategic Goal
          </h2>
          <p className="text-sm text-slate-500">
            Measurable national outcomes for rural Indian agriculture and clean energy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#14532D] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Provide Predictable Rural Income
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monetize every kilogram of paddy straw, wheat stubble, and cattle dung with guaranteed cooperative purchase prices credited directly to farmer wallets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Achieve 100% Bio-Energy Generation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Channel aggregated village biomass holdings into GOBARdhan SATAT Compressed Biogas (CBG) refineries, replacing expensive imported fossil fuels.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Restore Agricultural Soil Carbon
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Supply nutrient-dense, fermented organic Bio-Slurry fertilizer back to farmer fields to reverse soil degradation caused by chemical urea overuse.
            </p>
          </div>

        </div>
      </section>

      {/* 3. NATIONAL POLICY ALIGNMENT SECTION */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
            Statutory Alignment
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            National Policy Badges
          </h2>
          <p className="text-sm text-slate-500">
            Built in direct compliance with Indian bioenergy and agricultural soil initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {p.authority}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.summary}
                </p>
              </div>

              <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-100">
                <span className="text-[11px] font-bold text-[#14532D] uppercase tracking-wide block mb-1">
                  How PUNARNAVA Complies:
                </span>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                  {p.alignment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. THE CLOSED-LOOP AGRI-BIOMASS CYCLE */}
      <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            The Amul-Style Biomass Cooperative Flow
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Just as rural dairy farmers drop milk daily, crop stubble and cattle dung are logged and monetized.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-5 rounded-xl bg-red-50/50 border border-red-200 space-y-3">
            <span className="text-xs font-bold text-red-800 uppercase tracking-wide block">
              Linear Problem: Open Burning & Dumping
            </span>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Paddy stubble is torched in fields, generating thick winter smog.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Cattle dung dumped haphazardly in open pits, releasing raw greenhouse gases.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Excessive chemical urea destroys soil micro-organisms and earthworms.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <span className="text-xs font-bold text-[#14532D] uppercase tracking-wide block">
              PUNARNAVA Closed-Loop Biomass Loop
            </span>
            <ul className="space-y-2 text-xs text-slate-800 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-800 font-bold shrink-0">✓</span>
                <span>10-Digit UBID smart card tracks daily dung & stubble weighment.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-800 font-bold shrink-0">✓</span>
                <span>Village holding aggregated and evacuated to SATAT CBG biogas digesters.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-800 font-bold shrink-0">✓</span>
                <span>Free fermented organic Bio-Slurry returned to restore farm soil carbon.</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={() => setCurrentView('login')}
            className="px-6 py-3 text-xs font-bold text-white bg-[#14532D] hover:bg-[#0f3f22] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Login Portal</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      </section>

    </div>
  );
};
