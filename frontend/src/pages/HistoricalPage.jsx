import React, { useState, useEffect } from 'react';
import { Calendar, Download, Filter, Search, Loader2 } from 'lucide-react';
import { dashboardApi } from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function HistoricalPage() {
  const [filterType, setFilterType] = useState('today');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [historyRows, setHistoryRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadHistory = async (type = filterType, start = customStart, end = customEnd) => {
    setLoading(true);
    try {
      const data = await dashboardApi.getHistory(type, start, end);
      setHistoryRows(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(filterType);
  }, [filterType]);

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      loadHistory('custom', customStart, customEnd);
    }
  };

  const filtered = historyRows.filter(r => 
    (r.hostel_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.tracking_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCsv = () => {
    if (!filtered.length) return;
    const headers = ['Tracking ID', 'Report Date', 'Time Slot', 'Category', 'Hostel Name', 'Total Beds', 'Available Beds', 'Occupied Beds', 'Occupancy %', 'Price (INR)', 'Checkin', 'Checkout', 'Status', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...filtered.map(r => [
        `"${r.tracking_id || ''}"`,
        `"${r.report_date || ''}"`,
        `"${r.time_slot || ''}"`,
        `"${r.category || ''}"`,
        `"${r.hostel_name || ''}"`,
        r.total_beds ?? '',
        r.available_beds ?? '',
        r.occupied_beds ?? '',
        r.occupancy_pct ?? '',
        r.price ?? '',
        `"${r.checkin || ''}"`,
        `"${r.checkout || ''}"`,
        `"${r.status || ''}"`,
        `"${r.last_updated || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `udaipur_hostel_history_${filterType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Date Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-[#E5E8EB] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Preset Range Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: 'last_7_days', label: 'Last 7 Days' },
            { id: 'last_30_days', label: 'Last 30 Days' },
            { id: 'custom', label: 'Custom Range' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterType(btn.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === btn.id
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-lightgrey text-slate-600 hover:bg-[#EAEFF4]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Custom Date Pickers */}
        {filterType === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <input 
              type="date" 
              value={customStart} 
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2.5 py-1 border border-[#E5E8EB] rounded bg-lightgrey focus:bg-white text-navy text-xs" 
            />
            <span className="text-slate-400">to</span>
            <input 
              type="date" 
              value={customEnd} 
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2.5 py-1 border border-[#E5E8EB] rounded bg-lightgrey focus:bg-white text-navy text-xs" 
            />
            <button
              onClick={handleCustomApply}
              className="px-3 py-1 bg-softgreen hover:bg-softgreen-dark text-white rounded font-medium text-xs shadow-sm"
            >
              Apply
            </button>
          </div>
        )}

        {/* Search & Export Buttons */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E5E8EB] bg-lightgrey focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy w-44"
            />
          </div>

          <button
            onClick={exportCsv}
            disabled={!filtered.length}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-lightgrey hover:bg-[#EAEFF4] text-navy border border-[#E5E8EB] transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-softgreen" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Historical Records Table */}
      <div className="bg-white rounded-xl border border-[#E5E8EB] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E8EB] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-navy">Verified Historical Crawler Audit Trail</h3>
            <p className="text-xs text-slate-400">All historical snapshots preserved chronologically in Google Sheets</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-lightgrey px-3 py-1 rounded-lg">
            {filtered.length} Records Found
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-softgreen" />
              <span className="text-xs font-medium">Querying Google Sheets historical records...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No historical records found for the selected date filter.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-[#FAFBFD] text-slate-500 font-semibold border-b border-[#E5E8EB]">
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Slot</th>
                  <th className="py-3 px-3">Cat</th>
                  <th className="py-3 px-6">Hostel Name</th>
                  <th className="py-3 px-4 text-center">Beds Total</th>
                  <th className="py-3 px-4 text-center">Beds Avail</th>
                  <th className="py-3 px-4 text-center">Beds Occ</th>
                  <th className="py-3 px-4 text-center">Occ %</th>
                  <th className="py-3 px-4 text-right">Price (INR)</th>
                  <th className="py-3 px-4 text-center">Check-in</th>
                  <th className="py-3 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E8EB] text-slate-700 font-mono text-[11px]">
                {filtered.map((r, i) => (
                  <tr key={i} className="hover:bg-lightgrey/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-400">{r.tracking_id || '—'}</td>
                    <td className="py-3 px-4 text-navy font-semibold">{r.report_date}</td>
                    <td className="py-3 px-4 text-slate-600">{r.time_slot}</td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-navy text-white font-sans">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3 px-6 font-bold text-navy font-sans text-xs">{r.hostel_name}</td>
                    <td className="py-3 px-4 text-center text-slate-500">{r.total_beds ?? '—'}</td>
                    <td className="py-3 px-4 text-center font-bold text-softgreen">{r.available_beds ?? '—'}</td>
                    <td className="py-3 px-4 text-center text-slate-500">{r.occupied_beds ?? '—'}</td>
                    <td className="py-3 px-4 text-center font-semibold text-navy">{r.occupancy_pct !== null ? `${r.occupancy_pct}%` : '—'}</td>
                    <td className="py-3 px-4 text-right font-bold text-navy font-sans text-xs">
                      {r.price ? `₹${r.price}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500">{r.checkin || '—'}</td>
                    <td className="py-3 px-6 text-center font-sans">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
