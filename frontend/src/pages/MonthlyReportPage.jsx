import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  Bed, 
  Tag, 
  Award, 
  Sparkles, 
  RefreshCw,
  Building2,
  CheckCircle2,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { dashboardApi, authService } from '../services/api';

export default function MonthlyReportPage({ onNavigate }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const monthOptions = [
    { value: '2026-11', label: 'November 2026 (Current Month)' },
    { value: '2026-10', label: 'October 2026 (Previous Month)' },
    { value: '2026-09', label: 'September 2026' },
  ];

  const fetchMonthlyData = async (month) => {
    setLoading(true);
    try {
      const res = await dashboardApi.getMonthlyAnalysis(month);
      setData(res);
    } catch (err) {
      console.error('Failed to load monthly data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyData(selectedMonth);
  }, [selectedMonth]);

  const handleDownloadCSV = () => {
    const token = authService.getToken();
    const url = `/api/export/monthly-csv?month=${selectedMonth}`;
    
    // Fetch with auth and trigger file download
    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Young_Monk_Udaipur_Monthly_Audit_${selectedMonth}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(err => console.error('Download error:', err));
  };

  if (loading && !data) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-navy border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Calculating 30-day market velocity and Young Monk performance...</p>
      </div>
    );
  }

  const ym = data?.young_monk || {};
  const mkt = data?.market_summary || {};
  const dailyTracking = data?.daily_tracking || [];
  const competitors = data?.competitors_monthly || [];

  return (
    <div className="space-y-6">
      {/* Top Banner: Month Selector & CSV Extraction */}
      <div className="bg-white rounded-xl p-4 border border-[#E5E8EB] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center text-white shrink-0 shadow-sm">
              <Calendar className="w-4 h-4 text-softgreen" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audit Period</span>
              <span className="text-xs font-bold text-navy">{data?.month_name || 'November 2026'}</span>
            </div>
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full sm:w-64 bg-lightgrey text-xs font-bold text-navy py-2 px-3 rounded-lg border border-[#E5E8EB] focus:outline-none focus:ring-1 focus:ring-navy"
          >
            {monthOptions.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => fetchMonthlyData(selectedMonth)}
            disabled={loading}
            className="px-3 py-2 rounded-lg bg-lightgrey hover:bg-[#EAEFF4] text-xs font-semibold text-navy border border-[#E5E8EB] flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-softgreen' : ''}`} />
            <span>Recalculate</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 rounded-lg bg-navy hover:bg-[#1E2E40] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-softgreen" />
            <span>Extract Monthly Data (CSV)</span>
          </button>
        </div>
      </div>

      {/* Hero Performance Card for Young Monk */}
      <div className="bg-white rounded-xl p-5 border border-softgreen/50 bg-gradient-to-r from-softgreen/5 via-white to-transparent shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E8EB]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-softgreen text-white">
                YOUR PROPERTY
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy text-white">
                Category B #1 Leader
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                • 43 Verified Beds
              </span>
            </div>
            <h2 className="text-lg font-bold text-navy mt-1">Young Monk Hostel Udaipur — Monthly Business Audit</h2>
            <p className="text-xs text-slate-500">
              Complete {data?.month_name} performance analysis comparing your occupancy, rates, and revenue against 10 Udaipur competitors.
            </p>
          </div>

          <div className="flex items-center gap-6 text-right">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Category B Rank</div>
              <div className="text-xl font-bold text-softgreen flex items-center gap-1 justify-end">
                <Award className="w-4 h-4" />
                <span>#1 of 3</span>
              </div>
            </div>
            <div className="pl-6 border-l border-[#E5E8EB]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Udaipur Market Rank</div>
              <div className="text-xl font-bold text-navy">#3 of 11</div>
            </div>
          </div>
        </div>

        {/* 4 Monthly Highlight Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
          <div className="bg-lightgrey/60 rounded-lg p-3.5 border border-[#E5E8EB]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Monthly Avg Occupancy</span>
            <div className="text-2xl font-bold text-navy mt-1">{ym.monthly_avg_occupancy}%</div>
            <div className="text-[11px] font-semibold text-softgreen mt-0.5">
              +{ym.occ_advantage_vs_market}% vs market avg ({mkt.monthly_avg_occupancy}%)
            </div>
          </div>

          <div className="bg-lightgrey/60 rounded-lg p-3.5 border border-[#E5E8EB]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Estimated Monthly Revenue</span>
            <div className="text-2xl font-bold text-navy mt-1">₹{(ym.estimated_monthly_revenue || 0).toLocaleString('en-IN')}</div>
            <div className="text-[11px] font-semibold text-navy mt-0.5">
              Across ~{ym.total_bed_nights_sold} bed nights sold
            </div>
          </div>

          <div className="bg-lightgrey/60 rounded-lg p-3.5 border border-[#E5E8EB]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Average Dorm Rate</span>
            <div className="text-2xl font-bold text-navy mt-1">₹{ym.monthly_avg_price}</div>
            <div className="text-[11px] font-semibold text-softgreen mt-0.5">
              +₹{ym.price_premium_vs_cat_b} premium vs Cat B peers
            </div>
          </div>

          <div className="bg-lightgrey/60 rounded-lg p-3.5 border border-[#E5E8EB]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Weekend Surge Occupancy</span>
            <div className="text-2xl font-bold text-navy mt-1">{ym.weekend_avg_occupancy}%</div>
            <div className="text-[11px] font-semibold text-softgreen mt-0.5">
              +{ym.weekend_yield_diff}% lift over weekdays ({ym.weekday_avg_occupancy}%)
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Day-by-Day Occupancy Trend Chart */}
      <div className="bg-white rounded-xl p-5 border border-[#E5E8EB] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
              30-Day Day-Wise Occupancy Curve: Young Monk vs Udaipur Market Benchmark
            </h3>
            <p className="text-[11px] text-slate-400">
              Continuous tracking throughout {data?.month_name} (Friday & Saturday peaks highlighted)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-navy"></span>
              <span className="font-semibold text-navy">Young Monk Udaipur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-softgreen"></span>
              <span className="text-slate-600">Udaipur Market Average</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTracking} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorYM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#24364B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#24364B" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorMKT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#79B85A" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#79B85A" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F5F7" vertical={false} />
              <XAxis dataKey="display" tick={{ fill: '#64748b', fontSize: 10 }} interval={2} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[30, 100]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-navy text-white text-xs p-3 rounded-lg shadow-lg border border-slate-700 space-y-1">
                        <div className="font-bold">{d.weekday}, {d.display} {d.is_weekend ? '★ Weekend' : ''}</div>
                        <div className="text-white font-semibold">Young Monk: <span className="text-softgreen font-bold">{d.young_monk_occ}%</span> (₹{d.young_monk_price})</div>
                        <div className="text-slate-300">Market Avg: {d.market_avg_occ}%</div>
                        <div className="text-[10px] text-softgreen font-medium">
                          Lead: +{(d.young_monk_occ - d.market_avg_occ).toFixed(1)}%
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="young_monk_occ" stroke="#24364B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorYM)" name="Young Monk" />
              <Area type="monotone" dataKey="market_avg_occ" stroke="#79B85A" strokeWidth={2} fillOpacity={1} fill="url(#colorMKT)" name="Market Average" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full 11 Competitors Monthly Performance Ranking Table */}
      <div className="bg-white rounded-xl border border-[#E5E8EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E8EB] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
              {data?.month_name} Competitor Market Share & Performance Ranking
            </h3>
            <p className="text-[11px] text-slate-400">
              Ranked from highest to lowest monthly occupancy across all 11 monitored hostels
            </p>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="text-xs font-semibold text-navy hover:text-softgreen flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-softgreen" />
            <span>Download CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[#FAFBFD] text-slate-500 font-semibold border-b border-[#E5E8EB]">
                <th className="py-3 px-3 text-center">Rank</th>
                <th className="py-3 px-4">Hostel Name</th>
                <th className="py-3 px-3 text-center">Cat</th>
                <th className="py-3 px-3 text-center">Total Beds</th>
                <th className="py-3 px-4 text-center">Monthly Avg Occupancy</th>
                <th className="py-3 px-4 text-center">Weekend Peak Occ</th>
                <th className="py-3 px-4 text-right">Avg Dorm Rate</th>
                <th className="py-3 px-4 text-center">Est Bed Nights Sold</th>
                <th className="py-3 px-4 text-right">Est Monthly Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E8EB] text-slate-700">
              {competitors.map((c, idx) => {
                const isYM = c.is_young_monk;
                return (
                  <tr 
                    key={idx} 
                    className={`transition-colors ${
                      isYM 
                        ? 'bg-softgreen/10 font-bold border-l-4 border-softgreen hover:bg-softgreen/15' 
                        : 'hover:bg-lightgrey/50'
                    }`}
                  >
                    <td className="py-3 px-3 text-center font-bold text-slate-500">
                      {isYM ? <span className="text-softgreen">★ {idx + 1}</span> : `#${idx + 1}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isYM ? 'text-navy text-sm' : 'text-slate-800'}`}>
                          {c.hostel_name}
                        </span>
                        {isYM && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-softgreen text-white">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isYM ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600'}`}>
                        CAT {c.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-medium">{c.total_beds}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-bold ${isYM ? 'text-navy text-sm' : ''}`}>{c.monthly_avg_occupancy}%</span>
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isYM ? 'bg-softgreen' : 'bg-navy'} rounded-full`}
                            style={{ width: `${Math.min(100, c.monthly_avg_occupancy)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-600">
                      {c.weekend_avg_occupancy}%
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-navy">
                      ₹{c.monthly_avg_price}
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-slate-600">
                      {c.total_bed_nights_sold}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-navy">
                      ₹{c.estimated_monthly_revenue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}