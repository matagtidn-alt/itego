import React from 'react';

interface ItegoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  variant?: 'dark-pill' | 'green-pill' | 'white-surface';
}

export const ItegoLogo: React.FC<ItegoLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
  variant = 'dark-pill',
}) => {
  // Size-specific styles
  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const pillPaddings = {
    sm: 'px-2.5 py-1 rounded-xl',
    md: 'px-3.5 py-1.5 rounded-2xl',
    lg: 'px-5 py-2.5 rounded-2xl',
    xl: 'px-6 py-3 rounded-3xl',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5 ml-1',
    md: 'w-2 h-2 ml-1.5',
    lg: 'w-2.5 h-2.5 ml-2',
    xl: 'w-3 h-3 ml-2.5',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Capsule Badge */}
      <div
        className={`flex items-center tracking-tight font-display font-black leading-none transition-all shadow-sm ${
          pillPaddings[size]
        } ${
          variant === 'dark-pill'
            ? 'bg-[#111113] border border-black/15 hover:bg-black'
            : variant === 'green-pill'
            ? 'bg-[#00AA13] border border-[#00AA13] shadow-emerald-900/20'
            : 'bg-white border border-gray-200 shadow-2xs'
        }`}
      >
        {/* 'ite' in WHITE (or green if on white surface) */}
        <span
          className={`font-black lowercase tracking-tighter ${textSizes[size]} ${
            variant === 'white-surface' ? 'text-[#00AA13]' : 'text-white'
          }`}
        >
          ite
        </span>

        {/* 'go' in GREEN (or white if on green pill) */}
        <span
          className={`font-black lowercase tracking-tighter ${textSizes[size]} ${
            variant === 'green-pill' ? 'text-white' : 'text-[#00AA13]'
          }`}
        >
          go
        </span>

        {/* Transport Live Status Dot */}
        <span
          className={`rounded-full shrink-0 ${dotSizes[size]} ${
            variant === 'green-pill' ? 'bg-white animate-pulse' : 'bg-[#00AA13] animate-pulse'
          }`}
        />
      </div>

      {/* Optional Subtitle for transport context */}
      {showSubtitle && (
        <div className="flex flex-col justify-center leading-tight">
          <span className="text-[10px] font-mono tracking-widest uppercase font-extrabold text-black">
            Transport
          </span>
          <span className="text-[9px] text-gray-500 font-medium">
            Gili • Lombok
          </span>
        </div>
      )}
    </div>
  );
};
