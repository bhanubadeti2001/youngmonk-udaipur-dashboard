import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewPage from './pages/OverviewPage';
import LiveAvailabilityPage from './pages/LiveAvailabilityPage';
import WeeklyReportPage from './pages/WeeklyReportPage';
import MonthlyReportPage from './pages/MonthlyReportPage';
import CategoryPage from './pages/CategoryPage';
import PriceComparisonPage from './pages/PriceComparisonPage';
import TimeSlotPage from './pages/TimeSlotPage';
import HistoricalPage from './pages/HistoricalPage';
import SystemStatusPage from './pages/SystemStatusPage';
import LoginPage from './pages/LoginPage';
import { authService, dashboardApi } from './services/api';

const TAB_TITLES = {
  overview: 'Young Monk Hostel Udaipur — 7-Day Performance Hub',
  availability: 'Live Hostel Availability & Inventory Table',
  weekly: '7-Day Weekly Availability & Strategic Report',
  monthly: 'Young Monk Hostel Udaipur — 30-Day Monthly Performance Audit',
  categories: 'Category A, B & C Strategic Analysis',
  pricing: 'Competitive Price Ranking & Market Variance',
  timeslots: '10-Slot Intra-Day Velocity & Shift Monitoring',
  history: 'Historical Audit Log & Export Center',
  system: 'Autonomous Cloud System Health & Diagnostic Hub',
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState('udaipur');
  const [snapshotDate, setSnapshotDate] = useState(null);
  
  // Dashboard Data State
  const [overview, setOverview] = useState({});
  const [hostels, setHostels] = useState([]);
  const [categories, setCategories] = useState({});
  const [prices, setPrices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [systemStatus, setSystemStatus] = useState({});

  // Auto-refresh timer state (60 seconds)
  const [countdown, setCountdown] = useState(60);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check initial authentication
  useEffect(() => {
    const initAuth = async () => {
      // 1. Check URL query token e.g. /?token=...
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      if (urlToken) {
        const ok = await authService.login(urlToken);
        if (ok) {
          setIsAuthenticated(true);
          // Clean URL token to avoid exposing in browser address bar
          window.history.replaceState({}, document.title, window.location.pathname);
          setAuthChecking(false);
          return;
        }
      }

      // 2. Check existing session
      const valid = await authService.verify();
      setIsAuthenticated(valid);
      setAuthChecking(false);
    };

    initAuth();

    const handleUnauthorized = () => setIsAuthenticated(false);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // Fetch all live dashboard data
  const loadDashboardData = useCallback(async (city = currentCity, date = snapshotDate) => {
    if (!isAuthenticated) return;
    setIsRefreshing(true);
    try {
      const [ov, ho, cat, pr, ts, sys] = await Promise.all([
        dashboardApi.getOverview(city, date),
        dashboardApi.getHostels(city, date),
        dashboardApi.getCategories(city, date),
        dashboardApi.getPrices(city, date),
        dashboardApi.getTimeSlots(),
        dashboardApi.getSystemStatus(),
      ]);
      setOverview(ov || {});
      setHostels(ho || []);
      setCategories(cat || {});
      setPrices(pr || []);
      setTimeSlots(ts.time_slots || []);
      setSystemStatus(sys || {});
      setCountdown(60);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [isAuthenticated, currentCity, snapshotDate]);

  // Handle City Change
  const handleSelectCity = (newCity) => {
    setCurrentCity(newCity);
    loadDashboardData(newCity, snapshotDate);
  };

  // Handle Snapshot Date Change
  const handleSelectSnapshotDate = (newDate) => {
    setSnapshotDate(newDate);
    loadDashboardData(currentCity, newDate);
  };

  // Initial load when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData(currentCity, snapshotDate);
    }
  }, [isAuthenticated, currentCity, snapshotDate, loadDashboardData]);

  // 60-Second Auto Refresh Interval & Countdown
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadDashboardData(currentCity, snapshotDate);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, currentCity, snapshotDate, loadDashboardData]);

  const handleLogin = async (token) => {
    const success = await authService.login(token);
    if (success) {
      setIsAuthenticated(true);
    }
    return success;
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-lightgrey flex items-center justify-center">
        <div className="flex items-center gap-3 text-navy text-xs font-semibold">
          <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
          <span>Authenticating Protected Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const getTabTitle = (tab) => {
    if (tab === 'overview') {
      return currentCity === 'hyderabad'
        ? 'Hyderabad Hostels — Market Benchmark & Live Inventory'
        : 'Young Monk Hostel Udaipur — 7-Day Performance Hub';
    }
    if (tab === 'monthly') {
      return currentCity === 'hyderabad'
        ? 'Hyderabad Hostels — 30-Day Monthly Performance Audit'
        : 'Young Monk Hostel Udaipur — 30-Day Monthly Performance Audit';
    }
    return TAB_TITLES[tab] || '';
  };

  return (
    <div className="flex h-screen bg-lightgrey overflow-hidden font-sans">
      {/* Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        systemStatus={systemStatus}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentCity={currentCity}
        onSelectCity={handleSelectCity}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Header */}
        <Header 
          activeTabTitle={getTabTitle(activeTab)} 
          lastUpdated={overview.last_successful_update}
          refreshCountdown={countdown}
          onManualRefresh={() => loadDashboardData(currentCity, snapshotDate)}
          isRefreshing={isRefreshing}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
          currentCity={currentCity}
          onSelectCity={handleSelectCity}
          selectedSnapshotDate={snapshotDate}
          onSelectSnapshotDate={handleSelectSnapshotDate}
        />

        {/* View Page Content */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-12">
            {activeTab === 'overview' && (
              <OverviewPage 
                overview={overview} 
                hostels={hostels} 
                onNavigate={setActiveTab}
                city={currentCity}
                snapshotDate={snapshotDate}
              />
            )}
            {activeTab === 'availability' && (
              <LiveAvailabilityPage hostels={hostels} city={currentCity} snapshotDate={snapshotDate} />
            )}
            {activeTab === 'weekly' && (
              <WeeklyReportPage city={currentCity} />
            )}
            {activeTab === 'monthly' && (
              <MonthlyReportPage onNavigate={setActiveTab} city={currentCity} />
            )}
            {activeTab === 'categories' && (
              <CategoryPage categories={categories} city={currentCity} />
            )}
            {activeTab === 'pricing' && (
              <PriceComparisonPage prices={prices} city={currentCity} />
            )}
            {activeTab === 'timeslots' && (
              <TimeSlotPage timeSlots={timeSlots} hostels={hostels} city={currentCity} />
            )}
            {activeTab === 'history' && (
              <HistoricalPage city={currentCity} />
            )}
            {activeTab === 'system' && (
              <SystemStatusPage systemStatus={systemStatus} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
