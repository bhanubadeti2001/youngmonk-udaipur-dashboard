import React, { useState } from 'react';
import { ShieldCheck, Lock, Building2, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage({ onLogin, error }) {
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(error || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setLoading(true);
    setLocalError('');
    const success = await onLogin(tokenInput.trim());
    if (!success) {
      setLocalError('Invalid or revoked access token. Please check your protected dashboard link.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-lightgrey flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E8EB] shadow-lg p-8 space-y-6">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-navy text-white mx-auto flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6 text-softgreen" />
          </div>
          <h2 className="text-lg font-bold text-navy tracking-tight">UDAIPUR HOSTELS</h2>
          <p className="text-xs text-slate-500">Protected Client Availability & Price Monitoring System</p>
        </div>

        {/* Security Notice */}
        <div className="bg-[#FAFBFD] p-3 rounded-lg border border-[#E5E8EB] flex items-center gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-softgreen shrink-0" />
          <span>Access is restricted to authorized clients with an active session token.</span>
        </div>

        {/* Error Alert */}
        {localError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-600 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError}</span>
          </div>
        )}

        {/* Token Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Access Key / Client Token
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Enter client access token..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg border border-[#E5E8EB] bg-lightgrey focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy transition-all font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tip: You can also open the dashboard directly using your protected link URL.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !tokenInput.trim()}
            className="w-full py-2.5 px-4 bg-navy hover:bg-navy-dark text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Verifying Credentials...' : 'Unlock Protected Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-softgreen" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#E5E8EB] text-center">
          <span className="text-[11px] text-slate-400">
            Powered by Automated Cloud Playwright Crawler & Google Sheets Backend
          </span>
        </div>
      </div>
    </div>
  );
}
