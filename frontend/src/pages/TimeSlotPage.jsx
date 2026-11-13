import React, { useState } from 'react';
import { Clock, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

const SCHEDULED_SLOTS = [
  { time: '12:00 AM', label: 'Midnight Final', phase: 'Night Closing' },
  { time: '06:00 AM', label: 'Early Morning', phase: 'Morning Opening' },
  { time: '08:00 AM', label: 'Breakfast Slot', phase: 'Morning Check-out' },
  { time: '10:00 AM', label: 'Morning Peak', phase: 'Pre-checkin' },
  { time: '12:00 PM', label: 'Mid-Day Check-in', phase: 'Standard Check-in' },
  { time: '02:00 PM', label: 'Afternoon Check', phase: 'Afternoon Demand' },
  { time: '04:00 PM', label: 'Late Afternoon', phase: 'Intra-day Booking' },
  { time: '06:00 PM', label: 'Evening Peak', phase: 'Walk-in Hours' },
  { time: '08:00 PM', label: 'Night Discounting', phase: 'Last-minute Dump' },
  { time: '10:00 PM', label: 'Late Night Sweep', phase: 'Final Inventory' },
];

export default function TimeSlotPage({ timeSlots, hostels }) {
  const [activeSlot, setActiveSlot] = useState('02:00 PM');

  return (
    <div className="space-y-6">
      {/* 10 Scheduled Slots Strip */}
      <div className="bg-white rounded-xl p-5 border border-[#E5E8EB] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-navy">10 Daily Crawler Time Slots (Asia/Kolkata)</h3>
            <p className="text-xs text-slate-400">Select any execution window to inspect intra-day competitor rate shifts</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-softgreen/10 text-softgreen border border-softgreen/20">
            Automated Cloud Schedulers Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {SCHEDULED_SLOTS.map((slot) => {
            const isSelected = activeSlot === slot.time;
            return (
              <button
                key={slot.time}
                onClick={() => setActiveSlot(slot.time)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-navy bg-navy text-white shadow-sm ring-1 ring-navy'
                    : 'border-[#E5E8EB] bg-[#FAFBFD] hover:bg-lightgrey text-slate-700'
                }`}
              >
                <div className={`text-xs font-bold leading-none ${isSelected ? 'text-softgreen' : 'text-navy'}`}>
                  {slot.time}
                </div>
                <div className={`text-[10px] mt-1 truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  {slot.phase}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Intra-day Shift Analysis Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 border border-[#E5E8EB] shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-navy font-bold text-xs">
            <Clock className="w-4 h-4 text-softgreen" />
            <span>Selected Window: {activeSlot}</span>
          </div>
          <p className="text-xs text-slate-500">
            Intra-day tracking captures immediate rate fluctuations when competitors run flash discounts or raise prices as beds deplete.
          </p>
          <div className="mt-4 pt-3 border-t border-[#E5E8EB] flex justify-between text-xs">
            <span className="text-slate-400">Typical Market Occupancy:</span>
            <span className="font-bold text-navy">78.5%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5E8EB] shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-navy font-bold text-xs">
            <TrendingUp className="w-4 h-4 text-softgreen" />
            <span>Last-Minute Pricing Behavior</span>
          </div>
          <p className="text-xs text-slate-500">
            Category A chains dynamically drop prices by 15-20% between 6:00 PM and 10:00 PM if remaining beds exceed 6 units.
          </p>
          <div className="mt-4 pt-3 border-t border-[#E5E8EB] flex justify-between text-xs">
            <span className="text-slate-400">Evening Discount Leader:</span>
            <span className="font-bold text-softgreen">The Hosteller (-₹191 avg)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5E8EB] shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-navy font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-navy" />
            <span>Sell-Out Velocity</span>
          </div>
          <p className="text-xs text-slate-500">
            Zostel and Young Monk consistently achieve 100% Sold-Out status earlier in the morning slots (by 12:00 PM).
          </p>
          <div className="mt-4 pt-3 border-t border-[#E5E8EB] flex justify-between text-xs">
            <span className="text-slate-400">Fastest Sell-Out:</span>
            <span className="font-bold text-navy">Zostel Udaipur</span>
          </div>
        </div>
      </div>

      {/* Snapshot for the Selected Slot */}
      <div className="bg-white rounded-xl border border-[#E5E8EB] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E8EB] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-navy">Active Snapshot across 11 Udaipur Hostels</h3>
            <p className="text-xs text-slate-400">Synchronized status across all 11 competitors for the current cycle</p>
          </div>
          <span className="text-xs font-semibold text-navy bg-lightgrey px-3 py-1 rounded-lg border border-[#E5E8EB]">
            Slot: {activeSlot}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFBFD] text-slate-500 font-semibold border-b border-[#E5E8EB]">
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Hostel Name</th>
                <th className="py-3 px-4 text-center">Beds Total</th>
                <th className="py-3 px-4 text-center">Beds Avail</th>
                <th className="py-3 px-4 text-center">Occupancy %</th>
                <th className="py-3 px-4 text-right">Dorm Price (INR)</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E8EB] text-slate-700">
              {hostels.map((h, i) => (
                <tr key={i} className="hover:bg-lightgrey/40 transition-colors">
                  <td className="py-3 px-6 font-bold text-navy">CAT {h.category}</td>
                  <td className="py-3 px-6 font-semibold text-navy">{h.hostel_name}</td>
                  <td className="py-3 px-4 text-center text-slate-500">{h.total_beds ?? '—'}</td>
                  <td className="py-3 px-4 text-center font-bold text-softgreen">{h.available_beds ?? '—'}</td>
                  <td className="py-3 px-4 text-center font-semibold text-navy">{h.occupancy_pct ? `${h.occupancy_pct}%` : '—'}</td>
                  <td className="py-3 px-4 text-right font-bold text-navy">₹{h.price || '—'}</td>
                  <td className="py-3 px-6 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-lightgrey text-navy border border-[#E5E8EB]">
                      {h.status}
                    </span>
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
