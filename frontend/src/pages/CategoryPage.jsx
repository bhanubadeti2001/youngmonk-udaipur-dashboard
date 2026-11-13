import React from 'react';
import { Layers, CheckCircle2, XCircle, Tag, Bed, Percent } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function CategoryPage({ categories }) {
  const catList = [
    { key: 'A', title: 'CATEGORY A – Major Hostels & National Chains', desc: 'Flagship competitor network with standardized bed inventories' },
    { key: 'B', title: 'CATEGORY B – Mid-Scale & Established Competitors', desc: 'Local established backpacking stays with independent platforms' },
    { key: 'C', title: 'CATEGORY C – Boutique & Budget Stays', desc: 'Lakeside and historic boutique hostels' },
  ];

  return (
    <div className="space-y-8">
      {catList.map((cat) => {
        const data = categories[cat.key] || {
          total_hostels: 0,
          available_hostels: 0,
          sold_out_hostels: 0,
          lowest_price: null,
          verified_available_beds: 0,
          avg_occupancy: null,
          hostels: []
        };

        return (
          <div key={cat.key} className="bg-white rounded-xl border border-[#E5E8EB] shadow-sm overflow-hidden">
            {/* Category Header */}
            <div className="px-6 py-4 bg-[#FAFBFD] border-b border-[#E5E8EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-navy text-white">
                    CATEGORY {cat.key}
                  </span>
                  <h3 className="text-sm font-bold text-navy">{cat.title}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">{cat.desc}</p>
              </div>

              {/* 5 Category Metric Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-[#E5E8EB]">
                  <span className="text-slate-400">Total:</span>
                  <span className="font-bold text-navy">{data.total_hostels}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-[#E5E8EB]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-softgreen" />
                  <span className="text-slate-400">Available:</span>
                  <span className="font-bold text-softgreen">{data.available_hostels}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-[#E5E8EB]">
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Sold Out:</span>
                  <span className="font-bold text-slate-600">{data.sold_out_hostels}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-[#E5E8EB]">
                  <Tag className="w-3.5 h-3.5 text-softgreen" />
                  <span className="text-slate-400">Lowest:</span>
                  <span className="font-bold text-navy">{data.lowest_price ? `₹${data.lowest_price}` : '—'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-[#E5E8EB]">
                  <Bed className="w-3.5 h-3.5 text-navy" />
                  <span className="text-slate-400">Avail Beds:</span>
                  <span className="font-bold text-navy">{data.verified_available_beds}</span>
                </div>
              </div>
            </div>

            {/* Properties Table for Category */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-white text-slate-400 border-b border-[#E5E8EB] font-medium">
                    <th className="py-3 px-6">Hostel Name</th>
                    <th className="py-3 px-4 text-center">Total Capacity</th>
                    <th className="py-3 px-4 text-center">Occupied Beds</th>
                    <th className="py-3 px-4 text-center">Available Beds</th>
                    <th className="py-3 px-4 text-center">Occupancy %</th>
                    <th className="py-3 px-4 text-right">Dorm Price</th>
                    <th className="py-3 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E8EB] text-slate-700">
                  {data.hostels.map((h, i) => (
                    <tr key={i} className="hover:bg-lightgrey/40 transition-colors">
                      <td className="py-3 px-6 font-bold text-navy">{h.hostel_name}</td>
                      <td className="py-3 px-4 text-center text-slate-500 font-medium">{h.total_beds ?? '—'}</td>
                      <td className="py-3 px-4 text-center text-slate-500 font-medium">{h.occupied_beds ?? '—'}</td>
                      <td className="py-3 px-4 text-center font-bold text-softgreen">{h.available_beds ?? '—'}</td>
                      <td className="py-3 px-4 text-center font-semibold text-navy">
                        {h.occupancy_pct !== null && h.occupancy_pct !== undefined ? `${h.occupancy_pct}%` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-navy">
                        {h.price ? `₹${h.price}` : '—'}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <StatusBadge status={h.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
