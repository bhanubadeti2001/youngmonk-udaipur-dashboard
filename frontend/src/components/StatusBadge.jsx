import React from 'react';

export default function StatusBadge({ status }) {
  const s = String(status || '').toUpperCase();

  if (s === 'AVAILABLE') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF4E6] text-[#55863D] border border-[#79B85A]/30">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-[#79B85A]"></span>
        AVAILABLE
      </span>
    );
  }

  if (s === 'LIMITED AVAILABILITY') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
        LIMITED AVAILABILITY
      </span>
    );
  }

  if (s === 'SOLD OUT') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F3F5F7] text-slate-500 border border-[#E2E6EA]">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-slate-400"></span>
        SOLD OUT
      </span>
    );
  }

  if (s === 'DATA ERROR') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F3F5F7] text-slate-500 border border-[#E2E6EA]">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-400"></span>
        DATA ERROR
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F3F5F7] text-slate-500 border border-[#E2E6EA]">
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-slate-300"></span>
      UNKNOWN
    </span>
  );
}
