import React from 'react';
import { Globe } from 'lucide-react';
import { LANGUAGE_OPTIONS } from '../constants';
import { TargetLanguage } from '../types';

interface LanguageSelectorProps {
  selected: TargetLanguage;
  onChange: (lang: TargetLanguage) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2 transition-colors duration-300">
        <Globe size={18} className="text-indigo-500 dark:text-indigo-400" />
        زبان خروجی
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {LANGUAGE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`
              relative px-4 py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform active:scale-95
              ${selected === option.id 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 scale-105 z-10' 
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;