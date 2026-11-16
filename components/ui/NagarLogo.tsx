import React from 'react';
import Link from 'next/link';

interface NagarLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const NagarLogo: React.FC<NagarLogoProps> = ({
  className = '',
  showTagline = true,
  size = 'md',
}) => {
  const logoHeights = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group cursor-pointer ${className}`}>
      {/* City 360 Emblem */}
      <div className={`${iconSizes[size]} relative shrink-0 group-hover:scale-105 transition-transform duration-200`}>
        <img
          src="/nagar360-logo.svg"
          alt="Nagar360 Emblem"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Official Typography */}
      <div className="flex flex-col justify-center">
        <div className={`${textSizes[size]} font-black tracking-tight leading-none text-[#0D3B66] flex items-center`}>
          <span>NAGAR</span>
          <span className="text-[#00A88F] flex items-center ml-0.5">
            36
            {/* Compass Pin inside 0 */}
            <span className="relative inline-flex items-center justify-center w-[0.85em] h-[0.85em] rounded-full border-[2.5px] border-[#00A88F] ml-[0.05em] align-middle">
              <span className="w-1.5 h-1.5 bg-[#0D3B66] rotate-45 transform origin-center rounded-xs" />
            </span>
          </span>
        </div>

        {showTagline && (
          <span className="text-[8px] sm:text-[9px] font-extrabold text-[#0D3B66] tracking-widest uppercase mt-1 leading-none">
            CITYWIDE ACCOUNTABILITY & TRANSPARENCY
          </span>
        )}
      </div>
    </Link>
  );
};
