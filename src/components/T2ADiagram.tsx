import React, { useState } from 'react';
import { Flame, Sprout, FlaskConical, Droplets, CheckCircle2 } from 'lucide-react';

export const T2ADiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const stages = [
    {
      id: 1,
      title: 'Village Cooperative Intake',
      badge: 'Step 1: Clean Feedstock Sorting',
      icon: Sprout,
      desc: 'Local farmers deposit fresh cattle dung (desi cow/buffalo) and shredded crop stubble (paddy straw, wheat husks) using their 10-Digit UBID smart card.',
      output: 'High-nitrogen organic carbon substrate with zero plastic or chemical contamination.',
    },
    {
      id: 2,
      title: 'Thermophilic Bio-Digestion',
      badge: 'Step 2: Dual-Stage Biogas Refinery',
      icon: FlaskConical,
      desc: 'The biomass undergoes anaerobic fermentation in village-scale thermophilic digesters. Methanogenic bacteria convert volatile solids into clean enriched biomethane.',
      output: '95% pure Compressed Biogas (CBG) pressurized to 250 bar for vehicle and rural energy use.',
    },
    {
      id: 3,
      title: 'Enriched Bio-Slurry Separation',
      badge: 'Step 3: Circular Soil Rejuvenation',
      icon: Droplets,
      desc: 'Liquid and solid digestate fractions are mechanically separated and biologically stabilized into certified organic Bio-Slurry (Jeevamrutha-grade), returned free to farmers.',
      output: 'Living microbial soil restorer rich in organic carbon (NPK), ending synthetic urea dependency.',
    },
    {
      id: 4,
      title: 'Botanical Bio-Pesticides',
      badge: 'Step 4: Herbal Protection Stream',
      icon: Flame,
      desc: 'Fermented bio-slurry combined with agricultural botanical extracts (neem, karanj) yields chemical-free herbal pest repellents, closing the Trash-to-Ayurveda circle.',
      output: '100% natural crop pest immunity without harmful synthetic pesticide residue.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        
        {/* Left Column: Visual Asset */}
        <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full bg-slate-100 flex flex-col justify-end p-6">
          <img
            src="/images/t2a_biorefinery_process_1793281154502.jpg"
            alt="PUNARNAVA Agri-Biomass and Bio-Slurry Refinery"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent pointer-events-none" />
          
          <div className="relative z-10 text-white space-y-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
              T2A Spotlight
            </span>
            <h4 className="text-lg font-bold">
              Agri-Waste to Bio-Energy & Soil Health
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              How cattle dung and crop stubble generate clean Compressed Biogas (CBG) and free organic bio-slurry fertilizer.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Process Stepper */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                  GOBARdhan & SATAT Circular Loop
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  From Crop Stubble & Cow Dung to Fertile Soil
                </h3>
              </div>
            </div>

            {/* Stepper Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-lg mb-6">
              {stages.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setActiveStep(st.id)}
                  className={`py-2 px-2 text-center text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    activeStep === st.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.title}
                </button>
              ))}
            </div>

            {/* Active Stage Details */}
            {stages.map((st) => {
              if (st.id !== activeStep) return null;
              const Icon = st.icon;
              return (
                <div key={st.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#14532D]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-emerald-700">
                        {st.badge}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">
                        {st.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                      Key Deliverable & Ecological Value:
                    </span>
                    <span className="text-xs font-medium text-slate-800">
                      {st.output}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Three Deliverables Matrix */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-900 block">
                1. Compressed Biogas (CBG)
              </span>
              <span className="text-[11px] text-emerald-950 font-medium mt-0.5 block">
                Replaces fossil LPG & diesel fuel
              </span>
            </div>
            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-100">
              <span className="text-[11px] font-bold text-amber-900 block">
                2. Free Organic Bio-Slurry
              </span>
              <span className="text-[11px] text-amber-950 font-medium mt-0.5 block">
                Returned to farmers to rebuild topsoil carbon
              </span>
            </div>
            <div className="p-3 rounded-lg bg-teal-50/70 border border-teal-100">
              <span className="text-[11px] font-bold text-teal-900 block">
                3. Herbal Bio-Pesticides
              </span>
              <span className="text-[11px] text-teal-950 font-medium mt-0.5 block">
                Botanical pest immunity with 0% chemicals
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
