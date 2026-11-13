import React, { useState, useEffect } from 'react';
import { Search, Filter, CalendarDays, Table, RefreshCw, Calendar } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { dashboardApi } from '../services/api';

export default function LiveAvailabilityPage({ hostels }) {
  const [viewMode, setViewMode] = useState('today'); // 'today' or 'weekly'
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Weekly matrix state (Calendar Week: Monday to Sunday)
  const [selectedWeek, setSelectedWeek] = useState('2026-11-10');
  const [weeklyData, setWeeklyData] = useState(null);
  const [weeklyLoading, setWeeklyLoading] = useState(false);

  const weekOptions = [
    { start: '2026-11-10', label: 'Mon 10 Nov – Sun 16 Nov (Current Calendar Week)' },
    { start: '2026-11-17', label: 'Mon 17 Nov – Sun 23 Nov (Next Calendar Week)' },
    { start: '2026-11-24', label: 'Mon 24 Nov – Sun 30 Nov (Week + 2)' },
    { start: '2026-11-03', label: 'Mon 03 Nov – Sun 09 Nov (Past Calendar Week)' },
  ];

  useEffect(() => {
    if (viewMode === 'weekly' && !weeklyData) {
      loadWeeklyData(selectedWeek);
    }
  }, [viewMode]);

  const loadWeeklyData = async (startDate) => {
    setWeeklyLoading(true);
    try {
      const data = await dashboardApi.getWeeklyAvailability(startDate);
      setWeeklyData(data);
    } catch (err) {
      console.error('Failed to load weekly availability:', err);
    } finally {
      setWeeklyLoading(false);
    }
  };

  const handleWeekChange = (newStart) => {
    setSelectedWeek(newStart);
    loadWeeklyData(newStart);
  };

  const filteredHostels = hostels.filter(h => {
    const matchCat = selectedCat === 'ALL' || h.category === selectedCat;
    const matchSearch = h.hostel_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const weeklyHostels = (weeklyData?.hostels || []).filter(h => {
    const matchCat = selectedCat === 'ALL' || h.category === selectedCat;
    const matchSearch = h.hostel_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* View Switcher: Today's Snapshot vs 7-Day Weekly Matrix */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E5E8EB] shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'today'
                ? 'bg-navy text-white shadow-sm'
                : 'bg-lightgrey text-slate-600 hover:bg-[#EAEFF4]'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Today's Live Snapshot</span>
          </button>

          <button
            onClick={() => {
              setViewMode('weekly');
              if (!weeklyData) loadWeeklyData(selectedWeek);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'weekly'
                ? 'bg-navy text-white shadow-sm'
                : 'bg-lightgrey text-slate-600 hover:bg-[#EAEFF4]'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-softgreen" />
            <span>7-Day Weekly Availability</span>
          </button>
        </div>

        {/* If in Weekly mode, show Week Selector */}
        {viewMode === 'weekly' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-medium text-slate-400">Week:</span>
            <select
              value={selectedWeek}
              onChange={(e) => handleWeekChange(e.target.value)}
              className="bg-lightgrey text-xs font-bold text-navy py-1.5 px-3 rounded-lg border border-[#E5E8EB] focus:outline-none focus:ring-1 focus:ring-navy w-full sm:w-auto"
            >
              {weekOptions.map(opt => (
                <option key={opt.start} value={opt.start}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-[#E5E8EB] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'A', 'B', 'C'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCat === cat
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-lightgrey text-slate-600 hover:bg-[#EAEFF4]'
              }`}
            >
              {cat === 'ALL' ? 'All Hostels (11)' : `Category ${cat}`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search competitor hostel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-[#E5E8EB] bg-lightgrey focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy transition-all"
          />
        </div>
      </div>

      {/* VIEW 1: TODAY'S 12-COLUMN TABLE */}
      {viewMode === 'today' && (
        <div className="bg-white rounded-xl border border-[#E5E8EB] shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-[#FAFBFD] text-slate-500 font-semibold border-b border-[#E5E8EB]">
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-6">Hostel Name</th>
                  <th className="py-3 px-4 text-center">Total Beds</th>
                  <th className="py-3 px-4 text-center">Occupied Beds</th>
                  <th className="py-3 px-4 text-center">Available Beds</th>
                  <th className="py-3 px-4 text-center">Occupancy %</th>
                  <th className="py-3 px-4 text-right">Price / Night</th>
                  <th className="py-3 px-3 text-center">Currency</th>
                  <th className="py-3 px-4 text-center">Check-in</th>
                  <th className="py-3 px-4 text-center">Check-out</th>
                  <th className="py-3 px-6 text-center">Availability Status</th>
                  <th className="py-3 px-6 text-slate-400">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E8EB] text-slate-700">
                {filteredHostels.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="py-8 text-center text-slate-400">
                      No hostels found matching the filter.
                    </td>
                  </tr>
                ) : (
                  filteredHostels.map((h, idx) => (
                    <tr key={idx} className="hover:bg-lightgrey/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-navy text-white">
                          CAT {h.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-bold text-navy">{h.hostel_name}</td>
                      <td className="py-3.5 px-4 text-center text-slate-600 font-medium">{h.total_beds ?? '—'}</td>
                      <td className="py-3.5 px-4 text-center font-medium text-slate-600">{h.occupied_beds ?? '—'}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-softgreen">{h.available_beds ?? '—'}</td>
                      <td className="py-3.5 px-4 text-center font-semibold">
                        {h.occupancy_pct !== null && h.occupancy_pct !== undefined ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <span>{h.occupancy_pct}%</span>
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-navy rounded-full" 
                                style={{ width: `${Math.min(100, h.occupancy_pct)}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-navy">
                        {h.price ? `₹${h.price}` : '—'}
                      </td>
                      <td className="py-3.5 px-3 text-center text-[11px] text-slate-400">{h.currency || 'INR'}</td>
                      <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-[11px]">{h.checkin || '—'}</td>
                      <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-[11px]">{h.checkout || '—'}</td>
                      <td className="py-3.5 px-6 text-center">
                        <StatusBadge status={h.status} />
                      </td>
                      <td className="py-3.5 px-6 text-slate-400 font-mono text-[11px]">{h.last_updated || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: 7-DAY WEEKLY AVAILABILITY MATRIX */}
      {viewMode === 'weekly' && (
        <div className="space-y-4">
          {weeklyLoading ? (
            <div className="bg-white rounded-xl p-12 border border-[#E5E8EB] flex items-center justify-center gap-3 text-xs text-navy font-semibold">
              <RefreshCw className="w-4 h-4 animate-spin text-softgreen" />
              <span>Loading 7-Day Day-wise Matrix ({selectedWeek})...</span>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E5E8EB] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E5E8EB] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
                    7-Day Rolling Availability Matrix ({weeklyData?.week_range})
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Day-by-day bed counts and nightly rate forecast per property
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#FAFBFD] text-slate-500 font-semibold border-b border-[#E5E8EB]">
                      <th className="py-3 px-4 sticky left-0 bg-[#FAFBFD] z-10 shadow-sm">Hostel Name</th>
                      <th className="py-3 px-3 text-center">Cat</th>
                      <th className="py-3 px-3 text-center">Total Beds</th>
                      <th className="py-3 px-3 text-center">Avg Rate</th>
                      {(weeklyData?.days || []).map((d) => (
                        <th 
                          key={d.date} 
                          className={`py-3 px-3 text-center ${d.is_weekend ? 'bg-softgreen/5 font-bold text-navy border-x border-[#E5E8EB]/50' : ''}`}
                        >
                          <div>{d.display}</div>
                          <div className="text-[10px] font-medium text-slate-400">
                            {d.weekday} {d.is_weekend && '★'}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E8EB] text-slate-700">
                    {weeklyHostels.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="py-8 text-center text-slate-400">
                          No hostels found matching the filter.
                        </td>
                      </tr>
                    ) : (
                      weeklyHostels.map((h, idx) => (
                        <tr key={idx} className="hover:bg-lightgrey/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-navy sticky left-0 bg-white hover:bg-lightgrey/50 z-10 shadow-sm">
                            {h.hostel_name}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-navy text-white">
                              {h.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center text-slate-500 font-medium">{h.total_beds}</td>
                          <td className="py-3 px-3 text-center font-bold text-navy">₹{h.weekly_avg_price}</td>
                          {(weeklyData?.days || []).map((d) => {
                            const dayData = h.days[d.date] || {};
                            const isSold = dayData.status === 'SOLD OUT' || dayData.available_beds === 0;
                            const isLimited = dayData.status === 'LIMITED AVAILABILITY' || (dayData.available_beds > 0 && dayData.available_beds <= 3);

                            return (
                              <td 
                                key={d.date} 
                                className={`py-2 px-3 text-center ${d.is_weekend ? 'bg-softgreen/5 border-x border-[#E5E8EB]/30' : ''}`}
                              >
                                <div className="flex flex-col items-center gap-0.5">
                                  <span className={`text-[11px] font-bold ${
                                    isSold 
                                      ? 'text-slate-400 line-through' 
                                      : isLimited 
                                      ? 'text-amber-600' 
                                      : 'text-softgreen'
                                  }`}>
                                    {isSold ? 'Sold Out' : `${dayData.available_beds} beds`}
                                  </span>
                                  <span className="text-[10px] font-semibold text-navy">
                                    {dayData.price ? `₹${dayData.price}` : '—'}
                                  </span>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
