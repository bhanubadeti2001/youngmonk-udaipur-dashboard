import React from 'react';
import { 
  LayoutDashboard, 
  BedDouble, 
  Layers, 
  BarChart3, 
  Clock, 
  History, 
  Activity, 
  LogOut,
  ShieldCheck,
  Building2,
  CalendarDays,
  Calendar,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview (7-Day Hub)', icon: LayoutDashboard },
  { id: 'availability', label: 'Live Availability', icon: BedDouble },
  { id: 'weekly', label: 'Weekly Availability & Report', icon: CalendarDays },
  { id: 'monthly', label: 'Monthly Performance & Audit', icon: Calendar },
  { id: 'categories', label: 'Category Analysis', icon: Layers },
  { id: 'pricing', label: 'Price Comparison', icon: BarChart3 },
  { id: 'timeslots', label: 'Time Slot Analysis', icon: Clock },
  { id: 'history', label: 'Historical Reports', icon: History },
  { id: 'system', label: 'System Status', icon: Activity },
];

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onLogout, 
  systemStatus,
  isOpen,
  onClose,
  currentCity = 'udaipur',
  onSelectCity
}) {
  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E5E8EB] flex flex-col h-screen select-none shrink-0 shadow-sm transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#E5E8EB]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5 text-softgreen" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-navy tracking-tight leading-none uppercase">
                {currentCity === 'hyderabad' ? 'HYDERABAD' : 'UDAIPUR'} HOSTELS
              </h1>
              <p className="text-[11px] font-medium text-slate-400 mt-1">Market Intelligence</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-navy hover:bg-lightgrey rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Market City Switcher */}
        {onSelectCity && (
          <div className="p-3 border-b border-[#E5E8EB] bg-[#FAFBFD]">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Market
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-lightgrey rounded-xl border border-[#E5E8EB]">
              <button
                onClick={() => onSelectCity('udaipur')}
                className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentCity === 'udaipur'
                    ? 'bg-navy text-white shadow-sm'
                    : 'text-slate-600 hover:text-navy hover:bg-white/60'
                }`}
              >
                <span>📍 Udaipur</span>
                <span className={`text-[10px] font-medium ${currentCity === 'udaipur' ? 'text-softgreen' : 'text-slate-400'}`}>
                  11 Hostels
                </span>
              </button>
              <button
                onClick={() => onSelectCity('hyderabad')}
                className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentCity === 'hyderabad'
                    ? 'bg-navy text-white shadow-sm'
                    : 'text-slate-600 hover:text-navy hover:bg-white/60'
                }`}
              >
                <span>📍 Hyderabad</span>
                <span className={`text-[10px] font-medium ${currentCity === 'hyderabad' ? 'text-softgreen' : 'text-slate-400'}`}>
                  2 Hostels
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Monitoring Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-navy text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:bg-lightgrey hover:text-navy'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-softgreen' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Cloud & Protected Status Footer */}
        <div className="p-4 border-t border-[#E5E8EB] bg-[#FAFBFD] space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-softgreen" />
              Protected Client View
            </span>
            <span className="w-2 h-2 rounded-full bg-softgreen animate-pulse"></span>
          </div>

          <div className="text-[10px] text-slate-400 bg-white p-2.5 rounded border border-[#E5E8EB] space-y-1">
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="font-medium text-navy">Google Sheets</span>
            </div>
            <div className="flex justify-between">
              <span>Connection:</span>
              <span className="font-medium text-softgreen">Connected</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
