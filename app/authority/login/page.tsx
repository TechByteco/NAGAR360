'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NagarLogo } from '../../../components/ui/NagarLogo';
import { authenticateOfficial, getOfficialCredentials } from '../../../lib/adapters/authAdapter';
import { ShieldCheck, Lock, User, Key, ArrowRight, AlertCircle, Info } from 'lucide-react';

export default function AuthorityLoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const defaultCreds = getOfficialCredentials();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId.trim() || !password.trim()) {
      setError('Please enter both Official User ID and Password.');
      return;
    }

    const res = authenticateOfficial(userId, password);
    if (res.success) {
      router.push('/admin');
    } else {
      setError(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleUseDefaultCreds = () => {
    setUserId(defaultCreds.userId);
    setPassword(defaultCreds.password);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#17212B] via-slate-900 to-[#17212B] text-white -mt-4">
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#F28C28] text-white mx-auto flex items-center justify-center shadow-lg shadow-orange-500/30 mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Authority Operations Portal</h1>
          <p className="text-xs text-slate-400">
            Restricted Access • Greater Chennai Corporation & TN Municipal Officers Only
          </p>
        </div>

        {/* Credentials Notice Box */}
        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Default Official Credentials</span>
          </div>
          <div className="text-slate-300 space-y-1 font-mono text-[11px]">
            <div>User ID: <strong className="text-white bg-slate-700 px-1.5 py-0.5 rounded">{defaultCreds.userId}</strong></div>
            <div>Password: <strong className="text-white bg-slate-700 px-1.5 py-0.5 rounded">{defaultCreds.password}</strong></div>
          </div>
          <button
            type="button"
            onClick={handleUseDefaultCreds}
            className="w-full text-center text-[11px] font-bold text-amber-400 hover:underline pt-1 block"
          >
            Auto-fill Default Credentials
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-700 text-red-300 font-semibold text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-300 block mb-1">Official User ID / Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. admin"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#F28C28] hover:bg-[#e07b18] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>Authenticate Official Login</span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
          Citizen looking to report an issue?{' '}
          <Link href="/feed" className="text-amber-400 font-bold hover:underline">
            Return to Public Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
