import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CalendarDays, 
  Download, 
  TrendingUp, 
  Bed, 
  Tag, 
  Sparkles,
  ChevronRight,
  RefreshCw,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { dashboardApi } from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function WeeklyReportPage({ city = 'udaipur' }) {
  const [selectedWeek, setSelectedWeek] = useState('2026-11-10');
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const weekOptions = [
    { start: '2026-11-10', label: 'Mon 10 Nov – Sun 16 Nov 2026 (Current Calendar Week)' },
    { start: '2026-11-17', label: 'Mon 17 Nov – Sun 23 Nov 2026 (Next Calendar Week)' },
    { start: '2026-11-24', label: 'Mon 24 Nov – Sun 30 Nov 2026 (Week + 2)' },
    { start: '2026-11-03', label: 'Mon 03 Nov – Sun 09 Nov 2026 (Previous Calendar Week)' },
  ];

  const fetchWeeklyData = async (startDate, targetCity = city) => {
    setLoading(true);
    try {
      const data = await dashboardApi.getWeeklyAvailability(startDate, targetCity);
      setWeeklyData(data);
    } catch (err) {
      console.error('Failed to fetch weekly data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyData(selectedWeek, city);
  }, [selectedWeek, city]);

  const handleDownloadCSV = () => {
    if (!weeklyData || !weeklyData.hostels) return;
    const days = weeklyData.days || [];
    
    // Build CSV Header
    let csv = `Category,Hostel Name,Total Beds,Weekly Avg Price,Weekly Avg Occupancy,Peak Day,` + 
      days.map(d => `"${d.display} (${d.weekday}) Avail Beds","${d.display} Price"`).join(',') + '\n';

    // Build Rows
    weeklyData.hostels.forEach(h => {
      const dayCells = days.map(d => {
        const dayInfo = h.days[d.date] || {};
        return `${dayInfo.available_beds ?? ''},${dayInfo.price ?? ''}`;
      }).join(',');

      csv += `"${h.category}","${h.hostel_name}",${h.total_beds},${h.weekly_avg_price},${h.weekly_avg_occupancy}%,"${h.peak_day}",${dayCells}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cityName = city === 'hyderabad' ? 'Hyderabad' : 'Udaipur';
    link.setAttribute('download', `${cityName}_Hostel_Weekly_Report_${selectedWeek}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !weeklyData) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-navy border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Calculating 7-day weekly market velocity...</p>
      </div>
    );
  }

  const summary = weeklyData?.summary || {};
  const days = weeklyData?.days || [];
  const dailyTrends = weeklyData?.daily_trends || [];
  const rawHostels = weeklyData?.hostels || [];

  const hostels = rawHostels.filter(h => 
    selectedCategory === 'ALL' || h.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Top Filter and Controls Bar */}
      <div className="bg-white rounded-xl p-4 border border-[#E5E8EB] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-white shrink-0">
              <CalendarDays className="w-4 h-4 text-softgreen" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selected Week Slot</span>
              <span className="text-xs font-bold text-navy">{weeklyData?.week_range || '7-Day Rolling Window'}</span>
            </div>
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-full sm:w-72 bg-lightgrey text-xs font-semibold text-navy py-2 px-3 rounded-lg border border-[#E5E8EB] focus:outline-none focus:ring-1 focus:ring-navy"
            >
              {weekOptions.map(opt => (
                <option key={opt.start} value={opt.start}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => fetchWeeklyData(selectedWeek)}
            disabled={loading}
            className="px-3 py-2 rounded-lg bg-lightgrey hover:bg-[#EAEFF4] text-xs font-semibold text-navy border border-[#E5E8EB] flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-softgreen' : ''}`} />
            <span>Refresh Week</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 rounded-lg bg-softgreen hover:bg-[#6CA74F] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Weekly CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Weekly Executive KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E5E8EB] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Weekly Avg Occupancy</span>
            <div className="w-7 h-7 rounded-lg bg-softgreen/10 flex items-center justify-center text-softgreen">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-navy">{summary.weekly_avg_occupancy}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Across all 11 properties</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E5E8EB] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Peak Demand Day</span>
            <div className="w-7 h-7 rounded-lg bg-navy/10 flex items-center justify-center text-navy">
              <Sparkles className="w-4 h-4 text-navy" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg sm:text-xl font-bold text-navy truncate">{summary.peak_demand_day}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Highest week occupancy</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E5E8EB] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Weekly Avg Dorm Rate</span>
            <div className="w-7 h-7 rounded-lg bg-softgreen/10 flex items-center justify-center text-softgreen">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-navy">₹{summary.weekly_avg_price}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Weighted benchmark rate</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E5E8EB] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lowest Rate Opportunity</span>
            <div className="w-7 h-7 rounded-lg bg-lightgrey flex items-center justify-center text-navy">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg sm:text-xl font-bold text-navy truncate">{summary.lowest_rate_day}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Most competitive rates</div>
          </div>
        </div>
      </div>

      {/* 7-Day Day-by-Day Demand Velocity Chart */}
      <div className="bg-white rounded-xl p-5 border border-[#E5E8EB] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
              7-Day Day-Wise Occupancy & Bed Inventory Curve
            </h3>
            <p className="text-[11px] text-slate-400">
              Daily trend from {weeklyData?.week_range} (Weekend peaks highlighted)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-navy"></span>
              <span className="text-slate-600">Occupancy %</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-softgreen"></span>
              <span className="text-slate-600">Available Beds</span>
            </div>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#24364B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#24364B" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorBeds" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#79B85A" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#79B85A" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F5F7" vertical={false} />
              <XAxis dataKey="display" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-navy text-white text-xs p-3 rounded-lg shadow-lg border border-slate-700 space-y-1">
                        <div className="font-bold">{data.weekday}, {data.display} {data.is_weekend ? '★ Weekend' : ''}</div>
                        <div className="text-softgreen font-semibold">Occupancy: {data.avg_occupancy}%</div>
                        <div className="text-slate-300">Available Beds: {data.total_available_beds}</div>
                        <div className="text-slate-400">Market Avg Rate: ₹{data.avg_price}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="avg_occupancy" stroke="#24364B" strokeWidth={2} fillOpacity={1} fill="url(#colorOcc)" name="Occupancy %" />
              <Area type="monotone" dataKey="total_available_beds" stroke="#79B85A" strokeWidth={2} fillOpacity={1} fill="url(#colorBeds)" name="Available Beds" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day Day-by-Day Matrix Table */}
      <div className="bg-white rounded-xl border border-[#E5E8EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E8EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
              7-Day Hostel Availability & Pricing Matrix
            </h3>
            <p className="text-[11px] text-slate-400">
              Day-by-day bed counts and nightly dorm prices for all 11 monitored hostels
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            {['ALL', 'A', 'B', 'C'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-navy text-white'
                    : 'bg-lightgrey text-slate-600 hover:bg-[#EAEFF4]'
                }`}
              >
                {cat === 'ALL' ? 'All (11)' : `Cat ${cat}`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[#FAFBFD] text-slate-500 font-semibold border-b border-[#E5E8EB]">
                <th className="py-3 px-4 sticky left-0 bg-[#FAFBFD] z-10 shadow-sm">Hostel Name</th>
                <th className="py-3 px-3 text-center">Cat</th>
                <th className="py-3 px-3 text-center">Beds</th>
                <th className="py-3 px-3 text-center">Avg Rate</th>
                {days.map((d) => (
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
              {hostels.map((h, idx) => (
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
                  {days.map((d) => {
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}