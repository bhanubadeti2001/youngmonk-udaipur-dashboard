import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, Menu } from 'lucide-react';

export default function Header({ 
  activeTabTitle, 
  lastUpdated, 
  refreshCountdown, 
  onManualRefresh, 
  isRefreshing,
  onToggleMobileMenu
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

  return (
    <header className="h-16 bg-white border-b border-[#E5E8EB] flex items-center justify-between px-4 sm:px-6 md:px-8 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onToggleMobileMenu}
          aria-label="Open Navigation Menu"
          className="md:hidden p-2 rounded-lg bg-lightgrey hover:bg-[#EAEFF4] text-navy border border-[#E5E8EB] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm sm:text-base font-bold text-navy leading-tight truncate max-w-[180px] sm:max-w-none">
            {activeTabTitle}
          </h2>
          <p className="text-[10px] sm:text-[11px] text-slate-400">11 Udaipur Competitors • Live Cloud Sync</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        {/* IST Clock - hidden on very small screens, visible on sm+ */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-lightgrey px-3 py-1.5 rounded-lg border border-[#E5E8EB]">
          <Calendar className="w-3.5 h-3.5 text-navy" />
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

        {/* Live Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-4 border-l border-[#E5E8EB]">
          <span className="w-2 h-2 rounded-full bg-softgreen animate-pulse"></span>
          <span className="text-[11px] sm:text-xs font-semibold text-navy hidden xs:inline">Live</span>
        </div>
      </div>
    </header>
  );
}
