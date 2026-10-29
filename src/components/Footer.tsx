import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, RefreshCw, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, navigateToView, resetDemoData } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission Statement */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#14532D] flex items-center justify-center text-emerald-300">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                PUNARNAVA
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300 max-w-lg">
              Rural India's Unified Cow Dung & Agri-Biomass Bank (SIH26195 | Problem Statement: T2A - Trash-to-Ayurveda). 
              A village cooperative network transforming cattle dung and post-harvest crop residue into clean compressed biogas (CBG) and free organic bio-slurry fertilizer.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="text-emerald-400 font-semibold">GOBARdhan Scheme</span>
              <span>·</span>
              <span>SATAT CBG Policy</span>
              <span>·</span>
              <span>PM-PRANAM Bio-Fertilizer</span>
              <span>·</span>
              <span>Zero Stubble Smog</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Platform Views
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  About & Our Goal
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToView('user-dashboard')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Farmer Portal (Read-Only)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToView('admin-dashboard')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Cooperative Manager Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Utilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              System & State
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Real-time reactive state with persistent village ledger. Deposits logged at village weighment scales sync directly to farmer UBIDs and feature-phone SMS simulators.
            </p>
            <button
              onClick={resetDemoData}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl transition-colors border border-slate-700 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Demo Baseline
            </button>
          </div>

        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 PUNARNAVA Ecosystem. Dedicated to National Rural Bio-Energy & Soil Restoration.
          </div>
          <div className="flex items-center gap-6">
            <span>Rural Agri-Biomass Ledger v3.0</span>
            <span>·</span>
            <span>SIH26195 / T2A</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
