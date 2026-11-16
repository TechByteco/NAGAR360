'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NagarLogo } from '../../components/ui/NagarLogo';
import { signInDemoCitizen, signInDemoOfficial, signInWithGoogle, signUpUser } from '../../lib/adapters/authAdapter';
import { ShieldCheck, UserCheck, Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGoogleSignIn = () => {
    signInWithGoogle(email || 'citizen.google@gmail.com');
    router.push('/feed');
  };

  const handleDemoCitizen = () => {
    signInDemoCitizen();
    router.push('/feed');
  };

  const handleDemoOfficial = () => {
    signInDemoOfficial();
    router.push('/admin');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    signUpUser({
      fullName: email.split('@')[0] || 'User',
      email,
      city: 'Chennai',
      preferredLanguage: 'en',
    });
    router.push('/feed');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <NagarLogo size="lg" className="justify-center mb-2" />
          <h2 className="text-2xl font-black text-gray-900">Sign in to Nagar360</h2>
          <p className="text-xs text-gray-500">Access citizen reporting & civic impact dashboard</p>
        </div>

        {/* Google / Gmail Sign In Facility */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold py-3 px-4 rounded-2xl shadow-xs flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="text-xs sm:text-sm">Sign in with Google (Gmail)</span>
        </button>

        {/* 1-Click Demo Logins Box */}
        <div className="bg-gradient-to-br from-amber-50 to-blue-50 p-4 rounded-2xl border border-amber-200 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-[#F28C28]" />
            <span>Hackathon Quick Demo Access</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDemoCitizen}
              className="bg-[#1261A0] hover:bg-[#0d4d80] text-white p-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
            >
              <UserCheck className="w-5 h-5" />
              <span>Demo Citizen</span>
            </button>

            <button
              onClick={handleDemoOfficial}
              className="bg-[#F28C28] hover:bg-[#e07b18] text-white p-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02]"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Demo Official</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-gray-400 font-semibold uppercase absolute">Or Email Login</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-700 font-semibold text-xs border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="font-bold text-gray-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1261A0] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#0d4d80] shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In with Password</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 pt-2">
          New to Nagar360?{' '}
          <Link href="/signup" className="text-[#1261A0] font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
