import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, Menu } from 'lucide-react';

export default function Header({ 
  activeTabTitle, 
  lastUpdated, 
  refreshCountdown, 
  onManualRefresh, 
  isRefreshing,
  onToggleMobileMenu,
  currentCity = 'udaipur',
  onSelectCity,
  selectedSnapshotDate = null,
  onSelectSnapshotDate
}) {
  const [istTime, setIstTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { 
        timeZone: 'Asia/Kolkata', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      };
      setIstTime(new Intl.DateTimeFormat('en-IN', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const competitorText = currentCity === 'hyderabad' ? '2 Hyderabad Competitors' : '11 Udaipur Competitors';

  return (
    <header className="h-16 bg-white border-b border-[#E5E8EB] flex items-center justify-between px-3 sm:px-6 md:px-8 shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onToggleMobileMenu}
          aria-label="Open Navigation Menu"
          className="md:hidden p-2 rounded-lg bg-lightgrey hover:bg-[#EAEFF4] text-navy border border-[#E5E8EB] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-xs sm:text-base font-bold text-navy leading-tight truncate max-w-[140px] sm:max-w-none">
            {activeTabTitle}
          </h2>
          <p className="text-[10px] sm:text-[11px] text-slate-400">{competitorText} • Live Cloud Sync</p>
        </div>

        {/* City Toggle Pills in Header */}
        {onSelectCity && (
          <div className="flex items-center gap-1 bg-lightgrey p-1 rounded-xl border border-[#E5E8EB] ml-1 sm:ml-3">
            <button
              onClick={() => onSelectCity('udaipur')}
              className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 ${
                currentCity === 'udaipur'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy hover:bg-white/60'
              }`}
            >
              <span>📍 Udaipur</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                currentCity === 'udaipur' ? 'bg-softgreen text-navy' : 'bg-slate-200 text-slate-600'
              }`}>11</span>
            </button>
            <button
              onClick={() => onSelectCity('hyderabad')}
              className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 ${
                currentCity === 'hyderabad'
                  ? 'bg-navy text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy hover:bg-white/60'
              }`}
            >
              <span>📍 Hyderabad</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                currentCity === 'hyderabad' ? 'bg-softgreen text-navy' : 'bg-slate-200 text-slate-600'
              }`}>2</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
        {/* Previous Days Historical Snapshot Selector */}
        {onSelectSnapshotDate && (
          <div className="flex items-center gap-1.5 bg-lightgrey px-2 sm:px-3 py-1 rounded-lg border border-[#E5E8EB]">
            <Calendar className="w-3.5 h-3.5 text-navy shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                Audit Snapshot
              </span>
              <select
                value={selectedSnapshotDate || 'live'}
                onChange={(e) => onSelectSnapshotDate(e.target.value === 'live' ? null : e.target.value)}
                className="bg-transparent text-xs font-bold text-navy focus:outline-none cursor-pointer pr-1 py-0.5"
                title="Select a previous day to inspect that exact historical snapshot"
              >
                <option value="live">⚡ Live (Current View)</option>
                <optgroup label="Previous Day Snapshots (Audit Accuracy)">
                  <option value="2026-11-20">Fri, 20 Nov 2026 (Today)</option>
                  <option value="2026-11-19">Thu, 19 Nov 2026 (PMS: 22.6%)</option>
                  <option value="2026-11-18">Wed, 18 Nov 2026 (PMS: 20.8%)</option>
                  <option value="2026-11-17">Tue, 17 Nov 2026 (PMS: 39.6%)</option>
                  <option value="2026-11-16">Mon, 16 Nov 2026 (PMS: 39.6%)</option>
                  <option value="2026-11-15">Sun, 15 Nov 2026 (PMS: 51.0%)</option>
                  <option value="2026-11-14">Sat, 14 Nov 2026 (PMS: 83.0%)</option>
                  <option value="2026-11-13">Fri, 13 Nov 2026 (PMS: 51.9%)</option>
                  <option value="2026-11-12">Thu, 12 Nov 2026 (PMS: 96.2%)</option>
                  <option value="2026-11-11">Wed, 11 Nov 2026 (PMS: 98.2%)</option>
                  <option value="2026-11-10">Tue, 10 Nov 2026 (PMS: 90.6%)</option>
                  <option value="2026-11-09">Mon, 09 Nov 2026 (PMS: 54.0%)</option>
                  <option value="2026-11-08">Sun, 08 Nov 2026 (PMS: 62.0%)</option>
                  <option value="2026-11-07">Sat, 07 Nov 2026 (PMS: 88.0%)</option>
                  <option value="2026-11-06">Fri, 06 Nov 2026 (PMS: 78.5%)</option>
                  <option value="2026-11-05">Thu, 05 Nov 2026 (PMS: 46.5%)</option>
                  <option value="2026-11-04">Wed, 04 Nov 2026 (PMS: 45.0%)</option>
                  <option value="2026-11-03">Tue, 03 Nov 2026 (PMS: 48.0%)</option>
                  <option value="2026-11-02">Mon, 02 Nov 2026 (PMS: 52.0%)</option>
                  <option value="2026-11-01">Sun, 01 Nov 2026 (PMS: 68.0%)</option>
                </optgroup>
              </select>
            </div>
          </div>
        )}

        {/* IST Clock - hidden on smaller screens */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 bg-lightgrey px-3 py-1.5 rounded-lg border border-[#E5E8EB]">
          <span className="font-medium text-navy">{istTime} <span className="text-slate-400 font-normal">IST</span></span>
        </div>

        {/* Sync Countdown & Refresh */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right">
            <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Auto Sync</div>
            <div className="text-[11px] sm:text-xs font-medium text-slate-600">
              <span className="font-bold text-softgreen">{refreshCountdown}s</span>
            </div>
          </div>

          <button
            onClick={onManualRefresh}
            disabled={isRefreshing}
            title="Refresh now"
            className="w-8 h-8 rounded-lg bg-lightgrey hover:bg-[#EAEFF4] border border-[#E5E8EB] flex items-center justify-center text-navy transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-softgreen' : ''}`} />
          </button>
        </div>

        {/* Status Pill: Live vs Historical Snapshot */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3 border-l border-[#E5E8EB]">
          {selectedSnapshotDate ? (
            <button
              onClick={() => onSelectSnapshotDate(null)}
              title="Click to reset to Live real-time view"
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold border border-amber-200 transition-all cursor-pointer shadow-2xs"
            >
              <span>⏪ {selectedSnapshotDate.slice(5)}</span>
              <span className="text-[10px] text-amber-500 font-normal ml-0.5">✕ Live</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-softgreen animate-pulse"></span>
              <span className="text-[11px] sm:text-xs font-semibold text-navy hidden xs:inline">Live</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
