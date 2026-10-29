import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { recentToast, dismissToast } = useApp();

  if (!recentToast) return null;

  const bgStyles = {
    success: 'bg-[#064E3B] text-white border-emerald-700',
    warning: 'bg-amber-900 text-amber-50 border-amber-700',
    info: 'bg-slate-900 text-white border-slate-700',
  }[recentToast.type];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl ${bgStyles}`}
        role="alert"
      >
        <div className="shrink-0 mt-0.5">
          {recentToast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
          {recentToast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-300" />}
          {recentToast.type === 'info' && <Info className="w-5 h-5 text-teal-300" />}
        </div>
        <div className="text-sm font-medium leading-snug flex-1 pr-2">
          {recentToast.message}
        </div>
        <button
          onClick={dismissToast}
          className="shrink-0 text-slate-300 hover:text-white p-1 rounded transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
