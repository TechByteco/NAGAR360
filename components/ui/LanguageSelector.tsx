'use client';

import React from 'react';
import { Language } from '../../lib/types';
import { Globe } from 'lucide-react';

interface Props {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<Props> = ({ currentLang, onLanguageChange }) => {
  return (
    <div className="inline-flex items-center bg-white/90 border border-gray-200 rounded-lg p-0.5 shadow-xs text-xs">
      <div className="flex items-center gap-1 px-2 text-gray-500 font-medium">
        <Globe className="w-3.5 h-3.5 text-[#1261A0]" />
      </div>
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-2 py-1 rounded-md font-medium transition-all ${
          currentLang === 'en'
            ? 'bg-[#1261A0] text-white shadow-xs'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange('ta')}
        className={`px-2 py-1 rounded-md font-medium transition-all ${
          currentLang === 'ta'
            ? 'bg-[#1261A0] text-white shadow-xs'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        தமிழ்
      </button>
      <button
        onClick={() => onLanguageChange('hi')}
        className={`px-2 py-1 rounded-md font-medium transition-all ${
          currentLang === 'hi'
            ? 'bg-[#1261A0] text-white shadow-xs'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};
