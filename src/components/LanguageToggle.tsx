import React from 'react';
import { Language } from '../types';

interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="flex gap-1.5 w-full bg-gray-100 p-1 rounded-xl border border-gray-200">
      <button
        type="button"
        onClick={() => onLanguageChange('id')}
        className={`flex-1 py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          currentLanguage === 'id'
            ? 'bg-[#00AA13] text-white shadow-xs'
            : 'text-gray-600 hover:text-black'
        }`}
      >
        ID
      </button>

      <button
        type="button"
        onClick={() => onLanguageChange('en')}
        className={`flex-1 py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          currentLanguage === 'en'
            ? 'bg-[#00AA13] text-white shadow-xs'
            : 'text-gray-600 hover:text-black'
        }`}
      >
        EN
      </button>
    </div>
  );
};
