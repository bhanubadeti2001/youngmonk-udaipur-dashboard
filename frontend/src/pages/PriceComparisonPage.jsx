import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { Tag, TrendingDown, Star } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function PriceComparisonPage({ prices }) {
  // Sort lowest to highest
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);

  // Available only for benchmark calculations
  const availableOnly = sortedPrices.filter(p => p.status === 'AVAILABLE' || p.status === 'LIMITED AVAILABILITY');
  const cheapest = availableOnly[0] || null;

  const chartData = sortedPrices.map(item => ({
    name: item.hostel_name.replace(' Udaipur', '').replace(' Hostel', ''),
    fullName: item.hostel_name,
    price: item.price,
    category: item.category,
    status: item.status,
    isCheapest: item.is_cheapest_available,
    marketDiff: item.market_avg_diff
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-navy text-white text-xs p-3 rounded-lg shadow-lg border border-slate-700 space-y-1">
          <div className="font-bold">{data.fullName}</div>
          <div className="text-softgreen font-semibold text-sm">₹{data.price} INR</div>
          <div className="text-[11px] text-slate-300">Category {data.category} • Status: {data.status}</div>
          <div className="text-[11px] text-slate-400">
            {data.marketDiff > 0 ? `+₹${data.marketDiff} above avg` : `${data.marketDiff} below avg`}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Cheapest Available Highlight Banner */}
      {cheapest && (
        <div className="bg-white rounded-xl p-5 border border-softgreen/40 bg-gradient-to-r from-softgreen/5 to-transparent shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-softgreen text-white flex items-center justify-center shadow-sm">
              <Star className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-softgreen text-white px-2 py-0.5 rounded">
                  Cheapest Available
                </span>
                <span className="text-xs font-semibold text-slate-400">Category {cheapest.category}</span>
              </div>
              <h3 className="text-lg font-bold text-navy mt-0.5">{cheapest.hostel_name}</h3>
              <p className="text-xs text-slate-500">Currently leading Udaipur market value with instant bookable dorm beds.</p>
            </div>
          </div>
          <div className="text-right sm:border-l sm:border-[#E5E8EB] sm:pl-6">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Rate Per Night</span>
            <div className="text-3xl font-extrabold text-softgreen leading-none mt-1">₹{cheapest.price}</div>
            <span className="text-[10px] text-slate-400">Inclusive of base taxes</span>
          </div>
        </div>
      )}

      {/* Visual Chart Card */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E8EB] shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-navy">Competitor Price Curve (Ascending INR)</h3>
            <p className="text-xs text-slate-400">Excludes sold-out or unverified properties from value leader ranking</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-softgreen"></span>
              <span className="text-slate-600">Cheapest Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-navy"></span>
              <span className="text-slate-600">Active Competitors</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: '#64748B' }} 
                interval={0}
                angle={-25}
                textAnchor="end"
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isCheapest ? '#79B85A' : '#24364B'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sorted Price Table */}
      <div className="bg-white rounded-xl border border-[#E5E8EB] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E8EB]">
          <h3 className="text-sm font-bold text-navy">Full Price Ranking & Market Variance Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBFD] text-slate-500 font-semibold border-b border-[#E5E8EB]">
                <th className="py-3 px-6">Rank</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-6">Hostel Name</th>
                <th className="py-3 px-4 text-right">Price (INR)</th>
                <th className="py-3 px-4 text-right">Market Avg Difference</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6">Price Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E8EB] text-slate-700">
              {sortedPrices.map((item, idx) => (
                <tr key={idx} className="hover:bg-lightgrey/40 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-400">#{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy text-white">
                      CAT {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-bold text-navy">{item.hostel_name}</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-navy text-sm">
                    ₹{item.price}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold">
                    {item.market_avg_diff > 0 ? (
                      <span className="text-amber-600">+{item.market_avg_diff}</span>
                    ) : item.market_avg_diff < 0 ? (
                      <span className="text-softgreen">{item.market_avg_diff}</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3.5 px-6 font-bold">
                    {item.is_cheapest_available ? (
                      <span className="px-2 py-1 rounded text-xs bg-softgreen text-white font-bold">
                        ★ CHEAPEST
                      </span>
                    ) : item.price >= 1000 ? (
                      <span className="px-2 py-1 rounded text-xs bg-navy text-white font-semibold">
                        ◆ PREMIUM
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
