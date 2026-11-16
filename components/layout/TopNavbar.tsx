'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NagarLogo } from '../ui/NagarLogo';
import { LanguageSelector } from '../ui/LanguageSelector';
import { Language, User } from '../../lib/types';
import { getTranslation } from '../../lib/translations';
import { TAMIL_NADU_DISTRICTS } from '../../lib/store';
import {
  getCurrentUser,
  signOutUser,
} from '../../lib/adapters/authAdapter';
import {
  MapPin,
  PlusCircle,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Sparkles,
  Menu,
  X,
  Lock,
} from 'lucide-react';

interface Props {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const TopNavbar: React.FC<Props> = ({
  currentLang = 'en',
  onLanguageChange = () => {},
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Chennai');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    const handleAuthUpdate = () => setUser(getCurrentUser());
    window.addEventListener('storage', handleAuthUpdate);
    window.addEventListener('nagar360_auth_update', handleAuthUpdate);
    return () => {
      window.removeEventListener('storage', handleAuthUpdate);
      window.removeEventListener('nagar360_auth_update', handleAuthUpdate);
    };
  }, []);

  const handleSignOut = () => {
    signOutUser();
    setUser(null);
    router.push('/');
  };

  const t = (key: string) => getTranslation(currentLang, key);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      {/* Demo Mode Banner */}
      <div className="bg-gradient-to-r from-[#1261A0] via-[#2E9B5B] to-[#F28C28] text-white text-[11px] font-semibold py-1 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-200" />
        <span>Nagar360 • Active Statewide Platform (All 38 Districts of Tamil Nadu & All-India)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Statewide District Selector */}
          <div className="flex items-center gap-3">
            <NagarLogo size="md" />

            <div className="hidden md:flex items-center gap-1 bg-slate-100 border border-slate-300 rounded-full px-2.5 py-1 text-xs font-bold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-[#1261A0]" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="All Tamil Nadu">All Tamil Nadu (38 Districts)</option>
                {TAMIL_NADU_DISTRICTS.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.nameTa})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link
              href="/feed"
              className={`hover:text-[#1261A0] transition-colors ${
                pathname === '/feed' ? 'text-[#1261A0] font-bold border-b-2 border-[#1261A0] pb-1' : ''
              }`}
            >
              {t('navFeed')}
            </Link>
            <Link
              href="/near-me"
              className={`hover:text-[#1261A0] transition-colors ${
                pathname === '/near-me' ? 'text-[#1261A0] font-bold border-b-2 border-[#1261A0] pb-1' : ''
              }`}
            >
              {t('navNearMe')}
            </Link>
            <Link
              href="/map"
              className={`hover:text-[#1261A0] transition-colors ${
                pathname === '/map' ? 'text-[#1261A0] font-bold border-b-2 border-[#1261A0] pb-1' : ''
              }`}
            >
              {t('navMap')}
            </Link>
            <Link
              href="/track"
              className={`hover:text-[#1261A0] transition-colors ${
                pathname === '/track' ? 'text-[#1261A0] font-bold border-b-2 border-[#1261A0] pb-1' : ''
              }`}
            >
              {t('navTrack')}
            </Link>
            <Link
              href="/events"
              className={`hover:text-[#1261A0] transition-colors ${
                pathname === '/events' ? 'text-[#1261A0] font-bold border-b-2 border-[#1261A0] pb-1' : ''
              }`}
            >
              {t('navEvents')}
            </Link>

            {user?.role === 'official' ? (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-[#F28C28] font-bold hover:underline"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('navAdmin')}</span>
              </Link>
            ) : (
              <Link
                href="/authority/login"
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300"
                title="Municipal Officers Portal"
              >
                <Lock className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Authority Portal</span>
              </Link>
            )}
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-3">
            <LanguageSelector currentLang={currentLang} onLanguageChange={onLanguageChange} />

            {/* Primary Action Button */}
            <Link
              href="/raise-problem"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#F28C28] to-[#e07b18] hover:from-[#e07b18] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('reportIssue')}</span>
            </Link>

            {/* User Profile / Menu */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="My Profile"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full border-2 border-[#1261A0] object-cover"
                  />
                  <span className="hidden xl:inline text-xs font-bold text-gray-800 truncate max-w-[100px]">
                    {user.fullName.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-[#1261A0] hover:underline"
              >
                {t('signIn')}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
