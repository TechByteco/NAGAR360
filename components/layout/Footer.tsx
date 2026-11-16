import React from 'react';
import Link from 'next/link';
import { NagarLogo } from '../ui/NagarLogo';
import { AlertOctagon, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#17212B] text-gray-300 pt-12 pb-20 md:pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="bg-white/90 p-2.5 rounded-xl inline-block">
              <NagarLogo showTagline={false} size="md" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Nagar360 is an AI-powered civic complaint platform and social network for Indian cities. Turning civic complaints into community action.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Namma Nagar, Namma Poruppu</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explore Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/feed" className="hover:text-white transition-colors">Civic Complaints Feed</Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-white transition-colors">Interactive City Map</Link>
              </li>
              <li>
                <Link href="/near-me" className="hover:text-white transition-colors">Issues Near Me</Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">Track Complaint Ticket</Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">Cleanliness Events</Link>
              </li>
            </ul>
          </div>

          {/* Info Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Information</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Nagar360</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-white transition-colors">City Departments</Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">Help & Privacy Policy</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-orange-400 text-orange-300 font-semibold transition-colors">Authority Portal Login</Link>
              </li>
            </ul>
          </div>

          {/* Emergency Disclaimer Banner */}
          <div className="space-y-3 bg-red-950/40 border border-red-800/60 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>Emergency Disclaimer</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-normal">
              Nagar360 is not an emergency service. For immediate danger, life-threatening situation, or police assistance, contact official emergency services:
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs font-bold text-white">
              <span className="bg-red-700 px-2 py-1 rounded">Police: 100</span>
              <span className="bg-red-700 px-2 py-1 rounded">National: 112</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Nagar360. Built for Indian Municipal Transparency & Civic Pride.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for Cleaner Cities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
