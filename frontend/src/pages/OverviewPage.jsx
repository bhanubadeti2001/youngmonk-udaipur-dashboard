import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Bed, 
  Tag, 
  Clock, 
  ArrowUpRight,
  TrendingUp, 
  Award,
  Sparkles,
  Download,
  Calendar,
  Layers,
  ArrowRight
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
import StatusBadge from '../components/StatusBadge';
import { authService } from '../services/api';

export default function OverviewPage({ overview, hostels, onNavigate, city = 'udaipur' }) {
  const isHyderabad = city === 'hyderabad' || overview?.city === 'hyderabad';
  const defaultLeadName = isHyderabad ? 'Zostel Hyderabad' : 'Young Monk Hostel Udaipur';

  const ym = overview?.young_monk || {
    name: defaultLeadName,
    category: isHyderabad ? 'A' : 'B',
    total_beds: isHyderabad ? 36 : 43,
    available_beds: isHyderabad ? 10 : 11,
    occupied_beds: isHyderabad ? 26 : 32,
    occupancy_pct: 74.4,
    current_price: isHyderabad ? 799.0 : 850.0,
    weekly_avg_occupancy: 74.5,
    weekly_avg_price: isHyderabad ? 799 : 850,
    market_avg_occupancy: 62.2,
    market_avg_price: isHyderabad ? 849 : 560,
    category_b_avg_occupancy: 58.5,
    category_b_avg_price: 566,
    occupancy_outperformance: 12.3,
    occupancy_vs_cat_b: 16.0,
    price_premium_vs_market: 0,
    price_premium_vs_cat_b: 0,
    category_b_rank: 1,
    overall_market_rank: 1,
    estimated_weekly_bed_nights: 188,
    estimated_weekly_revenue: 150000,
    status: 'AVAILABLE'
  };

  const sevenDayData = overview?.seven_day_comparison || [];
  const competitors = overview?.competitor_ranking || [];

  const handleDownloadMonthlyCSV = () => {
    const token = authService.getToken();
    const url = `/api/export/monthly-csv?month=2026-11&city=${city}`;
    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const prefix = isHyderabad ? 'Hyderabad_Hostels' : 'Young_Monk_Udaipur';
        link.download = `${prefix}_Monthly_Audit_2026-11.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(err => console.error('Download error:', err));
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Property Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-softgreen/40 shadow-sm bg-gradient-to-r from-softgreen/10 via-white to-transparent">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E5E8EB]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-softgreen text-white shadow-sm">
                {isHyderabad ? '📍 HYDERABAD MARKET' : 'YOUR PROPERTY'}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-navy text-white">
                {isHyderabad ? 'Category A Flagships' : 'Category B #1 Leader'}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {isHyderabad ? 'Zostel vs The Hosteller HITEC City' : '43 Verified Beds'} • {overview?.week_range || '7-Day Rolling Benchmark'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy mt-1 tracking-tight">
              {isHyderabad 
                ? 'Hyderabad Hostels — Market Intelligence & Rate Monitor' 
                : 'Young Monk Hostel Udaipur — 7-Day Executive Hub'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              {isHyderabad
                ? 'Real-time competitive benchmark comparing Zostel Hyderabad and The Hosteller HITEC City occupancy velocity, dynamic rates, and inventory utilization.'
                : "Real-time competitive benchmark comparing Young Monk's occupancy velocity, pricing power, and bed utilization against all 10 Udaipur competitors."}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('monthly')}
              className="px-3.5 py-2 rounded-lg bg-lightgrey hover:bg-[#EAEFF4] text-navy text-xs font-semibold border border-[#E5E8EB] flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-navy" />
              <span>30-Day Monthly View</span>
            </button>

            <button
              onClick={handleDownloadMonthlyCSV}
              className="px-4 py-2 rounded-lg bg-navy hover:bg-[#1E2E40] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5 text-softgreen" />
              <span>Extract Monthly CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Core Executive Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
          {/* KPI 1 */}
          <div className="bg-white rounded-xl p-4 border border-[#E5E8EB] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">7-Day Occupancy</span>
              <div className="w-7 h-7 rounded-lg bg-softgreen/10 flex items-center justify-center text-softgreen">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">{ym.weekly_avg_occupancy}%</div>
              <div className="text-[11px] font-semibold text-softgreen mt-0.5 flex items-center gap-1">
                <span>+{ym.occupancy_outperformance}% vs market</span>
                <span className="text-slate-400 font-normal">({ym.market_avg_occupancy}%)</span>
              </div>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white rounded-xl p-4 border border-[#E5E8EB] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dorm Price Position</span>
              <div className="w-7 h-7 rounded-lg bg-softgreen/10 flex items-center justify-center text-softgreen">
                <Tag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">₹{ym.current_price}</div>
              <div className="text-[11px] font-semibold text-softgreen mt-0.5">
                {isHyderabad 
                  ? `₹${ym.current_price} active bed rate` 
                  : `+₹${ym.price_premium_vs_cat_b} premium vs Cat B peers`}
              </div>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white rounded-xl p-4 border border-[#E5E8EB] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Market Standing</span>
              <div className="w-7 h-7 rounded-lg bg-navy/10 flex items-center justify-center text-navy">
                <Award className="w-4 h-4 text-navy" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-bold text-navy tracking-tight">
                #{ym.category_b_rank} <span className="text-sm font-semibold text-slate-500">in Cat {ym.category}</span>
              </div>
              <div className="text-[11px] font-semibold text-navy mt-0.5">
                #{ym.overall_market_rank} Overall in {overview?.city_name || (isHyderabad ? 'Hyderabad' : 'Udaipur')} (out of {overview?.total_hostels || (isHyderabad ? 2 : 11)})
              </div>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-white rounded-xl p-4 border border-[#E5E8EB] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Weekly Revenue</span>
              <div className="w-7 h-7 rounded-lg bg-lightgrey flex items-center justify-center text-navy">
                <Bed className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
                ₹{(ym.estimated_weekly_revenue || 0).toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                ~{ym.estimated_weekly_bed_nights} bed nights sold this week
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 7-Day Day-Wise Occupancy Benchmark Chart */}
      <div className="bg-white rounded-xl p-5 border border-[#E5E8EB] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
              7-Day Day-by-Day Occupancy: Young Monk vs Competitor Benchmarks
            </h3>
            <p className="text-[11px] text-slate-400">
              Comparing your daily occupancy trajectory against Category B peers and the Udaipur market average
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-navy"></span>
              <span className="font-bold text-navy">Young Monk Udaipur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-400"></span>
              <span className="text-slate-600">Category B Peers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-softgreen"></span>
              <span className="text-slate-600">Market Average</span>
            </div>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sevenDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorYMOv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#24364B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#24364B" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorMktOv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#79B85A" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#79B85A" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F5F7" vertical={false} />
              <XAxis dataKey="display" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[40, 100]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-navy text-white text-xs p-3 rounded-lg shadow-lg border border-slate-700 space-y-1">
                        <div className="font-bold">{d.weekday}, {d.display} {d.is_weekend ? '★ Weekend' : ''}</div>
                        <div className="text-softgreen font-semibold">Young Monk: {d.young_monk_occ}% (₹{d.young_monk_price})</div>
                        <div className="text-slate-300">Category B Avg: {d.cat_b_avg_occ}%</div>
                        <div className="text-slate-400">Market Avg: {d.market_avg_occ}%</div>
                        <div className="text-[10px] text-softgreen font-medium">
                          Lead: +{(d.young_monk_occ - d.market_avg_occ).toFixed(1)}% above market
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="young_monk_occ" stroke="#24364B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorYMOv)" name="Young Monk" />
              <Area type="monotone" dataKey="cat_b_avg_occ" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" fill="none" name="Category B Peers" />
              <Area type="monotone" dataKey="market_avg_occ" stroke="#79B85A" strokeWidth={2} fillOpacity={1} fill="url(#colorMktOv)" name="Market Avg" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Direct Head-to-Head Competitor Benchmark Table */}
      <div className="bg-white rounded-xl border border-[#E5E8EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E8EB] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
              7-Day Competitor Head-to-Head Performance Matrix
            </h3>
            <p className="text-[11px] text-slate-400">
              Young Monk Hostel Udaipur benchmarked against all 10 competitor properties
            </p>
          </div>
          <button
            onClick={() => onNavigate('availability')}
            className="text-xs font-semibold text-navy hover:text-softgreen flex items-center gap-1.5 transition-colors"
          >
            <span>View Full 12-Column Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-[#FAFBFD] text-slate-500 font-semibold border-b border-[#E5E8EB]">
                <th className="py-3 px-4">Property Name</th>
                <th className="py-3 px-3 text-center">Cat</th>
                <th className="py-3 px-3 text-center">Total Beds</th>
                <th className="py-3 px-4 text-center">7-Day Avg Occupancy</th>
                <th className="py-3 px-4 text-center">Occupancy vs Young Monk</th>
                <th className="py-3 px-4 text-right">Dorm Price</th>
                <th className="py-3 px-4 text-right">Price Variance</th>
                <th className="py-3 px-4 text-center">Peak Demand Day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E8EB] text-slate-700">
              {competitors.map((c, idx) => {
                const isYM = c.is_young_monk;
                const occDiff = c.occ_diff_vs_young_monk;
                const priceDiff = c.price_diff_vs_young_monk;

                return (
                  <tr 
                    key={idx} 
                    className={`transition-colors ${
                      isYM 
                        ? 'bg-softgreen/10 font-bold border-l-4 border-softgreen hover:bg-softgreen/15' 
                        : 'hover:bg-lightgrey/50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isYM ? 'text-navy text-sm' : 'text-slate-800'}`}>
                          {c.hostel_name}
                        </span>
                        {isYM && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-softgreen text-white">
                            YOUR PROPERTY
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
                        <span className={`font-bold ${isYM ? 'text-navy text-sm' : ''}`}>{c.weekly_avg_occupancy}%</span>
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isYM ? 'bg-softgreen' : 'bg-navy'} rounded-full`}
                            style={{ width: `${Math.min(100, c.weekly_avg_occupancy)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isYM ? (
                        <span className="text-[10px] font-bold text-softgreen uppercase tracking-wider">Benchmark</span>
                      ) : (
                        <span className={`font-semibold ${occDiff < 0 ? 'text-softgreen' : 'text-slate-500'}`}>
                          {occDiff < 0 ? `${occDiff}% (behind you)` : `+${occDiff}% (ahead)`}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-navy">
                      ₹{c.weekly_avg_price}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isYM ? (
                        <span className="text-[10px] font-bold text-softgreen uppercase tracking-wider">Base</span>
                      ) : (
                        <span className={`font-medium ${priceDiff < 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                          {priceDiff < 0 ? `-₹${Math.abs(priceDiff)} cheaper` : `+₹${priceDiff} higher`}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-slate-500">
                      {c.peak_day}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Monthly Extraction Callout Card */}
      <div className="bg-white rounded-xl p-5 border border-[#E5E8EB] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center shrink-0 shadow-sm">
            <Calendar className="w-5 h-5 text-softgreen" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
              Need Long-Term Monthly Audit for Young Monk?
            </h4>
            <p className="text-xs text-slate-500">
              Extract 30-day daily occupancy logs, pricing shifts, and weekend yield records directly into Excel / CSV.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => onNavigate('monthly')}
            className="px-3 py-2 rounded-lg bg-lightgrey hover:bg-[#EAEFF4] text-xs font-semibold text-navy border border-[#E5E8EB] transition-all"
          >
            <span>Open Monthly View</span>
          </button>

          <button
            onClick={handleDownloadMonthlyCSV}
            className="px-4 py-2 rounded-lg bg-softgreen hover:bg-[#6CA74F] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Monthly CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}