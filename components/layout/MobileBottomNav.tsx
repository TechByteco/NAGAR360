'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Navigation, Plus, Map, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2 flex items-center justify-around shadow-lg">
      <Link
        href="/feed"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
          pathname === '/feed' ? 'text-[#1261A0] font-bold' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Feed</span>
      </Link>

      <Link
        href="/near-me"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
          pathname === '/near-me' ? 'text-[#1261A0] font-bold' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Navigation className="w-5 h-5" />
        <span>Near Me</span>
      </Link>

      {/* Prominent Center Action (+) Button */}
      <Link
        href="/raise-problem"
        className="flex items-center justify-center -mt-6 w-12 h-12 rounded-full bg-gradient-to-tr from-[#F28C28] to-[#2E9B5B] text-white shadow-lg shadow-orange-600/30 hover:scale-105 transition-transform"
        title="Report an Issue"
      >
        <Plus className="w-7 h-7 stroke-[3]" />
      </Link>

      <Link
        href="/map"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
          pathname === '/map' ? 'text-[#1261A0] font-bold' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Map className="w-5 h-5" />
        <span>Map</span>
      </Link>

      <Link
        href="/profile"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
          pathname === '/profile' ? 'text-[#1261A0] font-bold' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Impact</span>
      </Link>
    </nav>
  );
};
