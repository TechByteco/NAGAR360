'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NagarLogo } from '../../components/ui/NagarLogo';
import { signUpUser } from '../../lib/adapters/authAdapter';
import { Language } from '../../lib/types';
import { User, Mail, Phone, Lock, MapPin, Globe, CheckSquare, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Chennai');
  const [language, setLanguage] = useState<Language>('en');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!acceptedTerms) {
      setError('Please accept terms and conditions.');
      return;
    }

    signUpUser({
      fullName,
      email,
      phone,
      city,
      preferredLanguage: language,
    });
    router.push('/feed');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <NagarLogo size="lg" className="justify-center mb-2" />
          <h2 className="text-2xl font-black text-gray-900">Create Citizen Profile</h2>
          <p className="text-xs text-gray-500">Join 14,000+ active residents driving civic action</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-700 font-semibold text-xs border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Karthik Subramanian"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="karthik@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98401 23456"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Home City</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1261A0] bg-white font-semibold"
                >
                  <option value="Chennai">Chennai, Tamil Nadu</option>
                  <option value="Bengaluru">Bengaluru, Karnataka</option>
                  <option value="Mumbai">Mumbai, Maharashtra</option>
                  <option value="Delhi">Delhi NCR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Preferred Language</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1261A0] bg-white font-semibold"
                >
                  <option value="en">English</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1261A0]"
                required
              />
            </div>
          </div>

          <label className="flex items-start gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 rounded text-[#1261A0] focus:ring-[#1261A0]"
            />
            <span className="text-gray-600">
              I agree to the Nagar360 Civic Participation Guidelines and Privacy Policy.
            </span>
          </label>

          <button
            type="submit"
            className="w-full bg-[#F28C28] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#e07b18] shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Register Civic Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 pt-2">
          Already registered?{' '}
          <Link href="/login" className="text-[#1261A0] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
